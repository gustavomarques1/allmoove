import { buscarProdutosParaCarrinho, getProdutos, getProdutosPorCategoria } from './produtosServices';
import logger from '../utils/logger';

/**
 * Busca produtos da API com fallback para JSON estático
 *
 * NOVO: Agora usa /api/ProdutoEscolhaCarrinho que retorna produtos com:
 * - Informações completas (marca, modelo, segmento, tag, grupo)
 * - Nome do distribuidor
 * - Busca inteligente em múltiplos campos
 *
 * @param {string} query - Termo de busca (categoria, nome, SKU, marca, modelo, etc.)
 * @returns {Promise<Array>} Lista de produtos com informações completas
 */
async function fetchProducts(query = '') {
  try {
    logger.info('🔍 Buscando produtos...', query ? `Filtro: ${query}` : 'Todos');

    // Usa o endpoint /api/Produtos que agora está funcionando corretamente
    const produtos = query
      ? await getProdutosPorCategoria(query)
      : await getProdutos();

    if (produtos && produtos.length > 0) {
      logger.info('✅ Produtos carregados da API com sucesso:', produtos.length);
      return produtos;
    }

    // Se não encontrar produtos e houver query, tenta buscar sem filtro
    if (query && (!produtos || produtos.length === 0)) {
      logger.info('⚠️ Nenhum produto encontrado com filtro. Buscando todos...');
      const todosProdutos = await getProdutos();
      return todosProdutos;
    }

    logger.info('✅ Busca concluída:', produtos?.length || 0, 'produtos');
    return produtos || [];

  } catch (error) {
    logger.error('❌ Erro ao carregar produtos da API:', error);

    // FALLBACK: Tenta carregar do JSON estático se API falhar
    logger.info('⚠️ Tentando fallback para dados locais...');
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();

      if (!query) {
        logger.info('✅ Produtos carregados do JSON local (fallback)');
        return data;
      }

      const filtered = data.filter(
        (item) =>
          item.nome.toLowerCase().includes(query.toLowerCase()) ||
          item.categoria.toLowerCase().includes(query.toLowerCase())
      );

      logger.info(`✅ ${filtered.length} produtos filtrados do JSON local (fallback)`);
      return filtered;
    } catch (fallbackError) {
      logger.error('❌ Fallback também falhou:', fallbackError);
      return [];
    }
  }
}

export default fetchProducts;
