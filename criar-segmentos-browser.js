/**
 * 🚀 Script para Criar Segmentos Específicos - Executa no Console do Navegador
 *
 * COMO USAR:
 * 1. Faça login na aplicação (http://localhost:5174)
 * 2. Abra o Console (F12 → Console)
 * 3. Copie e cole TODO este arquivo no console
 */

(async function criarSegmentos() {
    console.clear();
    console.log('🚀 Criando Segmentos Específicos de Produtos\n');

    // ========================================
    // VERIFICAÇÕES
    // ========================================
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado! Faça login primeiro.');
        return;
    }

    console.log(`🔐 Token encontrado: ${token.substring(0, 20)}...`);

    const API_URL = 'https://localhost:44370';

    // Segmentos que queremos criar
    const novosSegmentos = [
        { nome: 'TELAS', descricao: 'Telas, LCD, OLED, AMOLED para dispositivos' },
        { nome: 'BATERIAS', descricao: 'Baterias para smartphones e tablets' },
        { nome: 'CAMERAS', descricao: 'Câmeras frontais e traseiras' },
        { nome: 'CONECTORES', descricao: 'Conectores, placas e flexíveis' },
        { nome: 'CELULARES_COMPLETOS', descricao: 'Smartphones completos' },
        { nome: 'ACESSORIOS', descricao: 'Acessórios diversos para celulares' },
        { nome: 'NOTEBOOKS', descricao: 'Notebooks e peças' },
        { nome: 'AUDIO', descricao: 'Fones, alto-falantes e componentes de áudio' },
    ];

    // ========================================
    // 1. LISTAR SEGMENTOS EXISTENTES
    // ========================================
    console.log('\n📋 Segmentos existentes:');
    try {
        const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const segmentos = await response.json();
            console.log(`Total: ${segmentos.length} segmentos`);
            segmentos.forEach(seg => {
                console.log(`  [${seg.id}] ${seg.nome}`);
            });
        }
    } catch (error) {
        console.error('❌ Erro ao listar segmentos:', error);
    }

    // ========================================
    // 2. CRIAR NOVOS SEGMENTOS
    // ========================================
    console.log('\n📦 Criando novos segmentos...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    const segmentosCriados = [];

    for (let i = 0; i < novosSegmentos.length; i++) {
        const segmento = novosSegmentos[i];

        try {
            const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: segmento.nome,
                    descricao: segmento.descricao,
                    situacao: 'ATIVO'
                })
            });

            if (response.ok) {
                successCount++;
                const resultado = await response.json();
                segmentosCriados.push({ id: resultado.id, ...segmento });
                console.log(`✅ [${i + 1}/${novosSegmentos.length}] ${segmento.nome} - ID: ${resultado.id}`);
            } else {
                errorCount++;
                const errorText = await response.text();
                console.error(`❌ [${i + 1}/${novosSegmentos.length}] ${segmento.nome} - ${response.status}`);

                if (errors.length < 5) {
                    errors.push({
                        segmento: segmento.nome,
                        status: response.status,
                        error: errorText.substring(0, 50)
                    });
                }
            }
        } catch (error) {
            errorCount++;
            console.error(`❌ [${i + 1}/${novosSegmentos.length}] ${segmento.nome} - ${error.message}`);

            if (errors.length < 5) {
                errors.push({
                    segmento: segmento.nome,
                    error: error.message
                });
            }
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // ========================================
    // 3. LISTAR TODOS OS SEGMENTOS APÓS CRIAÇÃO
    // ========================================
    console.log('\n📊 Todos os segmentos após criação:');
    try {
        const response = await fetch(`${API_URL}/api/ProdutoSegmentos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const segmentos = await response.json();
            console.log(`\nTotal: ${segmentos.length} segmentos`);
            console.table(segmentos.map(s => ({
                ID: s.id,
                Nome: s.nome,
                Descrição: s.descricao?.substring(0, 50) || '-'
            })));
        }
    } catch (error) {
        console.error('❌ Erro ao listar segmentos:', error);
    }

    // ========================================
    // 4. RESUMO
    // ========================================
    console.log('\n========================================');
    console.log('🏁 CRIAÇÃO DE SEGMENTOS CONCLUÍDA!');
    console.log('========================================');
    console.log(`✅ Sucesso: ${successCount} segmentos`);
    console.log(`❌ Erros: ${errorCount} segmentos`);

    if (errors.length > 0) {
        console.log('\n📋 Erros encontrados:');
        console.table(errors);
    }

    if (successCount > 0) {
        console.log('\n✨ Segmentos criados com sucesso!');
        console.log('💡 Próximo passo: Execute o script de atualização de produtos');
        console.log('   para categorizar os produtos nos novos segmentos.');

        // Salvar IDs dos segmentos criados para uso posterior
        window.segmentosCriados = segmentosCriados;
        console.log('\n📝 IDs salvos em: window.segmentosCriados');
    }
})();
