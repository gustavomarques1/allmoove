import { useState, useEffect } from 'react';
import { getPedidosDoDistribuidor } from '../api/pedidosServices';

export const usePedidosDistribuidor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Indicadores calculados
  const [indicadores, setIndicadores] = useState({
    novosPedidos: 0,
    emAndamento: 0,
    concluidos: 0,
    totalFaturamento: 0
  });

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getPedidosDoDistribuidor();
        setPedidos(data);

        // Calcula os indicadores baseado nos pedidos
        calcularIndicadores(data);

      } catch (err) {
        console.error('Erro ao carregar pedidos do distribuidor:', err);
        setError(err.message || 'Erro ao carregar pedidos');
        // Se houver erro, mantém os indicadores zerados
        setPedidos([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  const calcularIndicadores = (listaPedidos) => {
    if (!Array.isArray(listaPedidos) || listaPedidos.length === 0) {
      setIndicadores({
        novosPedidos: 0,
        emAndamento: 0,
        concluidos: 0,
        totalFaturamento: 0
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

    setIndicadores({
      novosPedidos: novos,
      emAndamento: emAndamento,
      concluidos: concluidos,
      totalFaturamento: faturamento
    });
  };

  return {
    pedidos,
    isLoading,
    error,
    indicadores
  };
};
