/**
 * Script para verificar distribuição de produtos por segmento
 */

const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

async function verificarSegmentos() {
  console.log('🔍 Verificando distribuição de produtos por segmento...\n');

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://localhost:44370/api/Produtos', { agent });

    if (!response.ok) {
      console.error('❌ Erro ao buscar produtos:', response.status);
      return;
    }

    const produtos = await response.json();

    // Contar por segmento
    const segmentos = {};
    produtos.forEach(p => {
      segmentos[p.idSegmento] = (segmentos[p.idSegmento] || 0) + 1;
    });

    console.log('📊 Distribuição de produtos por segmento:');
    Object.entries(segmentos).sort((a, b) => a[0] - b[0]).forEach(([id, count]) => {
      console.log(`  Segmento ${id}: ${count} produtos`);
    });

    console.log(`\n📦 Total: ${produtos.length} produtos`);

    // Mostrar exemplos de cada segmento
    console.log('\n📋 Exemplos de produtos por segmento:');
    Object.keys(segmentos).sort().forEach(segId => {
      const exemplo = produtos.find(p => p.idSegmento == segId);
      if (exemplo) {
        console.log(`  Segmento ${segId}: "${exemplo.nome?.substring(0, 50)}..."`);
      }
    });

    // Testar filtro
    console.log('\n🧪 Testando filtro por categoria=1:');
    const filtroResponse = await fetch('https://localhost:44370/api/Produtos?categoria=1', { agent });
    const produtosFiltrados = await filtroResponse.json();
    console.log(`  Resultado: ${produtosFiltrados.length} produtos`);

    console.log('\n🧪 Testando filtro por idSegmento=1:');
    const filtroResponse2 = await fetch('https://localhost:44370/api/Produtos?idSegmento=1', { agent });
    const produtosFiltrados2 = await filtroResponse2.json();
    console.log(`  Resultado: ${produtosFiltrados2.length} produtos`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarSegmentos();
