/**
 * 🧪 TESTE DAS APIs DE DISTRIBUIDOR
 *
 * Este script testa se as APIs de distribuidor estão acessíveis
 * e retornando dados corretamente
 */

(async function testarAPIsDistribuidor() {
    console.clear();
    console.log('🧪 TESTANDO APIs DE DISTRIBUIDOR\n');
    console.log('='.repeat(60));

    const API_URL = 'https://localhost:44370';
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('❌ Token não encontrado! Faça login primeiro.');
        return;
    }

    console.log('✅ Token encontrado\n');

    // Teste 1: API de Distribuidores por Segmento
    console.log('📋 TESTE 1: /api/Distribuidor/consulta?idSegmento=1');
    console.log('-'.repeat(60));
    try {
        const response1 = await fetch(`${API_URL}/api/Distribuidor/consulta?idSegmento=1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${response1.status} ${response1.statusText}`);

        if (response1.ok) {
            const data = await response1.json();
            console.log('✅ SUCESSO!');
            console.log('📦 Dados recebidos:', data);
            console.log('📊 Total de distribuidores:', Array.isArray(data) ? data.length : 'N/A');
        } else {
            const errorText = await response1.text();
            console.log('❌ ERRO:', response1.status);
            console.log('📄 Resposta:', errorText);
        }
    } catch (error) {
        console.error('❌ ERRO DE CONEXÃO:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Teste 2: API de Últimos Pedidos
    console.log('📋 TESTE 2: /api/Distribuidor/ultimospedidos/1');
    console.log('-'.repeat(60));
    try {
        const response2 = await fetch(`${API_URL}/api/Distribuidor/ultimospedidos/1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${response2.status} ${response2.statusText}`);

        if (response2.ok) {
            const data = await response2.json();
            console.log('✅ SUCESSO!');
            console.log('📦 Dados recebidos:', data);
            console.log('📊 Total de pedidos:', Array.isArray(data) ? data.length : 'N/A');
        } else {
            const errorText = await response2.text();
            console.log('❌ ERRO:', response2.status);
            console.log('📄 Resposta:', errorText);
        }
    } catch (error) {
        console.error('❌ ERRO DE CONEXÃO:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Teste 3: API de Distribuidores Favoritos
    console.log('📋 TESTE 3: /api/Distribuidor/favoritos/1/1');
    console.log('-'.repeat(60));
    try {
        const response3 = await fetch(`${API_URL}/api/Distribuidor/favoritos/1/1`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${response3.status} ${response3.statusText}`);

        if (response3.ok) {
            const data = await response3.json();
            console.log('✅ SUCESSO!');
            console.log('📦 Dados recebidos:', data);
            console.log('📊 Total de favoritos:', Array.isArray(data) ? data.length : 'N/A');
        } else {
            const errorText = await response3.text();
            console.log('❌ ERRO:', response3.status);
            console.log('📄 Resposta:', errorText);
        }
    } catch (error) {
        console.error('❌ ERRO DE CONEXÃO:', error.message);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Teste de Comparação: API que funciona (/api/Produtos)
    console.log('📋 TESTE 4 (COMPARAÇÃO): /api/Produtos (API que funciona)');
    console.log('-'.repeat(60));
    try {
        const response4 = await fetch(`${API_URL}/api/Produtos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Status: ${response4.status} ${response4.statusText}`);

        if (response4.ok) {
            const data = await response4.json();
            console.log('✅ SUCESSO!');
            console.log('📊 Total de produtos:', data.length);
        } else {
            console.log('❌ ERRO:', response4.status);
        }
    } catch (error) {
        console.error('❌ ERRO DE CONEXÃO:', error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 RESUMO DOS TESTES:');
    console.log('\n1️⃣ Se TODOS retornaram 401:');
    console.log('   → As rotas de /api/Distribuidor/* podem não estar configuradas no backend');
    console.log('   → Ou requerem permissões especiais de role (ex: apenas DISTRIBUIDOR)');
    console.log('\n2️⃣ Se retornaram 404:');
    console.log('   → As rotas não existem no backend ainda');
    console.log('\n3️⃣ Se /api/Produtos funciona mas /api/Distribuidor não:');
    console.log('   → Problema de autorização específico dessas rotas');
    console.log('\n💡 PRÓXIMO PASSO:');
    console.log('   → Verificar no backend se essas rotas estão implementadas');
    console.log('   → Verificar se requerem role específica (ex: [Authorize(Roles = "DISTRIBUIDOR")])');
    console.log('   → Adicionar essas rotas ao Startup.cs se necessário');
})();
