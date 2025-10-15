import api from './api';

/**
 * Serviço de Itens de Pedido - Nível 3 da hierarquia
 *
 * Um PedidoItem representa um PRODUTO INDIVIDUAL dentro de um pedido.
 * Cada item vincula um produto a um pedido com quantidade e preço.
 *
 * Hierarquia:
 * PedidoGrupo (1 compra) → Pedidos (N fornecedores) → PedidoItems (M produtos) ⭐
 */

/**
 * Busca todos os itens de pedidos
 * @returns {Promise<Array>} Lista de itens
 * @throws {Error} Se houver erro na requisição
 */
export const getPedidoItems = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Buscando todos os itens de pedidos');

    const response = await api.get('/api/PedidoItems', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Itens de pedidos recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar itens de pedidos:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Busca um item de pedido específico por ID
 * @param {number} id - ID do item
 * @returns {Promise<Object>} Dados do item
 * @throws {Error} Se o item não for encontrado ou houver erro
 */
export const getPedidoItemPorId = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Buscando item de pedido:', id);

    const response = await api.get(`/api/PedidoItems/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Item de pedido encontrado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar item de pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Item de pedido não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Busca todos os itens de um pedido específico
 * @param {number} idPedido - ID do pedido
 * @returns {Promise<Array>} Lista de itens do pedido
 * @throws {Error} Se houver erro na busca
 */
export const getPedidoItemsPorPedido = async (idPedido) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Buscando itens do pedido:', idPedido);

    const response = await api.get(`/api/PedidoItems/pedido/${idPedido}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(`✅ ${response.data.length} itens encontrados para o pedido ${idPedido}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar itens do pedido ${idPedido}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        console.warn(`⚠️ Nenhum item encontrado para o pedido ${idPedido}`);
        return []; // Retorna array vazio se não encontrar itens
      }
    }

    throw error;
  }
};

/**
 * Cria um novo item de pedido
 *
 * Este é o TERCEIRO PASSO no fluxo hierárquico de criação.
 * 1º - Criar PedidoGrupo (createPedidoGrupo)
 * 2º - Criar Pedidos vinculados ao grupo (createPedido)
 * 3º - Criar PedidoItems vinculados aos pedidos (esta função) ⭐
 *
 * @param {Object} dadosItem - Dados do item
 * @param {number} dadosItem.idPedido - ID do pedido (obrigatório)
 * @param {number} dadosItem.idProduto - ID do produto (obrigatório)
 * @param {number} dadosItem.quantidade - Quantidade do produto (obrigatório)
 * @param {number} dadosItem.preco - Preço unitário (obrigatório)
 * @param {string} [dadosItem.nome] - Nome do produto (opcional)
 * @param {number} [dadosItem.desconto] - Desconto aplicado (opcional)
 * @param {number} [dadosItem.empresa] - ID da empresa (padrão: 1)
 * @param {number} [dadosItem.estabelecimento] - ID do estabelecimento (padrão: 1)
 * @returns {Promise<Object>} Dados do item criado incluindo o ID
 * @throws {Error} Se os dados forem inválidos ou houver erro na criação
 *
 * @example
 * const item = await createPedidoItem({
 *   idPedido: 456,
 *   idProduto: 10,
 *   nome: "Tela LCD iPhone 12",
 *   quantidade: 2,
 *   preco: 150.00,
 *   desconto: 10.00
 * });
 */
export const createPedidoItem = async (dadosItem) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Validação básica
    if (!dadosItem.idPedido) {
      throw new Error('ID do pedido é obrigatório para criar um item.');
    }

    if (!dadosItem.idProduto) {
      throw new Error('ID do produto é obrigatório.');
    }

    if (!dadosItem.quantidade || dadosItem.quantidade <= 0) {
      throw new Error('Quantidade deve ser maior que zero.');
    }

    if (!dadosItem.preco || dadosItem.preco < 0) {
      throw new Error('Preço deve ser maior ou igual a zero.');
    }

    // Monta payload
    const payload = {
      empresa: dadosItem.empresa || 1,
      estabelecimento: dadosItem.estabelecimento || 1,
      idPedido: dadosItem.idPedido,
      idProduto: dadosItem.idProduto,
      nome: dadosItem.nome || '',
      quantidade: dadosItem.quantidade,
      preco: dadosItem.preco,
      desconto: dadosItem.desconto || 0,
      situacao: 'ATIVO',
      situacaoRegistro: 'ATIVO'
    };

    console.log('📡 Criando novo item de pedido:', payload);

    const response = await api.post('/api/PedidoItems', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Item de pedido criado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar item de pedido:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.data?.details) {
        throw new Error(`Erro de validação: ${JSON.stringify(error.response.data.details)}`);
      }
    }

    throw error;
  }
};

/**
 * Cria múltiplos itens de pedido de uma vez
 *
 * Função auxiliar para criar vários itens em sequência.
 * Útil ao criar um pedido com múltiplos produtos.
 *
 * @param {number} idPedido - ID do pedido ao qual os itens pertencem
 * @param {Array} produtos - Array de produtos com { idProduto, nome, quantidade, preco, desconto }
 * @returns {Promise<Array>} Array com os itens criados
 * @throws {Error} Se houver erro na criação de algum item
 *
 * @example
 * const itens = await createMultiplosPedidoItems(456, [
 *   { idProduto: 10, nome: "Tela LCD", quantidade: 2, preco: 150.00 },
 *   { idProduto: 11, nome: "Bateria", quantidade: 1, preco: 80.00 }
 * ]);
 */
export const createMultiplosPedidoItems = async (idPedido, produtos) => {
  const itensCriados = [];
  const erros = [];

  console.log(`📦 Criando ${produtos.length} itens para o pedido ${idPedido}`);

  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];

    try {
      const itemCriado = await createPedidoItem({
        idPedido,
        idProduto: produto.idProduto || produto.id,
        nome: produto.nome || produto.name,
        quantidade: produto.quantidade || produto.quantity,
        preco: produto.preco || produto.price || produto.precoVenda,
        desconto: produto.desconto || 0
      });

      itensCriados.push(itemCriado);
      console.log(`✅ Item ${i + 1}/${produtos.length} criado: ${produto.nome}`);
    } catch (error) {
      console.error(`❌ Erro ao criar item ${i + 1}/${produtos.length}:`, error);
      erros.push({
        produto,
        erro: error.message
      });
    }
  }

  if (erros.length > 0) {
    console.warn(`⚠️ ${erros.length} erro(s) ao criar itens:`, erros);
  }

  console.log(`✅ Total de ${itensCriados.length}/${produtos.length} itens criados com sucesso`);

  return {
    itensCriados,
    erros,
    sucesso: erros.length === 0
  };
};

/**
 * Atualiza um item de pedido existente
 * @param {number} id - ID do item a atualizar
 * @param {Object} dadosItem - Novos dados do item
 * @returns {Promise<Object>} Confirmação da atualização
 * @throws {Error} Se o item não for encontrado ou houver erro
 */
export const updatePedidoItem = async (id, dadosItem) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const payload = {
      id: id,
      ...dadosItem
    };

    console.log('📡 Atualizando item de pedido:', id, payload);

    const response = await api.put(`/api/PedidoItems/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Item de pedido atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao atualizar item de pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Item de pedido não encontrado.');
      } else if (error.response.status === 400) {
        throw new Error('Dados inválidos para atualização.');
      }
    }

    throw error;
  }
};

