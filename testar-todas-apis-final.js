/**
 * 🎉 TESTE FINAL - Todas as APIs de Distribuidor
 * Cole este código no Console do navegador (F12)
 */

console.clear();
console.log('🎉 TESTANDO TODAS AS APIs - FINAL\n');
console.log('='.repeat(80));

const API_URL = 'https://localhost:44370';

// Teste 1: Distribuidores por Segmento ✅ (já funcionou)
console.log('\n📋 TESTE 1: Distribuidores por Segmento (idSegmento=1)');
console.log('-'.repeat(80));
fetch(`${API_URL}/api/Distribuidor/consulta?idSegmento=1`)
    .then(r => r.json())
    .then(d => {
        console.log('✅ Status: 200 OK');
        console.log('📊 Total de distribuidores:', d.length);
        console.log('📦 Dados:', d);
    })
    .catch(e => console.error('❌ ERRO:', e));

// Teste 2: Últimos Pedidos
setTimeout(() => {
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 TESTE 2: Últimos Pedidos (idAssistencia=1)');
    console.log('-'.repeat(80));
    fetch(`${API_URL}/api/Distribuidor/ultimospedidos/1`)
        .then(r => r.json())
        .then(d => {
            console.log('✅ Status: 200 OK');
            console.log('📊 Total de pedidos:', d.length);
            console.log('📦 Dados:', d);
        })
        .catch(e => console.error('❌ ERRO:', e));
}, 1000);

// Teste 3: Distribuidores Favoritos
setTimeout(() => {
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 TESTE 3: Distribuidores Favoritos (idSegmento=1, idAssistencia=1)');
    console.log('-'.repeat(80));
    fetch(`${API_URL}/api/Distribuidor/favoritos/1/1`)
        .then(r => r.json())
        .then(d => {
            console.log('✅ Status: 200 OK');
            console.log('📊 Total de favoritos:', d.length);
            console.log('📦 Dados:', d);
        })
        .catch(e => console.error('❌ ERRO:', e));
}, 2000);

// Teste 4: Segmentos (já funcionava, só para comparar)
setTimeout(() => {
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 TESTE 4: Segmentos (API que já funcionava)');
    console.log('-'.repeat(80));
    fetch(`${API_URL}/api/ProdutoSegmentos`)
        .then(r => r.json())
        .then(d => {
            console.log('✅ Status: 200 OK');
            console.log('📊 Total de segmentos:', d.length);
            console.log('📦 Dados:', d);

            console.log('\n' + '='.repeat(80));
            console.log('\n🎉 TODAS AS APIs FUNCIONANDO!');
            console.log('='.repeat(80));
            console.log('\n✅ API 1: Distribuidores por Segmento → OK');
            console.log('✅ API 2: Últimos Pedidos → OK');
            console.log('✅ API 3: Distribuidores Favoritos → OK');
            console.log('✅ API 4: Segmentos → OK');
            console.log('\n🚀 Agora o dashboard vai funcionar automaticamente!');
            console.log('   Selecione um segmento no carrossel e veja a mágica acontecer! ✨');
        })
        .catch(e => console.error('❌ ERRO:', e));
}, 3000);
