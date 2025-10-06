import api from './api';

/**
 * Serviço de pedidos - integração completa com API
 *
 * Este serviço gerencia todas as operações relacionadas a pedidos:
 * - Listagem de pedidos da assistência técnica
 * - Criação de novos pedidos
 * - Busca de pedido específico
 * - Atualização de status
 * - Cancelamento de pedidos
 */

/**
 * Busca todos os pedidos de uma assistência técnica específica
 * @param {number|string} idPessoa - ID da assistência técnica (se não fornecido, busca do localStorage)
 * @returns {Promise<Array>} Lista de pedidos com todos os detalhes
 * @throws {Error} Se o usuário não estiver autenticado ou houver erro na requisição
 */
export const getPedidosDaAssistencia = async (idPessoa = null) => {
  try {
    const token = localStorage.getItem('token');
    const id = idPessoa || localStorage.getItem('idPessoa');

    if (!token || !id) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Buscando pedidos da assistência:', id);

    const response = await api.get(`/api/Pedidos/assistencia/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Pedidos recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos da assistência:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Cria um novo pedido de peças
 * @param {Object} dadosPedido - Dados completos do pedido
 * @param {number} dadosPedido.assistenciaTecnicaId - ID da assistência técnica
 * @param {string} dadosPedido.fornecedor - Nome do fornecedor
 * @param {string} dadosPedido.tipoEntrega - Tipo de entrega ("Normal" ou "Urgente")
 * @param {string} dadosPedido.metodoPagamento - Método de pagamento ("Pix" ou "Cartão de Crédito")
 * @param {Array} dadosPedido.items - Lista de itens do pedido
 * @param {Object} dadosPedido.endereco - Endereço de entrega
 * @param {number} dadosPedido.valorFrete - Valor do frete
 * @param {number} dadosPedido.valorProdutos - Valor total dos produtos
 * @param {number} dadosPedido.totalPago - Valor total do pedido (produtos + frete)
 * @returns {Promise<Object>} Dados do pedido criado com ID e código de entrega
 * @throws {Error} Se os dados forem inválidos ou houver erro na criação
 */
export const createPedido = async (dadosPedido) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Criando novo pedido:', dadosPedido);

    const response = await api.post('/api/Pedidos', dadosPedido, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pedido criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      // Se houver mensagem de validação do backend, lança com detalhes
      if (error.response.data?.details) {
        throw new Error(`Erro de validação: ${JSON.stringify(error.response.data.details)}`);
      }
    }

    throw error;
  }
};

/**
 * Busca um pedido específico por ID
 * @param {number} id - ID do pedido
 * @returns {Promise<Object>} Dados completos do pedido incluindo histórico
 * @throws {Error} Se o pedido não for encontrado ou houver erro na busca
 */
export const getPedidoPorId = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Buscando pedido:', id);

    const response = await api.get(`/api/Pedidos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Pedido encontrado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Pedido não encontrado.');
      } else if (error.response.status === 403) {
        throw new Error('Você não tem permissão para visualizar este pedido.');
      }
    }

    throw error;
  }
};

/**
 * Atualiza o status de um pedido
 * @param {number} id - ID do pedido
 * @param {string} novoStatus - Novo status do pedido
 * @param {string} [observacao] - Observação sobre a mudança de status (opcional)
 * @returns {Promise<Object>} Dados da atualização de status
 * @throws {Error} Se o status for inválido ou a transição não for permitida
 */
