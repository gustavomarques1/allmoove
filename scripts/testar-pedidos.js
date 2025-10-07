/**
 * Script de teste para criar pedidos e verificar se aparecem no dashboard
 *
 * Uso:
 * node scripts/testar-pedidos.js
 */

import axios from 'axios';

const API_BASE = 'https://localhost:44370';

// Configuração para aceitar certificados self-signed (apenas desenvolvimento)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Dados de teste (ajuste conforme seu usuário)
const TOKEN = 'seu_token_aqui'; // Cole o token do localStorage
const ID_PESSOA = 4; // ID da assistência técnica

async function listarPedidosAtuais() {
  console.log('\n📋 Listando pedidos atuais...\n');

  try {
    const response = await axios.get(`${API_BASE}/api/Pedidos/assistencia/${ID_PESSOA}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    console.log(`✅ Total de pedidos: ${response.data.length}`);
    response.data.forEach((p, i) => {
      console.log(`   ${i + 1}. Pedido #${p.id} - ${p.status} - R$ ${p.totalPago?.toFixed(2) || '0.00'}`);
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error.response?.data || error.message);
    return [];
  }
}

async function criarPedidoTeste(numero) {
  console.log(`\n📤 Criando pedido de teste #${numero}...\n`);

  const fornecedores = ['WEFIX', 'TechParts SP', 'MobileFix', 'PartsDirect'];
  const fornecedor = fornecedores[numero % fornecedores.length];

  const pedidoTeste = {
    assistenciaTecnicaId: ID_PESSOA,
    fornecedor: fornecedor,
    tipoEntrega: numero % 2 === 0 ? 'Normal' : 'Urgente',
    metodoPagamento: numero % 2 === 0 ? 'Pix' : 'Cartão de Crédito',
    items: [
      {
        produtoId: 1,
        nome: `Produto Teste ${numero}`,
        quantidade: 1,
        preco: 100.00 + (numero * 10)
      }
    ],
    endereco: {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      numero: `${1000 + numero}`,
      complemento: `Apto ${numero}`,
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    valorFrete: 15.00,
    valorProdutos: 100.00 + (numero * 10),
    totalPago: 115.00 + (numero * 10)
  };

  try {
    const response = await axios.post(`${API_BASE}/api/Pedidos`, pedidoTeste, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Pedido #${response.data.id} criado com sucesso!`);
    console.log(`   Fornecedor: ${fornecedor}`);
    console.log(`   Total: R$ ${pedidoTeste.totalPago.toFixed(2)}`);
    console.log(`   Tipo: ${pedidoTeste.tipoEntrega}`);

    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao criar pedido #${numero}:`, error.response?.data || error.message);
    return null;
  }
}

async function aceitarPedido(pedidoId) {
  console.log(`\n✋ Aceitando pedido #${pedidoId}...\n`);

  try {
    const response = await axios.put(
      `${API_BASE}/api/Pedidos/${pedidoId}/status`,
      {
        novoStatus: 'Aceito',
        observacao: 'Pedido aceito via script de teste'
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Pedido #${pedidoId} aceito com sucesso!`);
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao aceitar pedido #${pedidoId}:`, error.response?.data || error.message);
    return null;
  }
}

async function executarTeste() {
  console.log('🚀 Iniciando teste de API de Pedidos...\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Listar pedidos antes
  console.log('📍 PASSO 1: Estado inicial');
  const pedidosAntes = await listarPedidosAtuais();

  // 2. Criar 3 novos pedidos
  console.log('\n📍 PASSO 2: Criando 3 novos pedidos');
  const novoPedido1 = await criarPedidoTeste(1);
  await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda 0.5s

  const novoPedido2 = await criarPedidoTeste(2);
  await new Promise(resolve => setTimeout(resolve, 500));

  const novoPedido3 = await criarPedidoTeste(3);
  await new Promise(resolve => setTimeout(resolve, 500));

  // 3. Listar pedidos depois
  console.log('\n📍 PASSO 3: Verificando novos pedidos');
  const pedidosDepois = await listarPedidosAtuais();

  // 4. Aceitar o primeiro pedido criado
  if (novoPedido1) {
    console.log('\n📍 PASSO 4: Aceitando primeiro pedido');
    await aceitarPedido(novoPedido1.id);
  }

  // 5. Listar novamente para ver mudança de status
  console.log('\n📍 PASSO 5: Verificando status atualizado');
  await listarPedidosAtuais();

  // Resumo
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n📊 RESUMO DO TESTE:\n');
  console.log(`   Pedidos antes: ${pedidosAntes.length}`);
  console.log(`   Pedidos depois: ${pedidosDepois.length}`);
  console.log(`   Pedidos criados: ${pedidosDepois.length - pedidosAntes.length}`);
  console.log(`   Pedidos aceitos: ${novoPedido1 ? 1 : 0}`);
  console.log('\n✅ Teste concluído!');
  console.log('\n💡 Agora recarregue o dashboard (F5) para ver as mudanças!\n');
}

// Verificar se token foi fornecido
if (TOKEN === 'seu_token_aqui') {
  console.error('❌ ERRO: Configure o TOKEN no início do script!');
  console.log('\n📝 Passos:');
  console.log('   1. Abra o DevTools (F12) no navegador');
  console.log('   2. Vá na aba Console');
  console.log('   3. Digite: localStorage.getItem("token")');
  console.log('   4. Copie o valor e cole na variável TOKEN deste script\n');
  process.exit(1);
}

executarTeste().catch(console.error);
