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
      const pedidosNormalizados = data.map(pedido => ({
        ...pedido,
        // Compatibilidade de campos
        status: pedido.status || pedido.situacao || pedido.SITUACAO || 'Aguardando Aceite',
        fornecedor: pedido.fornecedor || pedido.FORNECEDOR || 'N/A',
        codigoEntrega: pedido.codigoEntrega || pedido.codigo_entrega || pedido.CODIGO_ENTREGA || 'N/A',
        tipoEntrega: pedido.tipoEntrega || pedido.tipo_entrega || pedido.TIPO_ENTREGA || 'Normal',
        totalPago: pedido.totalPago || pedido.total_pago || pedido.TOTAL_PAGO || pedido.valorFrete || 0,
        dataPedido: pedido.dataPedido || pedido.dataHoraCriacaoRegistro || pedido.DATA_HORA_CRICAO_REGISTRO
      }));

      console.log('📦 Pedidos normalizados:', pedidosNormalizados);
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

    // Ajuste os status conforme retornados pela sua API
    // Exemplos: "Entregue", "Concluído", "Finalizado", etc.
    const encerrados = listaPedidos.filter(
      p => p.status === 'Entregue' ||
           p.status === 'Concluído' ||
           p.status === 'Finalizado' ||
           p.status === 'Entregue ao Cliente'
    ).length;

    // Exemplos: "Aceito", "Em Trânsito", "Em Separação", "Aguardando Retirada", etc.
    const emAndamento = listaPedidos.filter(
      p => p.status === 'Aceito' ||
           p.status === 'Em Trânsito' ||
           p.status === 'Em Separação' ||
           p.status === 'Aguardando Retirada' ||
           p.status === 'Em Processamento'
    ).length;

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
