import { useState, useEffect } from 'react';
import { getPedidosDaAssistencia } from '../api/pedidosServices';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Indicadores calculados
  const [indicadores, setIndicadores] = useState({
    totalPedidos: 0,
    pedidosEncerrados: 0,
    pedidosEmAndamento: 0
  });

  const carregarPedidos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getPedidosDaAssistencia();

      // Normaliza dados do backend (mapeia campos diferentes)
      const pedidosNormalizados = data.map(pedido => {
        // Tenta buscar dados complementares do cache local (workaround enquanto backend não salva)
        const pedidoCache = localStorage.getItem(`pedido_${pedido.id}`);
        const dadosCache = pedidoCache ? JSON.parse(pedidoCache) : {};

        return {
          ...pedido,
          // Compatibilidade de campos
          status: pedido.status || pedido.situacao || pedido.SITUACAO || 'Aguardando Aceite',
          fornecedor: pedido.fornecedor || pedido.FORNECEDOR || dadosCache.fornecedor || 'N/A',
          codigoEntrega: pedido.codigoEntrega || pedido.codigo_entrega || pedido.CODIGO_ENTREGA || dadosCache.codigoEntrega || `M${pedido.id}X${Math.floor(Math.random() * 10)}`,
          tipoEntrega: pedido.tipoEntrega || pedido.tipo_entrega || pedido.TIPO_ENTREGA || dadosCache.tipoEntrega || 'Normal',
          totalPago: pedido.totalPago || pedido.total_pago || pedido.TOTAL_PAGO || pedido.valorFrete || dadosCache.totalPago || 0,
          dataPedido: pedido.dataPedido || pedido.dataHoraCriacaoRegistro || pedido.DATA_HORA_CRICAO_REGISTRO,
          metodoPagamento: pedido.metodoPagamento || pedido.formaPagamento || dadosCache.metodoPagamento || 'N/A'
        };
      });

      console.log('📦 Pedidos normalizados:', pedidosNormalizados);

      // DEBUG: Mostrar status de cada pedido
      console.log('🔍 Status dos pedidos:', pedidosNormalizados.map(p => ({ id: p.id, status: p.status })));

      setPedidos(pedidosNormalizados);

      // Calcula os indicadores baseado nos pedidos
      calcularIndicadores(pedidosNormalizados);

    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err.message || 'Erro ao carregar pedidos');
      // Se houver erro, mantém os indicadores zerados
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const calcularIndicadores = (listaPedidos) => {
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

    console.log('📊 Indicadores calculados:', {
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
  };

  return {
    pedidos,
    isLoading,
    error,
    indicadores,
    recarregar: carregarPedidos
  };
};
