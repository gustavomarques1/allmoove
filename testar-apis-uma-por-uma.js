/**
 * 🧪 TESTE DAS APIs - UMA POR UMA
 * Cole este código no Console do navegador (F12)
 */

const API_URL = 'https://localhost:44370';
const token = localStorage.getItem('token');

console.clear();
console.log('🧪 TESTANDO APIs UMA POR UMA\n');
console.log('Token:', token ? 'EXISTE ✅' : 'NÃO EXISTE ❌');
console.log('='.repeat(80));

// Função auxiliar para testar
async function testarAPI(nome, url) {
    console.log(`\n📋 ${nome}`);
    console.log('URL:', url);
    console.log('-'.repeat(80));

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ SUCESSO!');
            console.log('Dados:', data);
            console.log('Total:', Array.isArray(data) ? data.length : 'N/A');
            return { success: true, data };
        } else {
            const errorText = await response.text();
            console.log('❌ ERRO:', response.status);
            console.log('Resposta:', errorText || 'Sem mensagem de erro');
            return { success: false, status: response.status, error: errorText };
        }
    } catch (error) {
        console.error('❌ ERRO DE CONEXÃO:', error.message);
        return { success: false, error: error.message };
    }
}

// Executar testes
(async function() {
    // TESTE 1: API de Segmentos (já funciona)
    await testarAPI(
        'TESTE 1: Segmentos (API que JÁ funciona)',
        `${API_URL}/api/ProdutoSegmentos`
    );

    console.log('\n' + '='.repeat(80));

    // TESTE 2: Distribuidores por Segmento
    await testarAPI(
        'TESTE 2: Distribuidores por Segmento (idSegmento=1)',
        `${API_URL}/api/Distribuidor/consulta?idSegmento=1`
    );

    console.log('\n' + '='.repeat(80));

    // TESTE 3: Últimos Pedidos
    await testarAPI(
        'TESTE 3: Últimos Pedidos (idAssistencia=1)',
        `${API_URL}/api/Distribuidor/ultimospedidos/1`
    );

    console.log('\n' + '='.repeat(80));

    // TESTE 4: Distribuidores Favoritos
    await testarAPI(
        'TESTE 4: Distribuidores Favoritos (idSegmento=1, idAssistencia=1)',
        `${API_URL}/api/Distribuidor/favoritos/1/1`
    );

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 ANÁLISE:');
    console.log('Se TESTE 1 deu 200 mas TESTE 2, 3, 4 deram 401:');
    console.log('  → O problema é específico do DistribuidorController');
    console.log('  → Pode ser autorização diferente ou Service não injetado');
    console.log('\nSe TODOS deram 401:');
    console.log('  → Token pode estar inválido ou backend não reconhece');
    console.log('\nSe deu erro de CORS:');
    console.log('  → Backend não está configurado para aceitar requisições do frontend');
})();
