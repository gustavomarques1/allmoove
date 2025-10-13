/**
 * 🔍 Script para VERIFICAR e CORRIGIR Imagens
 * Execute no console do navegador após login
 */

(async function verificarECorrigirImagens() {
    console.clear();
    console.log('🔍 VERIFICANDO PRODUTOS E IMAGENS\n');
    console.log('='.repeat(50));

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado! Faça login primeiro.');
        return;
    }

    const API_URL = 'https://localhost:44370';

    // ========================================
    // 1. BUSCAR E ANALISAR PRODUTOS
    // ========================================
    console.log('\n📊 PASSO 1: Buscando e analisando produtos...\n');

    let produtos = [];
    try {
        const response = await fetch(`${API_URL}/api/Produtos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error('❌ Erro ao buscar produtos:', response.status);
            return;
        }

        produtos = await response.json();
    } catch (error) {
        console.error('❌ Erro:', error);
        return;
    }

    console.log(`✅ Total de produtos: ${produtos.length}`);

    // Análise dos produtos
    const comImagem = produtos.filter(p => p.imagem && p.imagem.trim() !== '');
    const semImagem = produtos.filter(p => !p.imagem || p.imagem.trim() === '');

    console.log(`🎨 Produtos COM imagem: ${comImagem.length}`);
    console.log(`⚠️  Produtos SEM imagem: ${semImagem.length}`);

    // Mostrar exemplos
    if (comImagem.length > 0) {
        console.log('\n📋 Exemplos de produtos COM imagem:');
        console.table(comImagem.slice(0, 3).map(p => ({
            ID: p.id,
            Nome: p.nome?.substring(0, 30),
            Imagem: p.imagem,
            Segmento: p.idSegmento
        })));
    }

    if (semImagem.length > 0) {
        console.log('\n📋 Exemplos de produtos SEM imagem:');
        console.table(semImagem.slice(0, 3).map(p => ({
            ID: p.id,
            Nome: p.nome?.substring(0, 30),
            Imagem: p.imagem || 'VAZIO',
            Segmento: p.idSegmento
        })));
    }

    // ========================================
    // 2. PERGUNTAR SE QUER ADICIONAR IMAGENS
    // ========================================
    if (semImagem.length === 0) {
        console.log('\n✅ TODOS os produtos já têm imagens!');
        console.log('💡 Se as imagens não aparecem, verifique:');
        console.log('   1. Se os arquivos existem em public/images/');
        console.log('   2. Se o caminho está correto');
        console.log('   3. Se o ProductCard está usando o campo "imagem"');
        return;
    }

    console.log('\n' + '='.repeat(50));
    console.log(`⚠️  Encontrados ${semImagem.length} produtos SEM imagem`);
    console.log('='.repeat(50));

    console.log('\n💬 Deseja adicionar imagens automaticamente?');
    console.log('   Digite no console: adicionarImagens()');
    console.log('\n💡 Ou para ver apenas os produtos: produtos');

    // Disponibilizar funções globais
    window.produtos = produtos;
    window.semImagem = semImagem;

    window.adicionarImagens = async function() {
        console.log('\n🎨 Adicionando imagens aos produtos...\n');

        function detectarTipoImagem(produto) {
            const texto = `${produto.nome || ''} ${produto.descricao || ''}`.toLowerCase();

            if (texto.includes('tela') || texto.includes('lcd') || texto.includes('oled') ||
                texto.includes('amoled') || texto.includes('fog') || texto.includes('display') ||
                texto.includes('touch')) {
                return 'telas';
            }

            if ((texto.includes('iphone') || texto.includes('samsung') || texto.includes('galaxy')) &&
                texto.includes('gb')) {
                return 'celulares';
            }

            return 'acessorios';
        }

        const contadores = { celulares: 0, telas: 0, acessorios: 0 };

        function obterImagem(pasta) {
            contadores[pasta]++;
            const numero = ((contadores[pasta] - 1) % 12) + 1;
            return `/images/${pasta}/${pasta.slice(0, -1)}${numero}.png`;
        }

        let sucessos = 0;
        let erros = 0;

        for (let i = 0; i < semImagem.length; i++) {
            const produto = semImagem[i];
            const pasta = detectarTipoImagem(produto);
            const imagem = obterImagem(pasta);

            try {
                const response = await fetch(`${API_URL}/api/Produtos/${produto.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...produto, imagem })
                });

                if (response.ok) {
                    sucessos++;
                    console.log(`✅ [${i + 1}/${semImagem.length}] ${produto.nome?.substring(0, 35)} → ${imagem.split('/').pop()}`);
                } else {
                    erros++;
                    const erro = await response.text();
                    console.error(`❌ [${i + 1}/${semImagem.length}] Erro ${response.status}: ${erro.substring(0, 50)}`);
                }
            } catch (error) {
                erros++;
                console.error(`❌ [${i + 1}/${semImagem.length}] ${error.message}`);
            }

            if ((i + 1) % 50 === 0) {
                console.log(`\n📊 Progresso: ${i + 1}/${semImagem.length} (${Math.round((i + 1) / semImagem.length * 100)}%)\n`);
            }

            await new Promise(r => setTimeout(r, 100));
        }

        console.log('\n' + '='.repeat(50));
        console.log('🏁 CONCLUÍDO!');
        console.log('='.repeat(50));
        console.log(`✅ Sucessos: ${sucessos}`);
        console.log(`❌ Erros: ${erros}`);
        console.log('\n📊 Distribuição:');
        console.table(contadores);
        console.log('\n💡 Recarregue: location.reload()');
    };

    console.log('\n✨ Funções disponíveis:');
    console.log('   - adicionarImagens() → Adiciona imagens aos produtos');
    console.log('   - produtos → Ver todos os produtos');
    console.log('   - semImagem → Ver produtos sem imagem');

})();
