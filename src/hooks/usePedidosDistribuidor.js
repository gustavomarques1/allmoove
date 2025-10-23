import { useState, useEffect } from 'react';
import { getPedidosDoDistribuidor } from '../api/pedidosServices';
import { getDashboardData, extrairIndicador } from '../api/dashboardServices';
import api from '../api/api';
import logger from '../utils/logger';

export const usePedidosDistribuidor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Indicadores - podem vir da API de Dashboard ou ser calculados localmente
  const [indicadores, setIndicadores] = useState({
    novosPedidos: 0,
    emAndamento: 0,
    concluidos: 0,
    totalFaturamento: 0,
    valorRecebido: 0,
    valorAReceber: 0,
    pecasPorSegmento: []
  });

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const idPessoa = localStorage.getItem('idPessoa');

        // 🔧 PASSO 0: Tenta buscar dados do dashboard primeiro (para indicadores agregados)
        let dashboardData = [];
        try {
          dashboardData = await getDashboardData('DISTRIBUIDOR', idPessoa);
        } catch (dashError) {
          logger.warn('⚠️ Dashboard API não disponível para distribuidor, usando cálculo local');
        }

        // 🔧 PASSO 1: Tentar buscar todos os segmentos de uma vez
        logger.info('🔍 Tentando buscar todos os segmentos da API...');
        const segmentosMap = {};

        try {
          const segmentosResponse = await api.get('/api/ProdutoSegmentos', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const segmentos = segmentosResponse.data;

          if (Array.isArray(segmentos) && segmentos.length > 0) {
            segmentos.forEach(seg => {
              const nomeSegmento = seg.nome || seg.descricao;
              if (seg.id && nomeSegmento) {
                segmentosMap[seg.id] = nomeSegmento;
              }
            });
            logger.info(`✅ ${Object.keys(segmentosMap).length} segmentos carregados da API:`, segmentosMap);
          } else {
            logger.warn('⚠️ API retornou array vazio de segmentos');
          }
        } catch (segError) {
          logger.error('❌ Erro ao buscar lista de segmentos:', segError.response?.status, segError.message);
          logger.warn('⚠️ Continuando sem categorização por segmento');
        }

        // 🔧 PASSO 2: Busca os pedidos do distribuidor
        const data = await getPedidosDoDistribuidor();

        // Se há pedidos, busca os items de cada um
        if (data && data.length > 0) {
          logger.info('📦 Buscando items para', data.length, 'pedidos...');

          const pedidosComItems = await Promise.all(
            data.map(async (pedido) => {
              try {
                // Busca os items do pedido
                const itemsResponse = await api.get(`/api/PedidoItems/pedido/${pedido.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                let items = itemsResponse.data || [];

                // Busca informações completas de cada produto (incluindo categoria)
                items = await Promise.all(
                  items.map(async (item) => {
                    try {
                      const produtoResponse = await api.get(`/api/Produtos/${item.idProduto}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });

                      const produto = produtoResponse.data;

                      // 🔧 Usa o mapa de segmentos carregado anteriormente
                      let categoria = 'Outros';

                      if (produto.idSegmento && segmentosMap[produto.idSegmento]) {
                        categoria = segmentosMap[produto.idSegmento];
                        logger.info(`    ✅ Produto #${item.idProduto} (${produto.nome}) → Categoria: "${categoria}" (da API)`);
                      } else if (produto.idSegmento) {
                        logger.info(`    ⚠️ Produto #${item.idProduto} (${produto.nome}) → Segmento ID ${produto.idSegmento} não encontrado no mapa`);
                        logger.info(`    📝 Usando categoria padrão: "Outros"`);
                      } else {
                        logger.info(`    ℹ️ Produto #${item.idProduto} (${produto.nome}) → Sem segmento definido, usando "Outros"`);
                      }

                      // Adiciona categoria/segmento ao item
                      return {
                        ...item,
                        categoria
                      };
                    } catch (prodError) {
                      logger.warn(`    ❌ Erro ao buscar produto #${item.idProduto}:`, prodError.message);
                      // Se falhar, retorna o item sem categoria
                      return {
                        ...item,
                        categoria: 'Outros'
                      };
                    }
                  })
                );

                // Calcula o total baseado nos items
                const valorProdutos = items.reduce((acc, item) => {
                  return acc + ((item.preco || 0) * (item.quantidade || 0) - (item.desconto || 0));
                }, 0);

                const valorFrete = pedido.valorFrete || 0;
                const totalPago = valorProdutos + valorFrete;

                logger.info(`  Pedido #${pedido.id}: ${items.length} items, Total: R$ ${totalPago.toFixed(2)}`);

                // Retorna o pedido com items e total calculado
                return {
                  ...pedido,
                  items,
                  totalPago,
                  valorProdutos
                };
              } catch (itemError) {
                logger.warn(`⚠️ Não foi possível buscar items do pedido ${pedido.id}:`, itemError.message);
                // Retorna o pedido sem items
                return {
                  ...pedido,
                  items: [],
                  totalPago: pedido.totalPago || 0
                };
              }
            })
          );

          setPedidos(pedidosComItems);

          // Usa indicadores da API de Dashboard se disponíveis, senão calcula localmente
          if (dashboardData && dashboardData.length > 0) {
            const novosFromApi = extrairIndicador(dashboardData, 'novosPedidos');
            const emAndamentoFromApi = extrairIndicador(dashboardData, 'emAndamento');
            const concluidosFromApi = extrairIndicador(dashboardData, 'concluidos');
            const faturamentoFromApi = extrairIndicador(dashboardData, 'totalFaturamento');
            const recebidoFromApi = extrairIndicador(dashboardData, 'valorRecebido');
            const aReceberFromApi = extrairIndicador(dashboardData, 'valorAReceber');

            logger.info('📊 Usando indicadores da API de Dashboard (distribuidor):', {
              novos: novosFromApi,
              emAndamento: emAndamentoFromApi,
              concluidos: concluidosFromApi,
              faturamento: faturamentoFromApi
            });

            // Para pecasPorSegmento, sempre calcula localmente (dados complexos)
            const segmentosCalculados = calcularPecasPorSegmento(pedidosComItems);

            setIndicadores({
              novosPedidos: novosFromApi ?? 0,
              emAndamento: emAndamentoFromApi ?? 0,
              concluidos: concluidosFromApi ?? 0,
              totalFaturamento: faturamentoFromApi ?? 0,
              valorRecebido: recebidoFromApi ?? 0,
              valorAReceber: aReceberFromApi ?? 0,
              pecasPorSegmento: segmentosCalculados
            });
          } else {
            logger.info('📊 Calculando indicadores localmente (distribuidor)');
            calcularIndicadores(pedidosComItems);
          }
        } else {
          setPedidos([]);
          calcularIndicadores([]);
        }

      } catch (err) {
        logger.error('Erro ao carregar pedidos do distribuidor:', err);
        setError(err.message || 'Erro ao carregar pedidos');
        setPedidos([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  // Função auxiliar para calcular peças por segmento
  const calcularPecasPorSegmento = (listaPedidos) => {
    if (!Array.isArray(listaPedidos) || listaPedidos.length === 0) {
      return [];
    }

    const segmentosMap = {};
    let totalPecas = 0;

    listaPedidos.forEach(pedido => {
      if (Array.isArray(pedido.items)) {
        pedido.items.forEach(item => {
          const segmento = item.categoria || item.segmento || item.produtoSegmento || 'Outros';
          const quantidade = item.quantidade || 0;

          if (!segmentosMap[segmento]) {
            segmentosMap[segmento] = 0;
          }
          segmentosMap[segmento] += quantidade;
          totalPecas += quantidade;
        });
      }
    });

    return Object.entries(segmentosMap).map(([segmento, quantidade]) => ({
      segmento,
      quantidade,
      percentual: totalPecas > 0 ? Math.round((quantidade / totalPecas) * 100) : 0
    })).sort((a, b) => b.quantidade - a.quantidade);
  };

  const calcularIndicadores = (listaPedidos) => {
    if (!Array.isArray(listaPedidos) || listaPedidos.length === 0) {
      setIndicadores({
        novosPedidos: 0,
        emAndamento: 0,
        concluidos: 0,
        totalFaturamento: 0,
        valorRecebido: 0,
        valorAReceber: 0,
        pecasPorSegmento: []
      });
      return;
    }

    // Novos pedidos: Aguardando Aceite
    const novos = listaPedidos.filter(
      p => p.status === 'Aguardando Aceite'
    ).length;

    // Em andamento: Aceito, Em Separação, Aguardando Retirada, Em Trânsito
    const emAndamento = listaPedidos.filter(
      p => p.status === 'Aceito' ||
           p.status === 'Em Separação' ||
           p.status === 'Aguardando Retirada' ||
           p.status === 'Em Trânsito'
    ).length;

    // Concluídos: Entregue ao Cliente, Concluído
    const concluidos = listaPedidos.filter(
      p => p.status === 'Entregue ao Cliente' ||
           p.status === 'Concluído'
    ).length;

    // Faturamento total (soma de todos os pedidos não cancelados)
    const faturamento = listaPedidos
      .filter(p => p.status !== 'Cancelado' && p.status !== 'Recusado')
      .reduce((acc, p) => acc + (p.totalPago || 0), 0);

    // Valor Recebido: pedidos entregues/concluídos
    const recebido = listaPedidos
      .filter(p => p.status === 'Entregue ao Cliente' || p.status === 'Concluído')
      .reduce((acc, p) => acc + (p.totalPago || 0), 0);

    // Valor A Receber: pedidos em andamento
    const aReceber = listaPedidos
      .filter(p =>
        p.status === 'Aguardando Aceite' ||
        p.status === 'Aceito' ||
        p.status === 'Em Separação' ||
        p.status === 'Aguardando Retirada' ||
        p.status === 'Em Trânsito'
      )
      .reduce((acc, p) => acc + (p.totalPago || 0), 0);

    // Peças por Segmento: usa função auxiliar
    const pecasPorSegmento = calcularPecasPorSegmento(listaPedidos);

    setIndicadores({
      novosPedidos: novos,
      emAndamento: emAndamento,
      concluidos: concluidos,
      totalFaturamento: faturamento,
      valorRecebido: recebido,
      valorAReceber: aReceber,
      pecasPorSegmento
    });
  };

  return {
    pedidos,
    isLoading,
    error,
    indicadores
  };
};
