import { useState, useEffect } from 'react';
import api from '../api/api';
import logger from '../utils/logger';

/**
 * Hook para calcular produtos mais vendidos baseado nos pedidos
 * @param {number} topN - Quantos produtos considerar como "mais vendidos" (padrão: 10)
 * @param {number|null} idSegmento - Filtrar por categoria/segmento específico (opcional)
 * @returns {Object} { produtosMaisVendidos: Set<number>, isLoading, error }
 */
export const useProdutosMaisVendidos = (topN = 10, idSegmento = null) => {
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🚫 DESABILITADO TEMPORARIAMENTE: Endpoints de pedidos não estão funcionando
    // Quando os endpoints /api/Pedidos e /api/PedidoItems estiverem prontos, remova este return

    logger.info('⚠️ Hook useProdutosMaisVendidos DESABILITADO - aguardando implementação dos endpoints de pedidos');
    setProdutosMaisVendidos(new Set()); // Retorna Set vazio
    setIsLoading(false);
    setError(null);
    return;

    // CÓDIGO COMENTADO ATÉ QUE OS ENDPOINTS ESTEJAM PRONTOS:
    /*
    const calcularProdutosMaisVendidos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        if (!token) {
          logger.warn('⚠️ Token não encontrado - funcionalidade de produtos mais vendidos desabilitada');
          setIsLoading(false);
          return;
        }

        logger.info('📊 Tentando calcular produtos mais vendidos...');

        // 🌍 Busca TODOS os pedidos (globalmente)
        const pedidosResponse = await api.get('/api/Pedidos', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const pedidos = pedidosResponse.data || [];

        if (pedidos.length === 0) {
          logger.info('ℹ️ Nenhum pedido encontrado');
          setIsLoading(false);
          return;
        }

        // Mapeia quantidade vendida por produto
        const vendasPorProduto = {};

        // Busca items de cada pedido
        for (const pedido of pedidos) {
          try {
            const itemsResponse = await api.get(`/api/PedidoItems/pedido/${pedido.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const items = itemsResponse.data || [];

            // Para cada item, verifica se pertence ao segmento (se filtro ativo)
            for (const item of items) {
              const idProduto = item.idProduto || item.produtoId;

              if (!idProduto) continue;

              // Se tem filtro de segmento, verifica se o produto pertence ao segmento
              if (idSegmento !== null) {
                try {
                  const produtoResponse = await api.get(`/api/Produtos/${idProduto}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });

                  const produto = produtoResponse.data;

                  // Só conta se o produto pertence ao segmento filtrado
                  if (produto.idSegmento !== idSegmento) {
                    continue; // Pula este produto
                  }
                } catch (produtoError) {
                  logger.warn(`⚠️ Erro ao buscar produto ${idProduto}:`, produtoError.message);
                  continue;
                }
              }

              // Conta a venda
              vendasPorProduto[idProduto] = (vendasPorProduto[idProduto] || 0) + (item.quantidade || 0);
            }
          } catch (itemError) {
            logger.warn(`⚠️ Erro ao buscar items do pedido ${pedido.id}:`, itemError.message);
          }
        }

        // Ordena produtos por quantidade vendida (decrescente)
        const produtosOrdenados = Object.entries(vendasPorProduto)
          .sort(([, a], [, b]) => b - a)
          .slice(0, topN);

        // Cria Set com IDs dos produtos mais vendidos
        const idsTopProdutos = new Set(
          produtosOrdenados.map(([idProduto]) => parseInt(idProduto))
        );

        logger.info(`✅ Top ${topN} produtos mais vendidos calculados${idSegmento ? ` (Segmento ${idSegmento})` : ' (GLOBAL)'}:`, {
          total: Object.keys(vendasPorProduto).length,
          topProdutos: produtosOrdenados.map(([id, qtd]) => ({ id: parseInt(id), quantidade: qtd }))
        });

        setProdutosMaisVendidos(idsTopProdutos);

      } catch (err) {
        // ⚠️ MUDANÇA: Não loga erro se for 400/404 - endpoints podem não estar prontos
        if (err.response?.status === 400 || err.response?.status === 404) {
          logger.warn('⚠️ Endpoints de pedidos não disponíveis - funcionalidade de produtos mais vendidos desabilitada');
        } else {
          logger.error('❌ Erro ao calcular produtos mais vendidos:', err);
        }
        setError(null); // Não propaga erro para o componente
        setProdutosMaisVendidos(new Set()); // Retorna Set vazio
      } finally {
        setIsLoading(false);
      }
    };

    calcularProdutosMaisVendidos();
    */
  }, [topN, idSegmento]); // Re-calcula quando mudar topN ou idSegmento

  return {
    produtosMaisVendidos,
    isLoading,
    error
  };
};
