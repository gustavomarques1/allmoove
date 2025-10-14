import api from './api';

/**
 * Serviço de estoque - integração com API de Produtos
 *
 * Este serviço gerencia o estoque do distribuidor usando o endpoint /api/Produtos
 * como backend, já que não existe um endpoint /api/Estoque específico.
 */

/**
 * Busca o estoque do distribuidor
 * @param {number|string} idDistribuidor - ID do distribuidor (opcional, usa localStorage se não fornecido)
 * @returns {Promise<Array>} Lista de produtos no estoque
 * @throws {Error} Se houver erro na requisição
 */
export const getEstoqueDoDistribuidor = async (idDistribuidor = null) => {
  try {
    const token = localStorage.getItem('token');
    const id = idDistribuidor || localStorage.getItem('idPessoa');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('📦 Buscando estoque do distribuidor:', id);

    const response = await api.get('/api/Produtos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Produtos recebidos da API:', response.data.length);

    // Mapeia produtos para formato de estoque esperado pela TelaEstoque
    const estoque = response.data.map(produto => ({
      id: produto.id,
      nome: produto.nome || 'Sem nome',
      descricao: produto.descricao || '',
      marca: produto.marca || 'Sem marca',
      quantidade: produto.quantidade || 0,
      valorUnitario: produto.precoVenda || 0,
      localFisico: produto.localizacao || '-',
      lote: produto.lote || '-',
      status: calcularStatus(produto.quantidade),
      // Campos adicionais que podem ser úteis
      categoria: produto.categoria || '',
      fornecedor: produto.fornecedor || produto.distribuidor || '',
      sku: produto.sku || '',
      ean: produto.ean || ''
    }));

    console.log('📊 Estoque formatado:', estoque.length, 'itens');

    return estoque;
  } catch (error) {
    console.error('❌ Erro ao buscar estoque:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    }

    throw error;
  }
};

/**
 * Cria um novo produto no estoque
 * @param {Object} produto - Dados do produto
 * @param {string} produto.nome - Nome do produto
 * @param {string} produto.descricao - Descrição do produto
 * @param {string} produto.marca - Marca do produto
 * @param {number} produto.quantidade - Quantidade em estoque
 * @param {number} produto.valorUnitario - Preço unitário
 * @param {string} produto.localFisico - Localização física no estoque
 * @param {string} produto.lote - Número do lote
 * @returns {Promise<Object>} Produto criado
 * @throws {Error} Se os dados forem inválidos ou houver erro na criação
 */
export const createProdutoEstoque = async (produto) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Valida dados básicos
    if (!produto.nome || produto.nome.trim() === '') {
      throw new Error('Nome do produto é obrigatório');
    }

    if (!produto.quantidade || produto.quantidade < 0) {
      throw new Error('Quantidade deve ser maior ou igual a zero');
    }

    if (!produto.valorUnitario || produto.valorUnitario <= 0) {
      throw new Error('Valor unitário deve ser maior que zero');
    }

    // Mapeia para formato esperado pela API de Produtos
    const payload = {
      nome: produto.nome,
      descricao: produto.descricao || '',
      marca: produto.marca || '',
      quantidade: produto.quantidade,
      precoVenda: produto.valorUnitario,
      localizacao: produto.localFisico || '',
      lote: produto.lote || '',
      categoria: produto.categoria || '',
      fornecedor: produto.fornecedor || '',
      sku: produto.sku || '',
      ean: produto.ean || '',
      // Campos adicionais que o backend pode esperar
      empresa: 1, // TODO: Buscar do contexto/usuário
      estabelecimento: 1 // TODO: Buscar do contexto/usuário
    };

    console.log('📦 Criando novo produto no estoque:', payload);

    const response = await api.post('/api/Produtos', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Produto criado com sucesso:', response.data);

    // Retorna no formato de estoque
    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: response.data.marca || '',
      quantidade: response.data.quantidade || 0,
      valorUnitario: response.data.precoVenda || 0,
      localFisico: response.data.localizacao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade)
    };
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.status === 400) {
        throw new Error('Dados inválidos. Verifique os campos obrigatórios.');
      }
    }

    throw error;
  }
};

/**
 * Atualiza um produto do estoque
 * @param {number} id - ID do produto
 * @param {Object} produto - Dados atualizados do produto
 * @returns {Promise<Object>} Produto atualizado
 * @throws {Error} Se o produto não for encontrado ou houver erro na atualização
 */
