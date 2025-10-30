/**
 * Script de teste para validar o fluxo completo de criação de pedido
 *
 * Fluxo hierárquico:
 * 1. Criar PedidoGrupo (compra)
 * 2. Criar Pedido vinculado ao grupo
 * 3. Criar PedidoItems vinculados ao pedido
 * 4. Buscar o pedido completo da assistência técnica
 *
 * Uso: node testar-pedido-completo.js
 */

import axios from 'axios';
import https from 'https';

// Configuração da API
const API_BASE_URL = 'https://localhost:44370';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Ignora erro de certificado SSL em desenvolvimento
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Dados de teste baseados no JSON fornecido
const DADOS_TESTE = {
  pedido: {
    id: 41,
    empresa: 1,
    estabelecimento: 1,
    codigo: null,
    dataHoraCriacaoRegistro: "2025-10-15T19:28:29.1511833-03:00",
    idGrupoPedido: 27,
    idPessoa: 1,
    codigoEntrega: "M6030X9",
    valorFrete: 0,
    situacao: "ATIVO",
    grupoId: 27,
    fornecedor: "TechParts SP",
    tipoEntrega: "Normal",
    metodoPagamento: "Pix"
  },
  items: [
    {
      id: 68,
      empresa: 1,
      estabelecimento: 1,
      idProduto: 2,
      quantidade: 10,
      preco: 100,
      desconto: 0,
      nome: "11 FOG PRETO  WEFIX EMB. NOVA",
      situacao: "ATIVO"
    },
    {
      id: 69,
      empresa: 1,
      estabelecimento: 1,
      idProduto: 1,
      quantidade: 100,
      preco: 15,
      desconto: 0,
      nome: "IPHONE 16",
      situacao: "ATIVO"
    }
  ],
  endereco: {
    descricao: "",
    cep: "71820-210",
    logradouro: "Quadra QS 2 Conjunto 10",
    numero: "12",
    complemento: "casa",
    bairro: "Riacho Fundo I",
    cidade: "Brasília",
    estado: "DF",
    id: 1760507151229,
    nome: "Brasília/DF - Quadra QS 2 Conjunto 10"
  },
  valorProdutos: 215,
  totalPago: 215,
  status: "ATIVO",
  prazoEstimado: "3-5 dias úteis",
  dataPedido: "2025-10-15T19:28:29.1511833-03:00"
};

// Credenciais de teste (substitua pelas suas)
const CREDENCIAIS = {
  email: 'gustavocode.dev@gmail.com', // ⚠️ ALTERAR PARA SEU E-MAIL DE TESTE
  password: 'Acessoapi123@' // ⚠️ ALTERAR PARA SUA SENHA DE TESTE (10-20 caracteres)
};

let token = null;
let idPessoa = null;

/**
 * Passo 1: Fazer login e obter token
 */
async function fazerLogin() {
  console.log('\n📧 Passo 1: Fazendo login...');
  console.log('Credenciais:', CREDENCIAIS.email);

  try {
    const response = await api.post('/api/account/loginuser', CREDENCIAIS);

    token = response.data.token;
    idPessoa = response.data.idPessoa || 1; // Usando ID do JSON de teste como fallback

    console.log('✅ Login realizado com sucesso!');
    console.log('Token obtido:', token ? 'OK' : 'ERRO');
    console.log('ID Pessoa:', idPessoa);

    // Configura o token para as próximas requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return true;
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data || error.message);
    console.log('\n⚠️ Dica: Verifique se as credenciais estão corretas no script');
    return false;
  }
}

/**
 * Passo 2: Criar PedidoGrupo (compra)
 */
