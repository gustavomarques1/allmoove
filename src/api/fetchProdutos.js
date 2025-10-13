import { buscarProdutosParaCarrinho, getProdutos, getProdutosPorCategoria } from './produtosServices';

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
    console.log('🔍 Buscando produtos...', query ? `Filtro: ${query}` : 'Todos');

    // Temporariamente usando endpoint antigo até backend implementar o novo
    const produtos = query
      ? await getProdutosPorCategoria(query)
      : await getProdutos();

    if (produtos && produtos.length > 0) {
      console.log('✅ Produtos carregados com sucesso:', produtos.length);
      return produtos;
    }

    // Se não encontrar produtos e houver query, tenta buscar sem filtro
    if (query && (!produtos || produtos.length === 0)) {
      console.log('⚠️ Nenhum produto encontrado com filtro. Buscando todos...');
      const todosProdutos = await buscarProdutosParaCarrinho('');
      return todosProdutos;
    }

    console.log('✅ Busca concluída:', produtos?.length || 0, 'produtos');
    return produtos || [];

  } catch (error) {
    console.error('❌ Erro ao carregar produtos da API:', error);

    // FALLBACK: Tenta carregar do JSON estático se API falhar
    console.log('⚠️ Tentando fallback para dados locais...');
    try {
      const response = await fetch('/data/products.json');
      const data = await response.json();

      if (!query) {
        console.log('✅ Produtos carregados do JSON local (fallback)');
        return data;
      }

      const filtered = data.filter(
        (item) =>
          item.nome.toLowerCase().includes(query.toLowerCase()) ||
          item.categoria.toLowerCase().includes(query.toLowerCase())
      );

      console.log(`✅ ${filtered.length} produtos filtrados do JSON local (fallback)`);
      return filtered;
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      return [];
    }
  }
}

export default fetchProducts;
