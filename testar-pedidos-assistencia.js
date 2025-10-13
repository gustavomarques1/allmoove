// Script para testar a API de pedidos da assistência
const API_BASE = 'https://localhost:44370';

// Substitua por um token real do localStorage ou teste sem autenticação
const token = null; // Coloque seu token JWT aqui se necessário

async function testarPedidosAssistencia() {
  console.log('\n=== TESTE: API de Pedidos da Assistência ===\n');

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Teste com ID de assistência = 1
    const idAssistencia = 1;
    const url = `${API_BASE}/api/Pedidos/assistencia/${idAssistencia}`;

    console.log(`📡 Buscando: ${url}`);
    console.log(`🔐 Token: ${token ? 'PRESENTE' : 'NÃO ENVIADO'}\n`);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    console.log(`📊 Status HTTP: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro na resposta:`, errorText);
      return;
    }

    const data = await response.json();

    console.log(`✅ Total de pedidos: ${data.length}\n`);
    console.log('📦 Estrutura dos dados:\n');
    console.log(JSON.stringify(data, null, 2));

    // Análise dos pedidos
    if (data.length > 0) {
      console.log('\n=== ANÁLISE DOS PEDIDOS ===\n');

      data.forEach((pedido, index) => {
        console.log(`\nPedido ${index + 1}:`);
        console.log(`  ID: ${pedido.id || 'N/A'}`);
        console.log(`  Fornecedor: ${pedido.fornecedor || 'N/A'}`);
        console.log(`  Status: ${pedido.status || 'N/A'}`);
        console.log(`  Data: ${pedido.dataPedido || pedido.createdAt || 'N/A'}`);

        if (pedido.items && Array.isArray(pedido.items)) {
          console.log(`  Items (${pedido.items.length}):`);
          pedido.items.forEach((item, i) => {
            console.log(`    ${i + 1}. ${item.nome || 'Sem nome'} (ID Segmento: ${item.idSegmento || 'N/A'})`);
          });
        } else {
          console.log(`  Items: NÃO ENCONTRADO ou não é array`);
        }
      });

      // Verificar campos disponíveis
      console.log('\n=== CAMPOS DISPONÍVEIS NO PRIMEIRO PEDIDO ===\n');
      const primeiroPedido = data[0];
      console.log(Object.keys(primeiroPedido).join(', '));
    } else {
      console.log('\n⚠️ NENHUM PEDIDO ENCONTRADO NA API');
      console.log('\nPossíveis causas:');
      console.log('1. A assistência com ID=1 ainda não fez nenhum pedido');
      console.log('2. A API requer autenticação (token JWT)');
      console.log('3. A API está retornando pedidos de outra assistência');
    }

  } catch (error) {
    console.error('\n❌ ERRO AO EXECUTAR TESTE:', error.message);
    console.error('\nDetalhes:', error);
  }
}

// Executar teste
testarPedidosAssistencia();
