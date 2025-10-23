import api from './api';
import logger from '../utils/logger';

/**
 * Serviço de Grupos de Pedidos - Nível 1 da hierarquia
 *
 * Um PedidoGrupo representa uma COMPRA COMPLETA da assistência técnica.
 * Pode conter vários pedidos (um para cada fornecedor/distribuidor).
 *
 * Hierarquia:
 * PedidoGrupo (1 compra) → Pedidos (N fornecedores) → PedidoItems (M produtos)
 */

/**
 * Busca todos os grupos de pedidos
 * @returns {Promise<Array>} Lista de grupos de pedidos
 * @throws {Error} Se houver erro na requisição
 */
export const getPedidoGrupos = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info('📡 Buscando todos os grupos de pedidos');

    const response = await api.get('/api/PedidoGrupos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Grupos de pedidos recebidos:', response.data);
    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao buscar grupos de pedidos:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca um grupo de pedidos específico por ID
 * @param {number} id - ID do grupo de pedidos
 * @returns {Promise<Object>} Dados do grupo de pedidos
 * @throws {Error} Se o grupo não for encontrado ou houver erro na busca
 */
export const getPedidoGrupoPorId = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info('📡 Buscando grupo de pedidos:', id);

    const response = await api.get(`/api/PedidoGrupos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Grupo de pedidos encontrado:', response.data);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao buscar grupo de pedidos ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Grupo de pedidos não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Cria um novo grupo de pedidos (Compra)
 *
 * Este é o PRIMEIRO PASSO no fluxo hierárquico de criação.
 * 1º - Criar PedidoGrupo (esta função)
 * 2º - Criar Pedidos vinculados ao grupo (createPedido)
 * 3º - Criar PedidoItems vinculados aos pedidos (createPedidoItem)
 *
 * @param {Object} dadosGrupo - Dados do grupo de pedidos
 * @param {number} dadosGrupo.empresa - ID da empresa (padrão: 1)
 * @param {number} dadosGrupo.estabelecimento - ID do estabelecimento (padrão: 1)
 * @param {string} [dadosGrupo.codigo] - Código do grupo (opcional, gerado no backend)
 * @param {string} [dadosGrupo.transacao] - Código da transação (opcional)
 * @param {string} [dadosGrupo.situacao] - Situação do grupo (padrão: "ATIVO")
 * @returns {Promise<Object>} Dados do grupo criado incluindo o ID
 * @throws {Error} Se os dados forem inválidos ou houver erro na criação
 *
 * @example
 * const grupo = await createPedidoGrupo({
 *   empresa: 1,
 *   estabelecimento: 1,
 *   codigo: "COMPRA-20251014-001",
 *   transacao: "TRX-001",
 *   situacao: "ATIVO"
 * });
 * logger.info('Grupo criado com ID:', grupo.id);
 */
export const createPedidoGrupo = async (dadosGrupo) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Monta payload com valores padrão
    const payload = {
      empresa: dadosGrupo.empresa || 1,
      estabelecimento: dadosGrupo.estabelecimento || 1,
      codigo: dadosGrupo.codigo || null, // Backend pode gerar automaticamente
      transacao: dadosGrupo.transacao || `TRX-${Date.now()}`,
      situacao: dadosGrupo.situacao || 'ATIVO',
      situacaoRegistro: 'ATIVO'
    };

    logger.info('📡 Criando novo grupo de pedidos:', payload);

    const response = await api.post('/api/PedidoGrupos', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info('✅ Grupo de pedidos criado com sucesso:', response.data);
    logger.info('🆔 ID do grupo:', response.data.id);

    return response.data;
  } catch (error) {
    logger.error('❌ Erro ao criar grupo de pedidos:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);

      if (error.response.data?.details) {
        throw new Error(`Erro de validação: ${JSON.stringify(error.response.data.details)}`);
      }
    }

    throw error;
  }
};

/**
 * Atualiza um grupo de pedidos existente
 * @param {number} id - ID do grupo a atualizar
 * @param {Object} dadosGrupo - Novos dados do grupo
 * @returns {Promise<Object>} Confirmação da atualização
 * @throws {Error} Se o grupo não for encontrado ou houver erro
 */
export const updatePedidoGrupo = async (id, dadosGrupo) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const payload = {
      id: id,
      ...dadosGrupo
    };

    logger.info('📡 Atualizando grupo de pedidos:', id, payload);

    const response = await api.put(`/api/PedidoGrupos/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info('✅ Grupo de pedidos atualizado:', response.data);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao atualizar grupo de pedidos ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Grupo de pedidos não encontrado.');
      } else if (error.response.status === 400) {
        throw new Error('Dados inválidos para atualização.');
      }
    }

    throw error;
  }
};

/**
 * Exclui um grupo de pedidos
 * @param {number} id - ID do grupo a excluir
 * @returns {Promise<Object>} Confirmação da exclusão
 * @throws {Error} Se o grupo não for encontrado ou houver erro
 */
export const deletePedidoGrupo = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    logger.info('📡 Excluindo grupo de pedidos:', id);

    const response = await api.delete(`/api/PedidoGrupos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Grupo de pedidos excluído:', response.data);
    return response.data;
  } catch (error) {
    logger.error(`❌ Erro ao excluir grupo de pedidos ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Grupo de pedidos não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Função auxiliar para gerar código de transação único
 * @returns {string} Código de transação no formato TRX-YYYYMMDD-HHMMSS
 */
export const gerarCodigoTransacao = () => {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const dia = String(now.getDate()).padStart(2, '0');
  const hora = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const seg = String(now.getSeconds()).padStart(2, '0');

  return `TRX-${ano}${mes}${dia}-${hora}${min}${seg}`;
};

/**
 * Situações válidas para grupos de pedidos
 */
export const SITUACOES_GRUPO = {
  ATIVO: 'ATIVO',
  CANCELADO: 'CANCELADO',
  CONCLUIDO: 'CONCLUIDO',
  EM_PROCESSAMENTO: 'EM_PROCESSAMENTO'
};
