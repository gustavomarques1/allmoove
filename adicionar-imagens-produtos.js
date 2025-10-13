/**
 * 🎨 Script SIMPLES para Adicionar Imagens aos Produtos
 *
 * NÃO muda categorias/segmentos - apenas adiciona imagens
 *
 * COMO USAR (no console do navegador após login):
 * 1. Faça login na aplicação
 * 2. Abra Console (F12)
 * 3. Copie e cole todo este script
 */

(async function adicionarImagensProdutos() {
    console.clear();
    console.log('🎨 Adicionando Imagens aos Produtos\n');

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

    // ========================================
    // BUSCAR TODOS OS PRODUTOS
    // ========================================
    console.log('\n📦 Buscando produtos...');

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
        console.log(`✅ ${produtos.length} produtos encontrados\n`);

    } catch (error) {
        console.error('❌ Erro:', error);
        return;
    }

    if (produtos.length === 0) {
        console.log('⚠️ Nenhum produto para atualizar');
        return;
    }

    // ========================================
    // FUNÇÃO PARA DETECTAR TIPO E IMAGEM
    // ========================================
    function detectarTipoImagem(produto) {
        const nome = (produto.nome || '').toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
        const texto = `${nome} ${descricao}`;

        // Telas
        if (texto.includes('tela') || texto.includes('lcd') || texto.includes('oled') ||
            texto.includes('amoled') || texto.includes('fog') || texto.includes('display') ||
            texto.includes('touch')) {
            return 'telas';
        }

        // Celulares completos
        if ((texto.includes('iphone ') || texto.includes('samsung ') || texto.includes('galaxy ')) &&
            (texto.includes('gb') || texto.includes('completo'))) {
            return 'celulares';
        }

        // Outros (baterias, câmeras, conectores, etc.)
        return 'acessorios';
    }

    const imagensPorPasta = {
        'celulares': 12,
        'telas': 12,
        'acessorios': 12
    };

    const contadorPorPasta = {
        'celulares': 0,
        'telas': 0,
        'acessorios': 0
    };

    function obterImagem(pasta) {
        const total = imagensPorPasta[pasta];
        contadorPorPasta[pasta]++;
        const numero = ((contadorPorPasta[pasta] - 1) % total) + 1;

        if (pasta === 'telas') {
            return `/images/telas/tela${numero}.png`;
        } else if (pasta === 'celulares') {
            return `/images/celulares/celular${numero}.png`;
        } else {
            return `/images/acessorios/acessorio${numero}.png`;
        }
    }

    // ========================================
    // ATUALIZAR PRODUTOS
    // ========================================
    console.log('🎨 Adicionando imagens...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];

        // Detectar tipo e obter imagem
        const pasta = detectarTipoImagem(produto);
        const imagem = obterImagem(pasta);

        // Criar produto atualizado (mantém TUDO igual, só adiciona imagem)
        const produtoAtualizado = {
            ...produto,
            imagem: imagem
        };

        try {
            const response = await fetch(`${API_URL}/api/Produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(produtoAtualizado)
            });

            if (response.ok) {
                successCount++;
                console.log(`✅ [${i + 1}/${produtos.length}] "${produto.nome?.substring(0, 40)}" → ${imagem.split('/').pop()}`);
            } else {
                errorCount++;
                console.error(`❌ [${i + 1}/${produtos.length}] Erro ${response.status}`);

                if (errors.length < 10) {
                    errors.push({
                        produto: produto.nome?.substring(0, 30),
                        status: response.status
                    });
                }
            }
        } catch (error) {
            errorCount++;
            console.error(`❌ [${i + 1}/${produtos.length}] ${error.message}`);

            if (errors.length < 10) {
                errors.push({
                    produto: produto.nome?.substring(0, 30),
                    error: error.message
                });
            }
        }

        // Progress
        if ((i + 1) % 50 === 0) {
            console.log(`\n📊 Progresso: ${i + 1}/${produtos.length} (${Math.round((i + 1) / produtos.length * 100)}%)\n`);
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // ========================================
    // RESUMO
    // ========================================
    console.log('\n========================================');
    console.log('🏁 IMAGENS ADICIONADAS!');
    console.log('========================================');
    console.log(`✅ Sucesso: ${successCount} produtos`);
    console.log(`❌ Erros: ${errorCount} produtos`);

    console.log('\n📊 Distribuição de imagens:');
    console.table(contadorPorPasta);

    if (errors.length > 0) {
        console.log('\n📋 Primeiros erros:');
        console.table(errors);
    }

    if (successCount > 0) {
        console.log('\n✨ Imagens adicionadas com sucesso!');
        console.log('💡 Recarregue a página: location.reload()');
    }
})();