/**
 * Exclui um item de pedido
 * @param {number} id - ID do item a excluir
 * @returns {Promise<Object>} Confirmação da exclusão
 * @throws {Error} Se o item não for encontrado ou houver erro
 */
export const deletePedidoItem = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📡 Excluindo item de pedido:', id);

    const response = await api.delete(`/api/PedidoItems/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Item de pedido excluído:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao excluir item de pedido ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Item de pedido não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Função auxiliar para validar dados de item antes de enviar
 * @param {Object} dadosItem - Dados do item a validar
 * @returns {Object} Objeto com { valid: boolean, errors: Array<string> }
 */
export const validarDadosPedidoItem = (dadosItem) => {
  const errors = [];

  if (!dadosItem.idPedido) {
    errors.push('ID do pedido é obrigatório');
  }

  if (!dadosItem.idProduto) {
    errors.push('ID do produto é obrigatório');
  }

  if (!dadosItem.quantidade || dadosItem.quantidade <= 0) {
    errors.push('Quantidade deve ser maior que zero');
  }

  if (typeof dadosItem.preco !== 'number' || dadosItem.preco < 0) {
    errors.push('Preço deve ser maior ou igual a zero');
  }

  if (dadosItem.desconto && (typeof dadosItem.desconto !== 'number' || dadosItem.desconto < 0)) {
    errors.push('Desconto deve ser maior ou igual a zero');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
