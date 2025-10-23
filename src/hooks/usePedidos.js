import { useState, useEffect, useCallback } from 'react';
import { getPedidosDaAssistencia } from '../api/pedidosServices';
import { getDashboardData, extrairIndicador } from '../api/dashboardServices';
import api from '../api/api';
import logger from '../utils/logger';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Indicadores - podem vir da API de Dashboard ou ser calculados localmente
  const [indicadores, setIndicadores] = useState({
    totalPedidos: 0,
    pedidosEncerrados: 0,
    pedidosEmAndamento: 0
  });

  const calcularIndicadores = useCallback((listaPedidos) => {
    if (!Array.isArray(listaPedidos) || listaPedidos.length === 0) {
      setIndicadores({
        totalPedidos: 0,
        pedidosEncerrados: 0,
        pedidosEmAndamento: 0
      });
      return;
    }

    const total = listaPedidos.length;

    // Status finalizados (pedidos que chegaram ao fim do ciclo)
    const statusEncerrados = [
      'Entregue',
      'Concluído',
      'Finalizado',
      'Entregue ao Cliente',
      'Cancelado',
      'Recusado'
    ];

    const encerrados = listaPedidos.filter(p =>
      statusEncerrados.includes(p.status)
    ).length;

    // Pedidos em andamento = tudo que NÃO está encerrado
    // Isso inclui: ATIVO, Aguardando Aceite, Aceito, Em Trânsito, Em Separação, etc.
    const emAndamento = total - encerrados;

    logger.info('📊 Indicadores calculados:', {
      total,
      encerrados,
      emAndamento,
      statusPedidos: listaPedidos.map(p => p.status)
    });

    setIndicadores({
      totalPedidos: total,
      pedidosEncerrados: encerrados,
      pedidosEmAndamento: emAndamento
    });
  }, []);

  const carregarPedidos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const idPessoa = localStorage.getItem('idPessoa');

      // Tenta buscar dados do dashboard primeiro (para indicadores agregados)
      let dashboardData = [];
      try {
        dashboardData = await getDashboardData('ASSISTENCIA_TECNICA', idPessoa);
      } catch (dashError) {
        logger.warn('⚠️ Dashboard API não disponível, usando cálculo local');
      }

      const data = await getPedidosDaAssistencia();

      logger.info('📦 Buscando items para', data.length, 'pedidos...');

      // Busca os items de cada pedido
      const pedidosComItems = await Promise.all(
        data.map(async (pedido) => {
          // Tenta buscar dados complementares do cache local (workaround enquanto backend não salva)
          const pedidoCache = localStorage.getItem(`pedido_${pedido.id}`);
          const dadosCache = pedidoCache ? JSON.parse(pedidoCache) : {};

          let items = [];

          try {
            // Busca os items do pedido via API
            const itemsResponse = await api.get(`/api/PedidoItems/pedido/${pedido.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            items = itemsResponse.data || [];
            logger.info(`  ✅ Pedido #${pedido.id}: ${items.length} items encontrados`);
          } catch (itemError) {
            logger.warn(`  ⚠️ Não foi possível buscar items do pedido ${pedido.id}:`, itemError.message);
            // Se falhar, tenta buscar do cache local
            items = dadosCache.items || [];
          }

          // Calcula o total baseado nos items (se houver)
          let valorProdutos = 0;
          let totalPago = 0;

          if (items.length > 0) {
            valorProdutos = items.reduce((acc, item) => {
              return acc + ((item.preco || 0) * (item.quantidade || 0) - (item.desconto || 0));
            }, 0);

            const valorFrete = pedido.valorFrete || 0;
            totalPago = valorProdutos + valorFrete;
          } else {
            // Se não houver items, usa os valores do pedido ou cache
            totalPago = pedido.totalPago || pedido.total_pago || pedido.TOTAL_PAGO || pedido.valorFrete || dadosCache.totalPago || 0;
          }

          return {
            ...pedido,
            // Compatibilidade de campos
            status: pedido.status || pedido.situacao || pedido.SITUACAO || 'Aguardando Aceite',
            fornecedor: pedido.fornecedor || pedido.FORNECEDOR || dadosCache.fornecedor || 'N/A',
            codigoEntrega: pedido.codigoEntrega || pedido.codigo_entrega || pedido.CODIGO_ENTREGA || dadosCache.codigoEntrega || `M${pedido.id}X${Math.floor(Math.random() * 10)}`,
            tipoEntrega: pedido.tipoEntrega || pedido.tipo_entrega || pedido.TIPO_ENTREGA || dadosCache.tipoEntrega || 'Normal',
            totalPago,
            valorProdutos,
            dataPedido: pedido.dataPedido || pedido.dataHoraCriacaoRegistro || pedido.DATA_HORA_CRICAO_REGISTRO,
            metodoPagamento: pedido.metodoPagamento || pedido.formaPagamento || dadosCache.metodoPagamento || 'N/A',
            // Adiciona os items ao pedido
            items
          };
        })
      );

      // Ordena pedidos do mais recente para o mais antigo
      const pedidosOrdenados = pedidosComItems.sort((a, b) => {
        const dataA = new Date(a.dataPedido || a.dataHoraCriacaoRegistro || 0);
        const dataB = new Date(b.dataPedido || b.dataHoraCriacaoRegistro || 0);
        return dataB - dataA; // Ordem decrescente (mais recente primeiro)
      });

      logger.info('📦 Pedidos normalizados e ordenados (mais recente primeiro):', pedidosOrdenados);

      // DEBUG: Mostrar status de cada pedido e quantidade de items
      logger.info('🔍 Status dos pedidos:', pedidosOrdenados.map(p => ({
        id: p.id,
        status: p.status,
        data: p.dataPedido,
        items: p.items?.length || 0
      })));

      setPedidos(pedidosOrdenados);

      // Usa indicadores da API de Dashboard se disponíveis, senão calcula localmente
      if (dashboardData && dashboardData.length > 0) {
        // Mapeamento correto das chaves da API
        const concluidosFromApi = extrairIndicador(dashboardData, 'PEDIDOS_CONCLUIDO');
        const emAndamentoFromApi = extrairIndicador(dashboardData, 'PEDIDOS_ANDAMENTO');

        // 🔧 WORKAROUND: API retorna valores zerados (backend precisa corrigir)
        // Se API retorna 0 mas temos pedidos, usa cálculo local
        const totalFromApi = (concluidosFromApi !== null && emAndamentoFromApi !== null)
          ? concluidosFromApi + emAndamentoFromApi
          : null;

        const apiTemDados = totalFromApi !== null && totalFromApi > 0;

        if (apiTemDados) {
          logger.info('📊 Usando indicadores da API de Dashboard:', {
            total: totalFromApi,
            encerrados: concluidosFromApi,
            emAndamento: emAndamentoFromApi
          });

          setIndicadores({
            totalPedidos: totalFromApi,
            pedidosEncerrados: concluidosFromApi,
            pedidosEmAndamento: emAndamentoFromApi
          });
        } else {
          logger.warn('⚠️ API de Dashboard retorna dados zerados. Usando cálculo local.');
          logger.info('📊 Calculando indicadores localmente');
          calcularIndicadores(pedidosOrdenados);
        }
      } else {
        logger.info('📊 Calculando indicadores localmente');
        // Calcula os indicadores baseado nos pedidos
        calcularIndicadores(pedidosOrdenados);
      }

    } catch (err) {
      logger.error('Erro ao carregar pedidos:', err);
      setError(err.message || 'Erro ao carregar pedidos');
      // Se houver erro, mantém os indicadores zerados
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  }, [calcularIndicadores]);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  return {
    pedidos,
    isLoading,
    error,
    indicadores,
    recarregar: carregarPedidos
  };
};