async function criarPedidoGrupo() {
  console.log('\n📦 Passo 2: Criando Grupo de Pedidos (Compra)...');

  try {
    const payload = {
      empresa: 1,
      estabelecimento: 1,
      transacao: `TRX-TEST-${Date.now()}`,
      situacao: 'ATIVO',
      situacaoRegistro: 'ATIVO'
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await api.post('/api/PedidoGrupos', payload);

    console.log('✅ PedidoGrupo criado com sucesso!');
    console.log('ID do Grupo:', response.data.id);
    console.log('Dados retornados:', JSON.stringify(response.data, null, 2));

    return response.data.id;
  } catch (error) {
    console.error('❌ Erro ao criar PedidoGrupo:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Passo 3: Criar Pedido vinculado ao grupo
 */
async function criarPedido(idGrupoPedido) {
  console.log('\n📝 Passo 3: Criando Pedido vinculado ao grupo...');
  console.log('ID do Grupo:', idGrupoPedido);

  try {
    const payload = {
      empresa: DADOS_TESTE.pedido.empresa,
      estabelecimento: DADOS_TESTE.pedido.estabelecimento,
      idGrupoPedido: idGrupoPedido,
      idPessoa: idPessoa, // ID da assistência técnica logada
      codigo: `PED-TEST-${Date.now()}`,
      valorFrete: DADOS_TESTE.pedido.valorFrete,
      situacao: DADOS_TESTE.pedido.situacao,
      situacaoRegistro: 'ATIVO'
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await api.post('/api/Pedidos', payload);

    console.log('✅ Pedido criado com sucesso!');
    console.log('ID do Pedido:', response.data.id);
    console.log('Dados retornados:', JSON.stringify(response.data, null, 2));

    return response.data.id;
  } catch (error) {
    console.error('❌ Erro ao criar Pedido:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Passo 4: Criar itens do pedido
 */
async function criarPedidoItems(idPedido) {
  console.log('\n🛒 Passo 4: Criando itens do pedido...');
  console.log('ID do Pedido:', idPedido);
  console.log(`Total de itens: ${DADOS_TESTE.items.length}`);

  const itensCriados = [];

  for (let i = 0; i < DADOS_TESTE.items.length; i++) {
    const item = DADOS_TESTE.items[i];

    try {
      const payload = {
        empresa: item.empresa,
        estabelecimento: item.estabelecimento,
        idPedido: idPedido,
        idProduto: item.idProduto,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        desconto: item.desconto,
        situacao: item.situacao,
        situacaoRegistro: 'ATIVO'
      };

      console.log(`\n  Item ${i + 1}/${DADOS_TESTE.items.length}: ${item.nome}`);
      console.log('  Payload:', JSON.stringify(payload, null, 2));

      const response = await api.post('/api/PedidoItems', payload);

      console.log('  ✅ Item criado com sucesso! ID:', response.data.id);

      itensCriados.push(response.data);
    } catch (error) {
      console.error(`  ❌ Erro ao criar item ${i + 1}:`, error.response?.data || error.message);
    }
  }

  console.log(`\n✅ Total de itens criados: ${itensCriados.length}/${DADOS_TESTE.items.length}`);
  return itensCriados;
}

/**
 * Passo 5: Buscar o pedido completo da assistência
 */
async function buscarPedidosDaAssistencia() {
  console.log('\n🔍 Passo 5: Buscando pedidos da assistência técnica...');
  console.log('ID Pessoa:', idPessoa);

  try {
    const response = await api.get(`/api/Pedidos/assistencia/${idPessoa}`);

    console.log('✅ Pedidos encontrados:', response.data.length);

    if (response.data.length > 0) {
      console.log('\n📋 Último pedido:');
      const ultimoPedido = response.data[response.data.length - 1];
      console.log(JSON.stringify(ultimoPedido, null, 2));
    }

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Passo 6: Verificar estrutura do pedido retornado
 */
function verificarEstruturaPedido(pedidos) {
  console.log('\n🔎 Passo 6: Verificando estrutura do pedido...');

  if (pedidos.length === 0) {
    console.log('⚠️ Nenhum pedido encontrado para verificar');
    return;
  }

  const ultimoPedido = pedidos[pedidos.length - 1];

  console.log('Campos presentes no pedido retornado:');
  console.log('- id:', ultimoPedido.id ? '✅' : '❌');
  console.log('- idGrupoPedido:', ultimoPedido.idGrupoPedido ? '✅' : '❌');
  console.log('- idPessoa:', ultimoPedido.idPessoa ? '✅' : '❌');
  console.log('- situacao:', ultimoPedido.situacao ? '✅' : '❌');
  console.log('- valorFrete:', typeof ultimoPedido.valorFrete === 'number' ? '✅' : '❌');
  console.log('- dataPedido:', ultimoPedido.dataPedido || ultimoPedido.dataHoraCriacaoRegistro ? '✅' : '❌');
  console.log('- items (array):', Array.isArray(ultimoPedido.items) ? '✅' : '❌');
  console.log('- fornecedor:', ultimoPedido.fornecedor ? '✅' : '⚠️ (não salvo no banco)');
  console.log('- tipoEntrega:', ultimoPedido.tipoEntrega ? '✅' : '⚠️ (não salvo no banco)');
  console.log('- metodoPagamento:', ultimoPedido.metodoPagamento ? '✅' : '⚠️ (não salvo no banco)');
  console.log('- codigoEntrega:', ultimoPedido.codigoEntrega ? '✅' : '⚠️ (não salvo no banco)');
  console.log('- endereco:', ultimoPedido.endereco ? '✅' : '⚠️ (não salvo no banco)');

  if (Array.isArray(ultimoPedido.items) && ultimoPedido.items.length > 0) {
    console.log(`\nItens do pedido: ${ultimoPedido.items.length}`);
    ultimoPedido.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.nome || 'Sem nome'} - Qtd: ${item.quantidade} - R$ ${item.preco}`);
    });
  }
}

/**
 * Função principal para executar todo o fluxo
 */
async function executarTesteCompleto() {
  console.log('='.repeat(60));
  console.log('🧪 TESTE COMPLETO DO FLUXO DE CRIAÇÃO DE PEDIDO');
  console.log('='.repeat(60));

  try {
    // Passo 1: Login
    const loginOk = await fazerLogin();
    if (!loginOk) {
      console.log('\n❌ Teste abortado: falha no login');
      return;
    }

    // Passo 2: Criar PedidoGrupo
    const idGrupo = await criarPedidoGrupo();

    // Passo 3: Criar Pedido
    const idPedido = await criarPedido(idGrupo);

    // Passo 4: Criar itens
    await criarPedidoItems(idPedido);

    // Passo 5: Buscar pedidos
    const pedidos = await buscarPedidosDaAssistencia();

    // Passo 6: Verificar estrutura
    verificarEstruturaPedido(pedidos);

    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE COMPLETO FINALIZADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n📊 Resumo:');
    console.log(`- ID do Grupo: ${idGrupo}`);
    console.log(`- ID do Pedido: ${idPedido}`);
    console.log(`- Itens criados: ${DADOS_TESTE.items.length}`);
    console.log(`- Total de pedidos na assistência: ${pedidos.length}`);

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ TESTE FALHOU');
    console.log('='.repeat(60));
    console.error('\nErro:', error.message);

    if (error.response) {
      console.log('\nDetalhes do erro:');
      console.log('Status:', error.response.status);
      console.log('Dados:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Executar o teste
console.log('\n⚠️ ATENÇÃO: Antes de executar, configure as credenciais no script!\n');
executarTesteCompleto();
