import React, { useState } from 'react';
import { createPedido, getPedidosDaAssistencia, getPedidoPorId } from '../../api/pedidosServices';

function TestePedido() {
  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);

  const criarPedidoTeste = async () => {
    setLoading(true);
    setResultado('');

    try {
      const idPessoa = parseInt(localStorage.getItem('idPessoa'));
      const token = localStorage.getItem('token');

      console.log('🔍 INICIANDO TESTE DE PEDIDO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📌 ID Pessoa logado:', idPessoa);
      console.log('🔑 Token:', token ? 'Presente' : 'AUSENTE');

      // 1. Buscar pedidos ANTES de criar
      const pedidosAntes = await getPedidosDaAssistencia(idPessoa);
      console.log('\n📋 ANTES: Total de pedidos:', pedidosAntes.length);
      console.log('   IDs:', pedidosAntes.map(p => p.id).join(', '));

      // 2. Criar pedido de teste
      const timestamp = Date.now();
      const pedidoTeste = {
        assistenciaTecnicaId: idPessoa,
        fornecedor: 'WEFIX',
        tipoEntrega: 'Normal',
        metodoPagamento: 'Pix',
        items: [
          {
            produtoId: 1,
            nome: `Produto Teste ${timestamp}`,
            quantidade: 1,
            preco: 99.90
          }
        ],
        endereco: {
          cep: '01310-100',
          logradouro: 'Avenida Paulista',
          numero: '1000',
          complemento: 'Teste',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        valorFrete: 15.00,
        valorProdutos: 99.90,
        totalPago: 114.90
      };

      console.log('\n📤 CRIANDO PEDIDO...');
      console.log('   assistenciaTecnicaId:', pedidoTeste.assistenciaTecnicaId);
      console.log('   fornecedor:', pedidoTeste.fornecedor);
      console.log('   total:', pedidoTeste.totalPago);

      const pedidoCriado = await createPedido(pedidoTeste);

      console.log('\n✅ PEDIDO CRIADO COM SUCESSO!');
      console.log('   ID:', pedidoCriado.id);
      console.log('   Código:', pedidoCriado.codigo || pedidoCriado.codigoEntrega);
      console.log('   Status:', pedidoCriado.status);
      console.log('   Data:', pedidoCriado.dataPedido || pedidoCriado.dataHoraCriacaoRegistro);

      // 3. Aguardar 1 segundo (garantir persistência)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Buscar o pedido específico por ID
      console.log('\n🔍 BUSCANDO PEDIDO CRIADO...');
      const pedidoBuscado = await getPedidoPorId(pedidoCriado.id);
      console.log('   Pedido encontrado:', pedidoBuscado.id);
      console.log('   assistenciaTecnicaId:', pedidoBuscado.assistenciaTecnicaId);

      // 5. Buscar TODOS os pedidos DEPOIS de criar
      const pedidosDepois = await getPedidosDaAssistencia(idPessoa);
      console.log('\n📋 DEPOIS: Total de pedidos:', pedidosDepois.length);
      console.log('   IDs:', pedidosDepois.map(p => p.id).join(', '));

      // 6. Verificar se o novo pedido está na lista
      const pedidoNaLista = pedidosDepois.find(p => p.id === pedidoCriado.id);

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 RESULTADO DO TESTE:');
      console.log('   Pedidos antes:', pedidosAntes.length);
      console.log('   Pedidos depois:', pedidosDepois.length);
      console.log('   Diferença:', pedidosDepois.length - pedidosAntes.length);
      console.log('   Pedido na lista?', pedidoNaLista ? '✅ SIM' : '❌ NÃO');

      if (!pedidoNaLista) {
        console.log('');
        console.log('⚠️ PROBLEMA DETECTADO!');
        console.log('   O pedido foi criado mas NÃO aparece na lista!');
        console.log('   Possíveis causas:');
        console.log('   - Backend filtra por empresa/estabelecimento');
        console.log('   - assistenciaTecnicaId não corresponde ao idPessoa');
        console.log('   - Pedido foi criado mas com status que não retorna na API');
      }

      // Resultado para UI
      setResultado(`
✅ Teste Concluído!

Pedido criado: #${pedidoCriado.id}
Pedidos antes: ${pedidosAntes.length}
Pedidos depois: ${pedidosDepois.length}
${pedidoNaLista ? '✅ Pedido aparece na lista!' : '❌ Pedido NÃO aparece na lista'}

${!pedidoNaLista ? `
⚠️ ATENÇÃO: O pedido foi criado mas não aparece!
Verifique o Console (F12) para mais detalhes.
` : ''}

Agora clique no botão "Atualizar" no dashboard!
      `.trim());

    } catch (error) {
      console.error('❌ ERRO NO TESTE:', error);
      setResultado(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        🧪 Teste de Criação de Pedido
      </h1>

      <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
        Este teste vai:
        <br/>
        1. Verificar quantos pedidos você tem ANTES
        <br/>
        2. Criar um pedido de teste
        <br/>
        3. Verificar quantos pedidos você tem DEPOIS
        <br/>
        4. Confirmar se o pedido aparece na lista
        <br/>
        <br/>
        ⚠️ <strong>Abra o Console (F12)</strong> para ver logs detalhados!
      </p>

      <button
        onClick={criarPedidoTeste}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#6b7280' : '#ff6400',
          color: 'white',
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          width: '100%'
        }}
      >
        {loading ? '🔄 Criando pedido...' : '🚀 Criar Pedido de Teste'}
      </button>

      {resultado && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          border: '2px solid #e5e7eb',
          marginTop: '20px'
        }}>
          {resultado}
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '2px solid #fbbf24'
      }}>
        <strong>💡 Dica:</strong> Após criar o pedido, vá para o Dashboard e clique no botão "Atualizar" para ver o pedido aparecer!
      </div>
    </div>
  );
}

export default TestePedido;
