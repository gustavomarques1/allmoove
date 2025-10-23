import api from './api';
import logger from '../utils/logger';

/**
 * Serviço de Dashboard - Integração com API de dados agregados
 *
 * Este serviço busca dados agregados do dashboard para cada papel (role):
 * - ASSISTENCIA_TECNICA: Dados do dashboard da assistência técnica
 * - DISTRIBUIDOR: Dados do dashboard do distribuidor
 * - ENTREGADOR: Dados do dashboard do entregador
 */

/**
 * Busca dados agregados do dashboard por papel e ID
 * @param {string} papel - Papel do usuário (ASSISTENCIA_TECNICA, DISTRIBUIDOR, ENTREGADOR)
 * @param {number|string} idPessoa - ID da pessoa
 * @returns {Promise<Array>} Lista de dados do dashboard
 * @throws {Error} Se houver erro na requisição
 */
export const getDashboardData = async (papel, idPessoa) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info(`📊 Buscando dados do dashboard: ${papel} / ID: ${idPessoa}`);

    const response = await api.get(`/api/Dashboard/${papel}/${idPessoa}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Dados do dashboard recebidos (RAW):', response.data);

    // 🔧 A API retorna um objeto com chaves (ex: {ALLMOOVE_PRINCIPAL: [...]})
    // Precisamos extrair o array de dentro do objeto
    let dados = response.data;

    // Se for um objeto (não array), extrai o primeiro array encontrado
    if (dados && typeof dados === 'object' && !Array.isArray(dados)) {
      const chaves = Object.keys(dados);

      if (chaves.length > 0) {
        const primeiraChave = chaves[0];
        const valorPrimeiraChave = dados[primeiraChave];

        if (Array.isArray(valorPrimeiraChave)) {
          logger.info(`📋 Extraindo array da chave "${primeiraChave}"`);
          dados = valorPrimeiraChave;
        }
      }
    }

    logger.info('✅ Dados do dashboard processados:', dados);
    return dados;
  } catch (error) {
    logger.error('❌ Erro ao buscar dados do dashboard:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);

      // Se der 404, retorna array vazio (endpoint pode não estar implementado)
      if (error.response.status === 404) {
        logger.warn('⚠️ Endpoint de dashboard não encontrado. Retornando dados vazios.');
        return [];
      }
    }

    throw error;
  }
};

/**
 * Processa os dados brutos do dashboard e organiza por página e posição
 * @param {Array} dadosBrutos - Dados retornados da API
 * @returns {Object} Dados organizados por página
 */
export const processarDadosDashboard = (dadosBrutos) => {
  if (!Array.isArray(dadosBrutos) || dadosBrutos.length === 0) {
    return {};
  }

  const dadosPorPagina = {};

  dadosBrutos.forEach(item => {
    const pagina = item.pagina || 'default';

    if (!dadosPorPagina[pagina]) {
      dadosPorPagina[pagina] = [];
    }

    dadosPorPagina[pagina].push({
      chave: item.chave,
      valor: item.valor,
      ordem: item.ordem || 0,
      posicaoLinha: item.posicaoLinha || 0,
      posicaoColuna: item.posicaoColuna || 0,
      fato: item.fato
    });
  });

  // Ordena os dados de cada página por ordem, linha e coluna
  Object.keys(dadosPorPagina).forEach(pagina => {
    dadosPorPagina[pagina].sort((a, b) => {
      if (a.ordem !== b.ordem) return a.ordem - b.ordem;
      if (a.posicaoLinha !== b.posicaoLinha) return a.posicaoLinha - b.posicaoLinha;
      return a.posicaoColuna - b.posicaoColuna;
    });
  });

  return dadosPorPagina;
};

/**
 * Busca e processa dados do dashboard para assistência técnica
 * @param {number|string} idPessoa - ID da assistência técnica
 * @returns {Promise<Object>} Dados processados do dashboard
 */
export const getDashboardAssistencia = async (idPessoa) => {
  const dados = await getDashboardData('ASSISTENCIA_TECNICA', idPessoa);
  return processarDadosDashboard(dados);
};

/**
 * Busca e processa dados do dashboard para distribuidor
 * @param {number|string} idPessoa - ID do distribuidor
 * @returns {Promise<Object>} Dados processados do dashboard
 */
export const getDashboardDistribuidor = async (idPessoa) => {
  const dados = await getDashboardData('DISTRIBUIDOR', idPessoa);
  return processarDadosDashboard(dados);
};

/**
 * Busca e processa dados do dashboard para entregador
 * @param {number|string} idPessoa - ID do entregador
 * @returns {Promise<Object>} Dados processados do dashboard
 */
export const getDashboardEntregador = async (idPessoa) => {
  const dados = await getDashboardData('ENTREGADOR', idPessoa);
  return processarDadosDashboard(dados);
};

/**
 * Extrai um indicador específico dos dados do dashboard
 * @param {Array} dados - Dados brutos do dashboard
 * @param {string} chave - Chave do indicador a buscar
 * @returns {string|number|null} Valor do indicador ou null se não encontrado
 */
export const extrairIndicador = (dados, chave) => {
  if (!Array.isArray(dados)) {
    return null;
  }

  const item = dados.find(d => d.chave === chave);

  if (!item) {
    return null;
  }

  // Tenta converter para número se possível
  const valorNumerico = parseFloat(item.valor);
  return isNaN(valorNumerico) ? item.valor : valorNumerico;
};

/**
 * Papéis válidos para dashboard
 */
export const PAPEIS_DASHBOARD = {
  ASSISTENCIA_TECNICA: 'ASSISTENCIA_TECNICA',
  DISTRIBUIDOR: 'DISTRIBUIDOR',
  ENTREGADOR: 'ENTREGADOR'
};
