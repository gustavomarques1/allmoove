import { getProdutos, getProdutosPorCategoria } from './produtosServices';

/**
 * Busca produtos da API com fallback para JSON estático
 * @param {string} query - Termo de busca (categoria ou nome)
 * @returns {Promise<Array>} Lista de produtos
 */
async function fetchProducts(query = '') {
  try {
    console.log('🔍 Buscando produtos...', query ? `Filtro: ${query}` : 'Todos');

    // Se não houver query, retorna todos os produtos
    if (!query) {
      const produtos = await getProdutos();
      console.log('✅ Produtos carregados da API:', produtos.length);
      return produtos;
    }

    // Primeiro tenta buscar por categoria exata
    try {
      const produtosPorCategoria = await getProdutosPorCategoria(query.toLowerCase());
      if (produtosPorCategoria && produtosPorCategoria.length > 0) {
        console.log(`✅ ${produtosPorCategoria.length} produtos encontrados na categoria "${query}"`);
        return produtosPorCategoria;
      }
    } catch (error) {
      console.log('⚠️ Categoria não encontrada na API, buscando por nome...', +error);
    }

    // Se não encontrar por categoria, busca todos e filtra por nome
    const todosProdutos = await getProdutos();
    const produtosFiltrados = todosProdutos.filter(
      (item) =>
        item.nome.toLowerCase().includes(query.toLowerCase()) ||
        item.categoria.toLowerCase().includes(query.toLowerCase())
    );

    console.log(`✅ ${produtosFiltrados.length} produtos encontrados com filtro "${query}"`);
    return produtosFiltrados;

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
