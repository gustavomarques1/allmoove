import api from './api';
import logger from '../utils/logger';

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

    // 🔧 IMPORTANTE: Prioriza idDistribuidor do localStorage, depois idPessoa
    // O idDistribuidor é o ID correto da tabela DISTRIBUIDORES
    // O idPessoa pode ser o ID da tabela PESSOAS (não é o mesmo!)
    const id = idDistribuidor
      || localStorage.getItem('idDistribuidor')
      || localStorage.getItem('idPessoa');

    if (!token || !id) {
      throw new Error('Usuário não autenticado ou distribuidor não identificado.');
    }

    logger.info('📦 Buscando estoque do distribuidor ID:', id);

    // 🔧 Tenta buscar produtos apenas deste distribuidor
    // Opção 1: Endpoint específico (se existir)
    // Opção 2: Query string (fallback)
    let response;

    try {
      // Tenta o endpoint específico primeiro
      response = await api.get(`/api/Produtos/distribuidor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      logger.info('✅ Produtos do distribuidor recebidos (endpoint específico):', response.data.length);
    } catch (endpointError) {
      // Se der 404, tenta com query string
      if (endpointError.response?.status === 404) {
        logger.warn('⚠️ Endpoint /api/Produtos/distribuidor/{id} não existe, tentando query string...');

        response = await api.get('/api/Produtos', {
          params: { idDistribuidor: id },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        logger.info('✅ Produtos recebidos (query string):', response.data.length);
      } else {
        // Se for outro erro, relança
        throw endpointError;
      }
    }

    // 🔧 IMPORTANTE: Filtra no frontend também, caso o backend não filtre
    // Isso garante que apenas produtos do distribuidor logado sejam exibidos
    let produtosFiltrados = response.data;

    // Verifica se os produtos têm o campo idDistribuidor
    const primeiroComDistribuidor = produtosFiltrados.find(p => p.idDistribuidor || p.distribuidorId);

    if (primeiroComDistribuidor) {
      // Se tem o campo, faz filtro no frontend para garantir
      const campoDistribuidor = primeiroComDistribuidor.idDistribuidor !== undefined ? 'idDistribuidor' : 'distribuidorId';

      produtosFiltrados = produtosFiltrados.filter(produto => {
        const idDistribuidorProduto = produto[campoDistribuidor];
        return idDistribuidorProduto && parseInt(idDistribuidorProduto) === parseInt(id);
      });

      logger.info(`✅ Filtro aplicado: ${response.data.length} produtos → ${produtosFiltrados.length} do distribuidor ${id}`);
    } else {
      logger.warn('⚠️ Produtos não têm campo idDistribuidor/distribuidorId. Exibindo todos os produtos.');
    }

    // Log para debug - verificar estrutura dos produtos
    if (produtosFiltrados.length > 0) {
      logger.info('🔍 ESTRUTURA COMPLETA do primeiro produto:', produtosFiltrados[0]);
      logger.info('🔍 TODAS AS CHAVES do primeiro produto:', Object.keys(produtosFiltrados[0]));
      logger.info('🔍 Campos de preço/quantidade do primeiro produto:', {
        nome: produtosFiltrados[0].nome,
        quantidade: produtosFiltrados[0].quantidade,
        precoVenda: produtosFiltrados[0].precoVenda,
        precoVendaPix: produtosFiltrados[0].precoVendaPix,
        price: produtosFiltrados[0].price,
        precoCusto: produtosFiltrados[0].precoCusto,
        // Campos aninhados (se existir objeto produto dentro)
        'produto.price': produtosFiltrados[0].produto?.price,
        'produto.quantidade': produtosFiltrados[0].produto?.quantidade
      });

      // Vamos procurar o produto "Teste Quantidade 001" especificamente
      const produtoTeste = produtosFiltrados.find(p => p.nome?.includes('Teste Quantidade 001'));
      if (produtoTeste) {
        logger.info('🧪 PRODUTO DE TESTE (Teste Quantidade 001):');
        logger.info('   Objeto completo:', produtoTeste);
        logger.info('   Todas as chaves:', Object.keys(produtoTeste));
      }
    }

    // Mapeia produtos para formato de estoque esperado pela TelaEstoque
    const estoque = produtosFiltrados.map(produto => {
      // 🔧 IMPORTANTE: O backend pode retornar a estrutura de várias formas:
      // 1. POST retorna: { precoVendaPix: 150, quantidade: 25, ... }
      // 2. GET retorna: { price: 150, quantidade: 25, ... } ou objeto aninhado

      // ✅ CAMPOS CORRETOS retornados pelo GET /api/Produtos/distribuidor/{id}:
      // - price (não precoVendaPix)
      // - estoque (não quantidade)

      const preco = produto.precoVendaPix ||
                   produto.PrecoVendaPix ||
                   produto.precoVenda ||
                   produto.price ||  // ✅ GET retorna este campo!
                   produto.Price ||
                   produto.valorUnitario ||
                   0;

      // ✅ Backend retorna "estoque", não "quantidade"!
      const quantidade = produto.estoque !== undefined ? produto.estoque :
                        (produto.quantidade !== undefined ? produto.quantidade : 0);

      logger.info(`💰 Produto ${produto.nome}: preço=${preco}, quantidade=${quantidade} (price: ${produto.price}, estoque: ${produto.estoque})`);

      // Busca o nome da marca a partir dos objetos relacionados
      const nomeMarca = produto.marca ||
                       produto.Marca?.nome ||
                       produto.marca?.nome ||
                       produto.marcaNome ||
                       produto.MarcaNome ||
                       'Sem marca';

      return {
        id: produto.id,
        nome: produto.nome || 'Sem nome',
        descricao: produto.descricao || '',
        marca: nomeMarca,
        quantidade: quantidade,  // ✅ Usa a variável já mapeada acima (linha 131-132)
        valorUnitario: preco,
        localFisico: produto.localizacao || produto.posicao || '-',
        lote: produto.lote || '-',
        status: calcularStatus(quantidade),  // ✅ Usa a variável quantidade também aqui
        // Campos adicionais que podem ser úteis
        categoria: produto.categoria || produto.Segmento?.nome || produto.segmento?.nome || '',
        fornecedor: produto.fornecedor || produto.distribuidor || '',
        sku: produto.sku || '',
        ean: produto.ean || '',
        // Mantém IDs para edição
        idSegmento: produto.idSegmento,
        idMarca: produto.idMarca,
        idModelo: produto.idModelo,
        idGrupo: produto.idGrupo,
        idTag: produto.idTag,
        precoCusto: produto.precoCusto,
        imagem: produto.imagem,
        // Debug: adiciona todos os preços para verificar
        _debug_precos: {
          precoVenda: produto.precoVenda,
          preco_venda: produto.preco_venda,
          price: produto.price,
          PRECO_VENDA: produto.PRECO_VENDA,
          precoCusto: produto.precoCusto,
          precoVendaPix: produto.precoVendaPix
        }
      };
    });

    logger.info('📊 Estoque formatado:', estoque.length, 'itens');

    return estoque;
  } catch (error) {
    logger.error('❌ Erro ao buscar estoque:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);
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

    // 🔧 Associa o produto ao distribuidor logado
    // IMPORTANTE: Prioriza idDistribuidor do localStorage (não idPessoa!)
    const idDistribuidor = localStorage.getItem('idDistribuidor') || localStorage.getItem('idPessoa');

    if (!idDistribuidor) {
      throw new Error('ID do distribuidor não encontrado. Faça login novamente.');
    }

    // Valida preço de venda (aceita tanto precoVenda quanto valorUnitario para retrocompatibilidade)
    // 🔧 IMPORTANTE: O backend usa PrecoVendaPix como campo principal, não PrecoVenda
    // PrecoVenda é apenas um alias [NotMapped] que aponta para PrecoVendaPix
    const precoVenda = produto.precoVenda ? parseFloat(produto.precoVenda) : (produto.valorUnitario ? parseFloat(produto.valorUnitario) : 0);

    if (precoVenda <= 0) {
      throw new Error('Preço de venda deve ser maior que zero');
    }

    // Mapeia para formato esperado pela API de Produtos
    // ✅ IMPORTANTE: O banco usa os nomes corretos com ID_ prefix
    // Estrutura real do banco: ID_MARCA, ID_MODELO, ID_GRUPO, ID_TAG, PRECO_CUSTO

    // 🔧 Converte valores vazios para null (banco de dados prefere null a strings vazias)
    // ⚠️ Campos obrigatórios (não podem ser null): nome, sku, precoVendaPix, idDistribuidor

    const payload = {
      // Campos obrigatórios
      nome: produto.nome?.trim(),
      sku: produto.sku?.trim(),
      // ✅ CAMPO CORRETO: precoVendaPix (PRECO_VENDA_PIX no banco)
      // PrecoVenda é apenas um alias [NotMapped] que NÃO salva no banco!
      precoVendaPix: precoVenda,
      idDistribuidor: parseInt(idDistribuidor),

      // Campos opcionais (null se vazio)
      descricao: produto.descricao?.trim() || null,
      ean: produto.ean?.trim() || null,
      quantidade: produto.quantidade !== undefined && produto.quantidade !== '' ? parseFloat(produto.quantidade) : 0,
      posicao: produto.posicao?.trim() || produto.localFisico?.trim() || null,
      imagem: produto.imagem?.trim() || null,
      precoCusto: produto.precoCusto ? parseFloat(produto.precoCusto) : null,

      // IDs de relacionamento (NOMES CORRETOS = mesmos do formulário!)
      idSegmento: produto.idSegmento ? parseInt(produto.idSegmento) : null,
      idMarca: produto.idMarca ? parseInt(produto.idMarca) : null,
      idModelo: produto.idModelo ? parseInt(produto.idModelo) : null,
      idGrupo: produto.idGrupo ? parseInt(produto.idGrupo) : null,
      idTag: produto.idTag ? parseInt(produto.idTag) : null,

      // Campos do sistema
      empresa: 1,
      estabelecimento: 1,
      situacaoRegistro: 'ATIVO',
      situacao: 'ATIVO'
    };

    logger.info('📦 Criando novo produto para o distribuidor ID:', idDistribuidor);
    logger.info('📊 Dados recebidos do formulário (produto param):', produto);
    logger.info('💰 Dados de precificação:', {
      precoVenda_recebido: produto.precoVenda,
      quantidade_recebida: produto.quantidade,
      precoCusto_recebido: produto.precoCusto,
      tipo_precoVenda: typeof produto.precoVenda,
      tipo_quantidade: typeof produto.quantidade,
      precoVenda_parseado: precoVenda
    });

    logger.info('🔍 VERIFICAÇÃO PRÉ-PAYLOAD:');
    logger.info('  quantidade original:', produto.quantidade);
    logger.info('  quantidade !== undefined:', produto.quantidade !== undefined);
    logger.info('  quantidade !== "":', produto.quantidade !== '');
    logger.info('  parseFloat(quantidade):', parseFloat(produto.quantidade));
    logger.info('  Resultado final:', produto.quantidade !== undefined && produto.quantidade !== '' ? parseFloat(produto.quantidade) : 0);

    logger.info('📤 Payload COMPLETO enviado para API:', JSON.stringify(payload, null, 2));
    logger.info('💵 Valores convertidos no payload:', {
      precoVendaPix: payload.precoVendaPix,
      quantidade: payload.quantidade,
      precoCusto: payload.precoCusto,
      tipo_quantidade_payload: typeof payload.quantidade
    });

    const response = await api.post('/api/Produtos', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info('✅ Produto criado com sucesso. Response COMPLETO:', JSON.stringify(response.data, null, 2));

    // ⚠️ VERIFICAÇÃO CRÍTICA: O backend está retornando quantidade?
    logger.error('🚨 ALERTA CRÍTICO - Verificando resposta do backend:');
    logger.error('  ❓ response.data.quantidade existe?', 'quantidade' in response.data);
    logger.error('  ❓ response.data.estoque existe?', 'estoque' in response.data);
    logger.error('  ❓ Valor de response.data.quantidade:', response.data.quantidade);
    logger.error('  ❓ Valor de response.data.estoque:', response.data.estoque);
    logger.error('  📋 TODOS os campos retornados:', Object.keys(response.data).join(', '));

    // Log todos os campos importantes retornados pela API
    logger.info('🔍 CAMPOS IMPORTANTES retornados pela API:');
    logger.info('  ID:', response.data.id);
    logger.info('  Nome:', response.data.nome);
    logger.info('  SKU:', response.data.sku);
    logger.info('  Quantidade:', response.data.quantidade, '(tipo:', typeof response.data.quantidade, ')');
    logger.info('  Estoque:', response.data.estoque, '(tipo:', typeof response.data.estoque, ')');
    logger.info('  PrecoVendaPix:', response.data.precoVendaPix, '(tipo:', typeof response.data.precoVendaPix, ')');
    logger.info('  PrecoCusto:', response.data.precoCusto, '(tipo:', typeof response.data.precoCusto, ')');
    logger.info('  IdMarca:', response.data.idMarca);
    logger.info('  IdSegmento:', response.data.idSegmento);
    logger.info('  Descricao:', response.data.descricao);

    logger.info('🔍 TODOS os campos de preço/quantidade:');
    Object.keys(response.data).forEach(key => {
      if (key.toLowerCase().includes('prec') || key.toLowerCase().includes('pric') ||
          key.toLowerCase().includes('valor') || key.toLowerCase().includes('cost') ||
          key.toLowerCase().includes('quant')) {
        logger.info(`   ${key}: ${response.data[key]} (tipo: ${typeof response.data[key]})`);
      }
    });

    logger.info('🔍 Verificando preços retornados:', {
      precoVenda: response.data.precoVenda,
      preco_venda: response.data.preco_venda,
      price: response.data.price,
      valorUnitario: response.data.valorUnitario,
      tipo_precoVenda: typeof response.data.precoVenda,
      tipo_price: typeof response.data.price
    });

    // Busca o campo de preço em várias possibilidades
    // 🔧 PRIORIZA precoVendaPix porque é o campo real mapeado no banco
    const precoEncontrado =
      response.data.precoVendaPix ||
      response.data.PrecoVendaPix ||
      response.data.precoVenda ||
      response.data.preco_venda ||
      response.data.PRECO_VENDA ||
      response.data.price ||
      response.data.Price ||
      response.data.PRICE ||
      response.data.valorVenda ||
      response.data.valor_venda ||
      0;

    logger.info(`💰 Preço encontrado: ${precoEncontrado} (de precoVendaPix: ${response.data.precoVendaPix})`);

    // Busca o nome da marca a partir dos objetos relacionados
    const nomeMarca = response.data.marca ||
                     response.data.Marca?.nome ||
                     response.data.marca?.nome ||
                     response.data.marcaNome ||
                     response.data.MarcaNome ||
                     'Sem marca';

    // Retorna no formato de estoque
    const produtoRetorno = {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: nomeMarca,
      quantidade: response.data.quantidade !== undefined ? response.data.quantidade : 0,
      valorUnitario: precoEncontrado,
      localFisico: response.data.localizacao || response.data.posicao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade),
      // Campos adicionais
      sku: response.data.sku || '',
      ean: response.data.ean || '',
      idSegmento: response.data.idSegmento,
      idMarca: response.data.idMarca,
      idModelo: response.data.idModelo,
      idGrupo: response.data.idGrupo,
      idTag: response.data.idTag,
      precoCusto: response.data.precoCusto,
      imagem: response.data.imagem,
      // Adiciona campos extras para debug
      precoVenda: response.data.precoVenda,
      precoVendaPix: response.data.precoVendaPix,
      price: response.data.price
    };

    logger.info('📦 Produto formatado para retorno:', produtoRetorno);
    return produtoRetorno;
  } catch (error) {
    logger.error('❌ Erro ao criar produto:', error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);

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

    // 🔧 Garante que o produto continua associado ao distribuidor logado
    // IMPORTANTE: Prioriza idDistribuidor do localStorage (não idPessoa!)
    const idDistribuidor = localStorage.getItem('idDistribuidor') || localStorage.getItem('idPessoa');

    if (!idDistribuidor) {
      throw new Error('ID do distribuidor não encontrado. Faça login novamente.');
    }

    // Mapeia para formato esperado pela API de Produtos
    // 🔧 IMPORTANTE: O backend usa PrecoVendaPix como campo principal
    const precoVenda = produto.precoVenda || produto.valorUnitario || produto.precoVendaPix;

    const payload = {
      id: id,
      nome: produto.nome?.trim(),
      sku: produto.sku?.trim(),
      // ✅ CAMPO CORRETO: precoVendaPix (PRECO_VENDA_PIX no banco)
      precoVendaPix: parseFloat(precoVenda),
      idDistribuidor: parseInt(idDistribuidor),

      // Campos opcionais
      descricao: produto.descricao?.trim() || null,
      ean: produto.ean?.trim() || null,
      quantidade: produto.quantidade ? parseFloat(produto.quantidade) : 0,
      posicao: produto.posicao?.trim() || produto.localFisico?.trim() || null,
      imagem: produto.imagem?.trim() || null,
      precoCusto: produto.precoCusto ? parseFloat(produto.precoCusto) : null,

      // IDs de relacionamento (NOMES CORRETOS)
      idSegmento: produto.idSegmento ? parseInt(produto.idSegmento) : null,
      idMarca: produto.idMarca ? parseInt(produto.idMarca) : null,
      idModelo: produto.idModelo ? parseInt(produto.idModelo) : null,
      idGrupo: produto.idGrupo ? parseInt(produto.idGrupo) : null,
      idTag: produto.idTag ? parseInt(produto.idTag) : null
    };

    logger.info('📝 Atualizando produto ID:', id, 'do distribuidor:', idDistribuidor);

    const response = await api.put(`/api/Produtos/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info('✅ Produto atualizado com sucesso:', response.data);

    // Retorna no formato de estoque
    // 🔧 Prioriza precoVendaPix porque é o campo real mapeado no banco
    const precoRetornado = response.data.precoVendaPix ||
                          response.data.PrecoVendaPix ||
                          response.data.precoVenda ||
                          response.data.valorUnitario ||
                          0;

    // Busca o nome da marca a partir dos objetos relacionados
    const nomeMarca = response.data.marca ||
                     response.data.Marca?.nome ||
                     response.data.marca?.nome ||
                     response.data.marcaNome ||
                     response.data.MarcaNome ||
                     'Sem marca';

    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: nomeMarca,
      quantidade: response.data.quantidade !== undefined ? response.data.quantidade : 0,
      valorUnitario: precoRetornado,
      localFisico: response.data.localizacao || response.data.posicao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade),
      // Campos adicionais
      sku: response.data.sku || '',
      ean: response.data.ean || '',
      idSegmento: response.data.idSegmento,
      idMarca: response.data.idMarca,
      idModelo: response.data.idModelo,
      idGrupo: response.data.idGrupo,
      idTag: response.data.idTag,
      precoCusto: response.data.precoCusto,
      imagem: response.data.imagem
    };
  } catch (error) {
    logger.error(`❌ Erro ao atualizar produto ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);

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

    logger.info('🗑️ Excluindo produto:', id);

    await api.delete(`/api/Produtos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Produto excluído com sucesso:', id);

    return { success: true, message: 'Produto excluído com sucesso' };
  } catch (error) {
    logger.error(`❌ Erro ao excluir produto ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);
      logger.error('Dados:', error.response.data);

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

    logger.info('🔍 Buscando produto:', id);

    const response = await api.get(`/api/Produtos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    logger.info('✅ Produto encontrado:', response.data);

    // Retorna no formato de estoque
    // 🔧 Prioriza precoVendaPix porque é o campo real mapeado no banco
    const precoRetornado = response.data.precoVendaPix ||
                          response.data.PrecoVendaPix ||
                          response.data.precoVenda ||
                          response.data.valorUnitario ||
                          0;

    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao || '',
      marca: response.data.marca || '',
      quantidade: response.data.quantidade || 0,
      valorUnitario: precoRetornado,
      localFisico: response.data.localizacao || '-',
      lote: response.data.lote || '-',
      status: calcularStatus(response.data.quantidade),
      categoria: response.data.categoria || '',
      fornecedor: response.data.fornecedor || '',
      sku: response.data.sku || '',
      ean: response.data.ean || ''
    };
  } catch (error) {
    logger.error(`❌ Erro ao buscar produto ${id}:`, error);

    if (error.response) {
      logger.error('Status:', error.response.status);

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