export const updateProdutoEstoque = async (id, produto) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // Mapeia para formato esperado pela API de Produtos
    const payload = {
      id: id,
      nome: produto.nome,
      descricao: produto.descricao || '',
      marca: produto.marca || '',
      quantidade: produto.quantidade,
      precoVenda: produto.valorUnitario,
      localizacao: produto.localFisico || '',
      lote: produto.lote || '',
      categoria: produto.categoria || '',
      fornecedor: produto.fornecedor || '',
      sku: produto.sku || '',
      ean: produto.ean || ''
    };

    console.log('📝 Atualizando produto:', id, payload);

    const response = await api.put(`/api/Produtos/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Produto atualizado com sucesso:', response.data);

    // Retorna no formato de estoque
    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: response.data.marca || '',
      quantidade: response.data.quantidade || 0,
      valorUnitario: response.data.precoVenda || 0,
      localFisico: response.data.localizacao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade)
    };
  } catch (error) {
    console.error(`❌ Erro ao atualizar produto ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.status === 404) {
        throw new Error('Produto não encontrado.');
      } else if (error.response.status === 400) {
        throw new Error('Dados inválidos. Verifique os campos obrigatórios.');
      }
    }

    throw error;
  }
};

/**
 * Exclui um produto do estoque
 * @param {number} id - ID do produto a ser excluído
 * @returns {Promise<Object>} Confirmação de exclusão
 * @throws {Error} Se o produto não for encontrado ou houver erro na exclusão
 */
export const deleteProdutoEstoque = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('🗑️ Excluindo produto:', id);

    await api.delete(`/api/Produtos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Produto excluído com sucesso:', id);

    return { success: true, message: 'Produto excluído com sucesso' };
  } catch (error) {
    console.error(`❌ Erro ao excluir produto ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);

      if (error.response.status === 404) {
        throw new Error('Produto não encontrado.');
      } else if (error.response.status === 400) {
        throw new Error('Não é possível excluir este produto.');
      }
    }

    throw error;
  }
};

/**
 * Busca um produto específico do estoque
 * @param {number} id - ID do produto
 * @returns {Promise<Object>} Dados do produto
 * @throws {Error} Se o produto não for encontrado
 */
export const getProdutoEstoquePorId = async (id) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    console.log('🔍 Buscando produto:', id);

    const response = await api.get(`/api/Produtos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Produto encontrado:', response.data);

    // Retorna no formato de estoque
    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: response.data.marca || '',
      quantidade: response.data.quantidade || 0,
      valorUnitario: response.data.precoVenda || 0,
      localFisico: response.data.localizacao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade),
      categoria: response.data.categoria || '',
      fornecedor: response.data.fornecedor || '',
      sku: response.data.sku || '',
      ean: response.data.ean || ''
    };
  } catch (error) {
    console.error(`❌ Erro ao buscar produto ${id}:`, error);

    if (error.response) {
      console.error('Status:', error.response.status);

      if (error.response.status === 404) {
        throw new Error('Produto não encontrado.');
      }
    }

    throw error;
  }
};

/**
 * Função auxiliar para calcular o status do produto baseado na quantidade
 * @param {number} quantidade - Quantidade em estoque
 * @returns {string} Status: 'disponivel', 'estoque-baixo' ou 'sem-estoque'
 */
const calcularStatus = (quantidade) => {
  if (quantidade === 0) return 'sem-estoque';
  if (quantidade <= 5) return 'estoque-baixo';
  return 'disponivel';
};

/**
 * Função auxiliar para validar dados de produto antes de enviar
 * @param {Object} produto - Dados do produto a validar
 * @returns {Object} Objeto com { valid: boolean, errors: Array<string> }
 */
export const validarDadosProduto = (produto) => {
  const errors = [];

  if (!produto.nome || produto.nome.trim() === '') {
    errors.push('Nome do produto é obrigatório');
  }

  if (typeof produto.quantidade !== 'number' || produto.quantidade < 0) {
    errors.push('Quantidade deve ser um número maior ou igual a zero');
  }

  if (typeof produto.valorUnitario !== 'number' || produto.valorUnitario <= 0) {
    errors.push('Valor unitário deve ser um número maior que zero');
  }

  if (produto.marca && produto.marca.length > 100) {
    errors.push('Marca não pode ter mais de 100 caracteres');
  }

  if (produto.descricao && produto.descricao.length > 500) {
    errors.push('Descrição não pode ter mais de 500 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Status válidos para produtos do estoque
 */
export const STATUS_ESTOQUE = {
  DISPONIVEL: 'disponivel',
  ESTOQUE_BAIXO: 'estoque-baixo',
  SEM_ESTOQUE: 'sem-estoque'
};
