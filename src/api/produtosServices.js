import api from './api';

/**
 * Serviço de produtos - integração com API
 */

/**
 * Busca todos os produtos
 * @returns {Promise<Array>} Lista de produtos
 */
export const getProdutos = async () => {
  try {
    const response = await api.get('/api/Produtos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

/**
 * Busca produtos por categoria
 * @param {string} categoria - Nome da categoria (celulares, notebooks, acessorios, telas)
 * @returns {Promise<Array>} Lista de produtos filtrados
 */
export const getProdutosPorCategoria = async (categoria) => {
  try {
    const response = await api.get(`/api/Produtos?categoria=${categoria}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoria}:`, error);
    throw error;
  }
};

/**
 * Busca produtos por fornecedor
 * @param {string} fornecedor - Nome do fornecedor
 * @returns {Promise<Array>} Lista de produtos filtrados
 */
export const getProdutosPorFornecedor = async (fornecedor) => {
  try {
    const response = await api.get(`/api/Produtos?fornecedor=${encodeURIComponent(fornecedor)}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtos do fornecedor ${fornecedor}:`, error);
    throw error;
  }
};

/**
 * Busca produtos por categoria E fornecedor
 * @param {string} categoria - Nome da categoria
 * @param {string} fornecedor - Nome do fornecedor
 * @returns {Promise<Array>} Lista de produtos filtrados
 */
export const getProdutosPorCategoriaEFornecedor = async (categoria, fornecedor) => {
  try {
    const response = await api.get(`/api/Produtos?categoria=${categoria}&fornecedor=${encodeURIComponent(fornecedor)}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoria} e fornecedor ${fornecedor}:`, error);
    throw error;
  }
};

/**
 * Busca produto por ID
 * @param {number} id - ID do produto
 * @returns {Promise<Object>} Dados do produto
 */
export const getProdutoPorId = async (id) => {
  try {
    const response = await api.get(`/api/Produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
};

/**
 * Busca lista de fornecedores únicos
 * @returns {Promise<Array>} Lista de nomes de fornecedores
 */
export const getFornecedores = async () => {
  try {
    const response = await api.get('/api/Fornecedores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    throw error;
  }
};