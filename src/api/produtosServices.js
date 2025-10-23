import api from './api';
import logger from '../utils/logger';

/**
 * Serviço de produtos - integração com API
 */

/**
 * Busca todos os produtos
 * @returns {Promise<Array>} Lista de produtos
 */
export const getProdutos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    logger.info('🔍 getProdutos: Buscando produtos...');
    logger.debug('🔐 Token disponível:', token ? 'SIM' : 'NÃO');

    const response = await api.get('/api/Produtos', { headers });

    logger.info('✅ getProdutos: Resposta recebida');
    logger.info('📦 Total de produtos:', response.data?.length || 0);
    logger.debug('📋 Produtos:', response.data);

    return response.data;
  } catch (error) {
    logger.error('❌ getProdutos: Erro ao buscar produtos:', error);
    logger.error('❌ Status:', error.response?.status);
    logger.error('❌ Mensagem:', error.response?.data || error.message);
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
    logger.error(`Erro ao buscar produtos da categoria ${categoria}:`, error);
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
    logger.error(`Erro ao buscar produtos do fornecedor ${fornecedor}:`, error);
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
    logger.error(`Erro ao buscar produtos da categoria ${categoria} e fornecedor ${fornecedor}:`, error);
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
    logger.error(`Erro ao buscar produto ${id}:`, error);
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
    logger.error('Erro ao buscar fornecedores:', error);
    throw error;
  }
};

/**
 * Busca produtos para carrinho com busca inteligente
 *
 * Este endpoint é mais completo que /api/Produtos pois retorna:
 * - Informações de grupo, tag, segmento, marca, modelo
 * - Nome do distribuidor
 * - Busca em múltiplos campos (nome, SKU, EAN, descrição, etc.)
 *
 * @param {string} campoConsulta - Texto de busca (nome, SKU, marca, modelo, etc.)
 * @returns {Promise<Array>} Lista de produtos com informações completas
 */
export const buscarProdutosParaCarrinho = async (campoConsulta = '') => {
  try {
    // Token é adicionado automaticamente pelo interceptor em api.js
    const response = await api.get('/api/ProdutoEscolhaCarrinho', {
      params: { campoConsulta }
    });

    logger.info(`✅ Produtos encontrados (busca: "${campoConsulta}"):`, response.data.length);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar produtos para carrinho:', error);

    // Se der erro 404 ou 401, usa fallback
    if (error.response?.status === 404 || error.response?.status === 401) {
      logger.warn('⚠️ Endpoint /api/ProdutoEscolhaCarrinho não encontrado ou requer auth. Usando fallback.');
      // Fallback para o endpoint antigo
      return getProdutos();
    }

    throw error;
  }
};

/**
 * Busca todos os segmentos/categorias de produtos
 * @returns {Promise<Array>} Lista de segmentos com id e nome
 */
export const getSegmentos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/ProdutoSegmentos', { headers });
    logger.info('✅ Segmentos carregados da API:', response.data.length);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar segmentos:', error);
    throw error;
  }
};

/**
 * Busca todos os grupos de produtos
 * @returns {Promise<Array>} Lista de grupos
 */
export const getGrupos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/ProdutoGrupos', { headers });
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar grupos:', error);
    throw error;
  }
};

/**
 * Busca todas as marcas de produtos
 * @returns {Promise<Array>} Lista de marcas
 */
export const getMarcas = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/ProdutoMarcas', { headers });
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar marcas:', error);
    throw error;
  }
};

/**
 * Busca todos os modelos de produtos
 * @returns {Promise<Array>} Lista de modelos
 */
export const getModelos = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/ProdutoModelos', { headers });
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar modelos:', error);
    throw error;
  }
};

/**
 * Busca todas as tags de produtos
 * @returns {Promise<Array>} Lista de tags
 */
export const getTags = async () => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/ProdutoTags', { headers });
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar tags:', error);
    throw error;
  }
};

/**
 * Busca produtos por grupo
 * @param {number} idGrupo - ID do grupo
 * @returns {Promise<Array>} Lista de produtos filtrados
 */
export const getProdutosPorGrupo = async (idGrupo) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/Produtos', { headers });

    // Filtrar no cliente por idGrupo
    const produtosFiltrados = response.data.filter(p => p.idGrupo === idGrupo);

    logger.info(`✅ Produtos do grupo ${idGrupo}:`, produtosFiltrados.length);
    return produtosFiltrados;
  } catch (error) {
    logger.error(`❌ Erro ao buscar produtos do grupo ${idGrupo}:`, error);
    throw error;
  }
};

/**
 * Busca produtos por grupo E fornecedor
 * @param {number} idGrupo - ID do grupo
 * @param {string} fornecedor - Nome do fornecedor
 * @returns {Promise<Array>} Lista de produtos filtrados
 */
export const getProdutosPorGrupoEFornecedor = async (idGrupo, fornecedor) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get('/api/Produtos', { headers });

    // Filtrar no cliente por idGrupo e fornecedor
    const produtosFiltrados = response.data.filter(p =>
      p.idGrupo === idGrupo &&
      (p.fornecedor === fornecedor || p.distribuidor === fornecedor)
    );

    logger.info(`✅ Produtos do grupo ${idGrupo} e fornecedor ${fornecedor}:`, produtosFiltrados.length);
    return produtosFiltrados;
  } catch (error) {
    logger.error(`❌ Erro ao buscar produtos do grupo ${idGrupo} e fornecedor ${fornecedor}:`, error);
    throw error;
  }
};

/**
 * Busca distribuidores por segmento
 * @param {number} idSegmento - ID do segmento
 * @returns {Promise<Array>} Lista de distribuidores
 */
export const getDistribuidoresPorSegmento = async (idSegmento) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get(`/api/Distribuidor/consulta?idSegmento=${idSegmento}`, { headers });

    logger.info(`✅ Distribuidores do segmento ${idSegmento}:`, response.data.length);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao buscar distribuidores do segmento ${idSegmento}:`, error);
    throw error;
  }
};

/**
 * Busca últimos pedidos de uma assistência
 * @param {number} idAssistencia - ID da assistência técnica
 * @returns {Promise<Array>} Lista dos últimos pedidos
 */
export const getUltimosPedidos = async (idAssistencia) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get(`/api/Distribuidor/ultimospedidos/${idAssistencia}`, { headers });

    logger.info(`✅ Últimos pedidos da assistência ${idAssistencia}:`, response.data.length);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao buscar últimos pedidos:`, error);
    throw error;
  }
};

/**
 * Busca distribuidores favoritos por segmento e assistência
 * @param {number} idSegmento - ID do segmento
 * @param {number} idAssistencia - ID da assistência técnica
 * @returns {Promise<Array>} Lista de distribuidores favoritos
 */
export const getDistribuidoresFavoritos = async (idSegmento, idAssistencia) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await api.get(`/api/Distribuidor/favoritos/${idSegmento}/${idAssistencia}`, { headers });

    logger.info(`✅ Distribuidores favoritos (segmento ${idSegmento}, assistência ${idAssistencia}):`, response.data.length);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao buscar distribuidores favoritos:`, error);
    throw error;
  }
};