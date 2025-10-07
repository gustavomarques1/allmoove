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
 * Busca todos os pedidos de um distribuidor/fornecedor específico
 * @param {string} fornecedor - Nome do fornecedor (se não fornecido, busca do localStorage)
 * @returns {Promise<Array>} Lista de pedidos destinados a este fornecedor
 * @throws {Error} Se o usuário não estiver autenticado ou houver erro na requisição
 */
export const getPedidosDoDistribuidor = async (fornecedor = null) => {
  try {
    const token = localStorage.getItem('token');
    const fornecedorNome = fornecedor || localStorage.getItem('fornecedor');

    if (!token || !fornecedorNome) {
      throw new Error('Usuário não autenticado ou fornecedor não identificado.');
    }

    console.log('📡 Buscando pedidos do distribuidor:', fornecedorNome);

    const response = await api.get(`/api/Pedidos/distribuidor/${encodeURIComponent(fornecedorNome)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Pedidos do distribuidor recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos do distribuidor:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }

    throw error;
  }
};

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
 * @param {number} dadosPedido.idPessoa - ID da pessoa/assistência técnica
 * @param {string} dadosPedido.fornecedor - Nome do fornecedor
 * @param {string} dadosPedido.tipoEntrega - "Normal" ou "Urgente"
 * @param {string} dadosPedido.metodoPagamento - "Pix" ou "Cartão de Crédito"
 * @param {Array} dadosPedido.items - Itens do pedido [{produtoId, nome, quantidade, preco}]
 * @param {Object} dadosPedido.endereco - Endereço de entrega completo
 * @param {number} dadosPedido.valorFrete - Valor do frete
 * @param {number} dadosPedido.valorProdutos - Valor total dos produtos
 * @param {number} dadosPedido.totalPago - Valor total (produtos + frete)
 * @returns {Promise<Object>} Dados do pedido criado com ID, codigoEntrega e status
 * @throws {Error} Se os dados forem inválidos ou houver erro na criação
 */
export const createPedido = async (dadosPedido) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Monta payload completo conforme especificação da API
    const payload = {
      assistenciaTecnicaId: dadosPedido.idPessoa || dadosPedido.assistenciaTecnicaId,
      fornecedor: dadosPedido.fornecedor,
      tipoEntrega: dadosPedido.tipoEntrega,
      metodoPagamento: dadosPedido.metodoPagamento,
      items: dadosPedido.items.map(item => ({
        produtoId: item.id || item.produtoId,
        nome: item.nome || item.name,
        quantidade: item.quantidade || item.quantity,
        preco: item.preco || item.price
      })),
      endereco: {
        cep: dadosPedido.endereco.cep,
        logradouro: dadosPedido.endereco.logradouro,
        numero: dadosPedido.endereco.numero,
        complemento: dadosPedido.endereco.complemento || '',
        bairro: dadosPedido.endereco.bairro,
        cidade: dadosPedido.endereco.cidade,
        estado: dadosPedido.endereco.estado
      },
      valorFrete: dadosPedido.valorFrete,
      valorProdutos: dadosPedido.valorProdutos,
      totalPago: dadosPedido.totalPago
    };

    console.log('📡 Criando novo pedido completo:', payload);

    const response = await api.post('/api/Pedidos', payload, {
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
  if (!dadosPedido.idPessoa && !dadosPedido.assistenciaTecnicaId) {
    errors.push('ID da pessoa/assistência técnica é obrigatório');
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
    errors.push('Lista de items não pode estar vazia');
  } else {
    dadosPedido.items.forEach((item, index) => {
      if (!item.id && !item.produtoId) {
        errors.push(`Item ${index + 1}: ID do produto é obrigatório`);
      }
      if (!item.nome && !item.name) {
        errors.push(`Item ${index + 1}: Nome do produto é obrigatório`);
      }
      if (!item.quantidade && !item.quantity) {
        errors.push(`Item ${index + 1}: Quantidade é obrigatória`);
      }
      if ((!item.preco && !item.price) || (item.preco || item.price) <= 0) {
        errors.push(`Item ${index + 1}: Preço deve ser maior que zero`);
      }
    });
  }

  // Validação de endereço
  if (!dadosPedido.endereco) {
    errors.push('Endereço de entrega é obrigatório');
  } else {
    const camposObrigatorios = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
    camposObrigatorios.forEach(campo => {
      if (!dadosPedido.endereco[campo] || dadosPedido.endereco[campo].trim() === '') {
        errors.push(`Endereço: ${campo} é obrigatório`);
      }
    });
  }

  // Validação de valores (valorFrete pode ser 0)
  if (typeof dadosPedido.valorFrete !== 'number' || dadosPedido.valorFrete < 0) {
    errors.push('Valor do frete inválido');
  }

  if (typeof dadosPedido.valorProdutos !== 'number' || dadosPedido.valorProdutos <= 0) {
    errors.push('Valor dos produtos deve ser maior que zero');
  }

  if (typeof dadosPedido.totalPago !== 'number' || dadosPedido.totalPago <= 0) {
    errors.push('Valor total deve ser maior que zero');
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