export const updateStatusPedido = async (id, novoStatus, observacao = '') => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Atualizando status do pedido:', { id, novoStatus, observacao });

    const response = await api.put(
      `/api/Pedidos/${id}/status`,
      {
        novoStatus,
        observacao
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Status atualizado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao atualizar status do pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.status === 400) {
        throw new Error(error.response.data?.error || 'Status inválido ou transição não permitida.');
      } else if (error.response.status === 403) {
        throw new Error('Você não tem permissão para atualizar este pedido.');
      } else if (error.response.status === 404) {
        throw new Error('Pedido não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Cancela um pedido
 * @param {number} id - ID do pedido a ser cancelado
 * @param {string} [motivo] - Motivo do cancelamento (opcional)
 * @returns {Promise<Object>} Dados da confirmação de cancelamento
 * @throws {Error} Se o cancelamento não for permitido ou houver erro na operação
 */
export const cancelPedido = async (id, motivo = '') => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Cancelando pedido:', { id, motivo });

    const response = await api.delete(`/api/Pedidos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: motivo ? { motivo } : undefined
    });

    console.log('✅ Pedido cancelado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao cancelar pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.status === 400) {
        throw new Error(error.response.data?.error || 'Não é possível cancelar este pedido.');
      } else if (error.response.status === 403) {
        throw new Error('Você não tem permissão para cancelar este pedido.');
      } else if (error.response.status === 404) {
        throw new Error('Pedido não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Função auxiliar para validar dados de pedido antes de enviar
 * @param {Object} dadosPedido - Dados do pedido a validar
 * @returns {Object} Objeto com { valid: boolean, errors: Array<string> }
 */
export const validarDadosPedido = (dadosPedido) => {
  const errors = [];

  // Validações básicas
  if (!dadosPedido.assistenciaTecnicaId) {
    errors.push('ID da assistência técnica é obrigatório');
  }

  if (!dadosPedido.fornecedor || dadosPedido.fornecedor.trim() === '') {
    errors.push('Fornecedor é obrigatório');
  }

  if (!dadosPedido.tipoEntrega || !['Normal', 'Urgente'].includes(dadosPedido.tipoEntrega)) {
    errors.push('Tipo de entrega inválido (deve ser "Normal" ou "Urgente")');
  }

  if (!dadosPedido.metodoPagamento || !['Pix', 'Cartão de Crédito'].includes(dadosPedido.metodoPagamento)) {
    errors.push('Método de pagamento inválido (deve ser "Pix" ou "Cartão de Crédito")');
  }

  // Validação de items
  if (!dadosPedido.items || !Array.isArray(dadosPedido.items) || dadosPedido.items.length === 0) {
    errors.push('O pedido deve conter pelo menos 1 item');
  } else {
    dadosPedido.items.forEach((item, index) => {
      if (!item.produtoId) {
        errors.push(`Item ${index + 1}: ID do produto é obrigatório`);
      }
      if (!item.nome || item.nome.trim() === '') {
        errors.push(`Item ${index + 1}: Nome do produto é obrigatório`);
      }
      if (!item.quantidade || item.quantidade < 1) {
        errors.push(`Item ${index + 1}: Quantidade deve ser maior que 0`);
      }
      if (!item.preco || item.preco <= 0) {
        errors.push(`Item ${index + 1}: Preço deve ser maior que 0`);
      }
    });
  }

  // Validação de endereço
  if (!dadosPedido.endereco) {
    errors.push('Endereço de entrega é obrigatório');
  } else {
    const { cep, logradouro, numero, bairro, cidade, estado } = dadosPedido.endereco;

    if (!cep || !/^\d{5}-?\d{3}$/.test(cep)) {
      errors.push('CEP inválido (formato: #####-### ou ########)');
    }
    if (!logradouro || logradouro.trim() === '') {
      errors.push('Logradouro é obrigatório');
    }
    if (!numero || numero.trim() === '') {
      errors.push('Número do endereço é obrigatório');
    }
    if (!bairro || bairro.trim() === '') {
      errors.push('Bairro é obrigatório');
    }
    if (!cidade || cidade.trim() === '') {
      errors.push('Cidade é obrigatória');
    }
    if (!estado || estado.trim() === '' || estado.length !== 2) {
      errors.push('Estado inválido (use sigla de 2 letras, ex: SP)');
    }
  }

  // Validação de valores
  if (typeof dadosPedido.valorFrete !== 'number' || dadosPedido.valorFrete < 0) {
    errors.push('Valor do frete inválido');
  }

  if (typeof dadosPedido.valorProdutos !== 'number' || dadosPedido.valorProdutos <= 0) {
    errors.push('Valor dos produtos inválido');
  }

  if (typeof dadosPedido.totalPago !== 'number' || dadosPedido.totalPago <= 0) {
    errors.push('Valor total inválido');
  }

  // Validação de cálculo
  const totalCalculado = dadosPedido.valorProdutos + dadosPedido.valorFrete;
  if (Math.abs(totalCalculado - dadosPedido.totalPago) > 0.01) { // Tolerância para arredondamento
    errors.push(`Total pago não corresponde à soma (Produtos: ${dadosPedido.valorProdutos} + Frete: ${dadosPedido.valorFrete} ≠ Total: ${dadosPedido.totalPago})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Status válidos para pedidos
 */
export const STATUS_PEDIDO = {
  AGUARDANDO_ACEITE: 'Aguardando Aceite',
  ACEITO: 'Aceito',
  EM_SEPARACAO: 'Em Separação',
  AGUARDANDO_RETIRADA: 'Aguardando Retirada',
  EM_TRANSITO: 'Em Trânsito',
  ENTREGUE: 'Entregue ao Cliente',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
  RECUSADO: 'Recusado'
};

/**
 * Tipos de entrega válidos
 */
export const TIPOS_ENTREGA = {
  NORMAL: 'Normal',
  URGENTE: 'Urgente'
};

/**
 * Métodos de pagamento válidos
 */
export const METODOS_PAGAMENTO = {
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de Crédito'
};
