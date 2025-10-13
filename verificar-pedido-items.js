// Script para verificar se há items nos pedidos
const API_BASE = 'https://localhost:44370';

async function verificarPedidoItems() {
  console.log('\n=== VERIFICAÇÃO: Items dos Pedidos ===\n');

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Token não encontrado. Faça login primeiro.');
      return;
    }

    // 1. Buscar pedidos da assistência
    console.log('1️⃣ Buscando pedidos da assistência 1...');
    const pedidosResponse = await fetch(`${API_BASE}/api/Pedidos/assistencia/1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!pedidosResponse.ok) {
      throw new Error(`Erro ao buscar pedidos: ${pedidosResponse.status}`);
    }

    const pedidos = await pedidosResponse.json();
    console.log(`✅ ${pedidos.length} pedidos encontrados\n`);

    if (pedidos.length === 0) {
      console.log('⚠️ Nenhum pedido encontrado para esta assistência.');
      return;
    }

    // 2. Para cada pedido, buscar items
    console.log('2️⃣ Verificando items de cada pedido:\n');

    for (const pedido of pedidos.slice(0, 5)) { // Verifica os 5 primeiros
      console.log(`📦 Pedido #${pedido.codigo || pedido.id}:`);
      console.log(`   - ID: ${pedido.id}`);
      console.log(`   - Data: ${pedido.dataHoraCriacaoRegistro}`);
      console.log(`   - Status: ${pedido.situacao}`);

      try {
        const itemsResponse = await fetch(`${API_BASE}/api/PedidoItems/pedido/${pedido.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (itemsResponse.ok) {
          const items = await itemsResponse.json();

          if (items.length > 0) {
            console.log(`   ✅ ${items.length} item(s) encontrado(s):`);
            items.forEach((item, index) => {
              console.log(`      ${index + 1}. ${item.nome || 'Sem nome'} (ID: ${item.id})`);
              console.log(`         - Quantidade: ${item.quantidade}`);
              console.log(`         - Preço: R$ ${item.precoUnitario}`);
              console.log(`         - ID Produto: ${item.idProduto}`);
            });
          } else {
            console.log('   ⚠️ Nenhum item encontrado neste pedido');
          }
        } else {
          console.log(`   ❌ Erro ao buscar items: ${itemsResponse.status}`);
        }
      } catch (itemError) {
        console.log(`   ❌ Erro: ${itemError.message}`);
      }

      console.log('');
    }

    // 3. Verificar total de items
    console.log('3️⃣ Buscando TODOS os items (sem filtro):\n');

    try {
      const allItemsResponse = await fetch(`${API_BASE}/api/PedidoItems`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (allItemsResponse.ok) {
        const allItems = await allItemsResponse.json();
        console.log(`✅ Total de ${allItems.length} items na base de dados`);

        if (allItems.length > 0) {
          console.log('\n📋 Primeiros 5 items:');
          allItems.slice(0, 5).forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.nome || 'Sem nome'} (Pedido ID: ${item.idPedido})`);
          });
        }
      }
    } catch (error) {
      console.error('❌ Erro ao buscar todos os items:', error);
    }

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
  }
}

// Executar verificação
verificarPedidoItems();
