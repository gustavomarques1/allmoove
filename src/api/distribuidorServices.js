import api from './api';
import logger from '../utils/logger';

/**
 * Serviço de Distribuidores - Integração com API
 *
 * Este serviço gerencia operações relacionadas a distribuidores
 */

/**
 * Busca o ID do distribuidor baseado no CPFCNPJ da pessoa
 *
 * Como não existe endpoint direto /api/Distribuidor/pessoa/{idPessoa},
 * usamos a View_Distribuidor_Consulta que lista todos os distribuidores
 * e filtramos pelo CPFCNPJ da pessoa logada.
 *
 * @param {string} cpfCnpj - CPF/CNPJ da pessoa (obtido do login)
 * @returns {Promise<number|null>} ID do distribuidor ou null se não encontrado
 * @throws {Error} Se houver erro na requisição
 */
export const getDistribuidorIdByCpfCnpj = async (cpfCnpj) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    if (!cpfCnpj) {
      throw new Error('CPF/CNPJ não fornecido.');
    }

    logger.info('🔍 Buscando idDistribuidor para CPF/CNPJ:', cpfCnpj);

    // Remove formatação do CPF/CNPJ
    const cpfCnpjLimpo = cpfCnpj.replace(/[^\d]/g, '');

    // 🔧 SOLUÇÃO ALTERNATIVA: Busca pela tabela PESSOA ao invés da VIEW
    // A VIEW está com problemas de relacionamento de segmentos
    try {
      // Busca todas as pessoas do tipo DISTRIBUIDOR
      const pessoasResponse = await api.get('/api/pessoas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Filtra pessoa pelo CPF/CNPJ
      const pessoa = pessoasResponse.data.find(p => {
        if (p.tipo !== 'DISTRIBUIDOR' && p.Tipo !== 'DISTRIBUIDOR') return false;
        const cpfCnpjPessoa = (p.cpfCnpj || p.CpfCnpj || p.CPFCNPJ || '').replace(/[^\d]/g, '');
        return cpfCnpjPessoa === cpfCnpjLimpo;
      });

      if (pessoa) {
        // ✅ Usa o ID da PESSOA como idDistribuidor
        // No sistema AllMoove, ID_PESSOA = ID_DISTRIBUIDOR em muitos casos
        const idDistribuidor = pessoa.id || pessoa.Id;
        logger.info('✅ Distribuidor encontrado! ID:', idDistribuidor, 'Nome:', pessoa.nome || pessoa.Nome);
        return idDistribuidor;
      } else {
        logger.warn('⚠️ Distribuidor não encontrado para CPF/CNPJ:', cpfCnpj);
        return null;
      }
    } catch (apiError) {
      logger.error('❌ Erro ao buscar via API Pessoas, tentando VIEW...', apiError);

      // Fallback: tenta pela VIEW antiga (se existir)
      const response = await api.get('/api/Distribuidor/consulta', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      logger.info('📦 Distribuidores encontrados na VIEW:', response.data.length);

      const distribuidor = response.data.find(d => {
        const cpfCnpjDistribuidor = (d.cpfCnpj || d.CpfCnpj || d.CPFCNPJ || '').replace(/[^\d]/g, '');
        logger.info('🔍 Comparando CPF/CNPJ (VIEW):', cpfCnpjDistribuidor, '===', cpfCnpjLimpo);
        return cpfCnpjDistribuidor === cpfCnpjLimpo;
      });

      if (distribuidor) {
        const idDistribuidor = distribuidor.idDistribuidor || distribuidor.IdDistribuidor || distribuidor.ID_DISTRIBUIDOR;
        logger.info('✅ Distribuidor encontrado na VIEW! ID:', idDistribuidor);
        return idDistribuidor;
      } else {
        logger.warn('⚠️ Distribuidor não encontrado na VIEW');
        return null;
      }
    }
  } catch (error) {
    logger.error('❌ Erro ao buscar idDistribuidor:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca o ID do distribuidor baseado no nome do fornecedor
 *
 * Esta função é usada para mapear o nome do fornecedor (vindo dos produtos)
 * para o idDistribuidor correto ao criar pedidos.
 *
 * Usa o endpoint /api/Pessoas/GetByNome para buscar a pessoa com aquele nome,
 * e retorna o ID da pessoa (que é o idDistribuidor usado nos pedidos).
 *
 * @param {string} nomeFornecedor - Nome do fornecedor (ex: "TechParts SP")
 * @returns {Promise<number|null>} ID do distribuidor ou null se não encontrado
 * @throws {Error} Se houver erro na requisição
 *
 * @example
 * const idDistribuidor = await getDistribuidorIdPorNome('TechParts SP');
 * // Retorna: 2
 */
export const getDistribuidorIdPorNome = async (nomeFornecedor) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    if (!nomeFornecedor) {
      logger.warn('⚠️ Nome do fornecedor não fornecido');
      return null;
    }

    logger.info(`🔍 Buscando idDistribuidor para fornecedor: "${nomeFornecedor}"`);

    // Busca pessoa por nome usando endpoint existente
    const response = await api.get('/api/Pessoas/GetByNome', {
      params: { nome: nomeFornecedor },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Verifica se encontrou alguma pessoa
    if (response.data && response.data.length > 0) {
      const pessoa = response.data[0];
      const idDistribuidor = pessoa.id || pessoa.Id;

      logger.info(`✅ Distribuidor encontrado! "${nomeFornecedor}" → ID: ${idDistribuidor}`);
      return idDistribuidor;
    } else {
      logger.warn(`⚠️ Fornecedor "${nomeFornecedor}" não encontrado na base de dados`);
      return null;
    }
  } catch (error) {
    logger.error(`❌ Erro ao buscar idDistribuidor para "${nomeFornecedor}":`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    // Retorna null ao invés de propagar erro para não quebrar o fluxo de checkout
    return null;
  }
};

/**
 * Busca o ID do distribuidor baseado no idPessoa
 *
 * Primeiro busca os dados da pessoa para obter o CPF/CNPJ,
 * depois usa esse CPF/CNPJ para buscar o idDistribuidor
 *
 * @param {number|string} idPessoa - ID da pessoa
 * @returns {Promise<number|null>} ID do distribuidor ou null se não encontrado
 * @throws {Error} Se houver erro na requisição
 */
export const getDistribuidorIdByPessoaId = async (idPessoa) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    if (!idPessoa) {
      throw new Error('idPessoa não fornecido.');
    }

    logger.info('🔍 Buscando distribuidor para idPessoa:', idPessoa);

    // 1. Busca dados da pessoa
    const pessoaResponse = await api.get(`/api/pessoas/${idPessoa}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const pessoa = pessoaResponse.data;
    const cpfCnpj = pessoa.cpfCnpj || pessoa.CpfCnpj;

    if (!cpfCnpj) {
      logger.error('❌ Pessoa não tem CPF/CNPJ cadastrado');
      return null;
    }

    logger.info('📋 CPF/CNPJ da pessoa:', cpfCnpj);

    // 2. Busca idDistribuidor pelo CPF/CNPJ
    return await getDistribuidorIdByCpfCnpj(cpfCnpj);
  } catch (error) {
    logger.error('❌ Erro ao buscar distribuidor por idPessoa:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca todos os distribuidores
 * @returns {Promise<Array>} Lista de distribuidores
 * @throws {Error} Se houver erro na requisição
 */
export const getDistribuidores = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info('🔍 Buscando todos os distribuidores...');

    const response = await api.get('/api/Distribuidor/consulta', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Distribuidores carregados:', response.data.length);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar distribuidores:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca distribuidores favoritos por segmento e assistência
 * @param {number} idSegmento - ID do segmento
 * @param {number} idAssistencia - ID da assistência técnica
 * @returns {Promise<Array>} Lista de distribuidores favoritos
 * @throws {Error} Se houver erro na requisição
 */
export const getDistribuidoresFavoritos = async (idSegmento, idAssistencia) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info(`🔍 Buscando distribuidores favoritos: segmento=${idSegmento}, assistencia=${idAssistencia}`);

    const response = await api.get(`/api/Distribuidor/favoritos/${idSegmento}/${idAssistencia}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Distribuidores favoritos carregados:', response.data.length);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar distribuidores favoritos:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca últimos pedidos de uma assistência para um distribuidor
 * @param {number} idAssistencia - ID da assistência técnica
 * @returns {Promise<Array>} Lista dos últimos pedidos
 * @throws {Error} Se houver erro na requisição
 */
export const getUltimosPedidos = async (idAssistencia) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info(`🔍 Buscando últimos pedidos para assistência: ${idAssistencia}`);

    const response = await api.get(`/api/Distribuidor/ultimospedidos/${idAssistencia}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Últimos pedidos carregados:', response.data.length);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar últimos pedidos:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};
