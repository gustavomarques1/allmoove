/**
 * 🔧 Corrigir Imagens - Segmento CELULAR
 *
 * Todos os produtos com idSegmento=1 → celular1.png até celular12.png
 */

(async function corrigirImagensCelular() {
    console.clear();
    console.log('🔧 Corrigindo Imagens do Segmento CELULAR\n');

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado!');
        return;
    }

    const API_URL = 'https://localhost:44370';

    // 1. Buscar TODOS os produtos
    console.log('📦 Buscando produtos...');
    const response = await fetch(`${API_URL}/api/Produtos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const produtos = await response.json();
    console.log(`✅ ${produtos.length} produtos encontrados\n`);

    // 2. Filtrar apenas produtos de CELULAR (idSegmento=1)
    const produtosCelular = produtos.filter(p => p.idSegmento === 1);
    console.log(`📱 Produtos de CELULAR (idSegmento=1): ${produtosCelular.length}\n`);

    if (produtosCelular.length === 0) {
        console.log('⚠️ Nenhum produto de CELULAR encontrado!');
        return;
    }

    // 3. Atualizar imagens - TODOS vão usar celular1.png até celular12.png
    console.log('🎨 Atualizando imagens para celular1.png até celular12.png...\n');

    let sucessos = 0;
    let erros = 0;

    for (let i = 0; i < produtosCelular.length; i++) {
        const produto = produtosCelular[i];

        // Rotacionar entre celular1.png e celular12.png
        const numero = (i % 12) + 1;
        const novaImagem = `/images/celulares/celular${numero}.png`;

        try {
            const updateResponse = await fetch(`${API_URL}/api/Produtos/${produto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...produto,
                    imagem: novaImagem
                })
            });

            if (updateResponse.ok) {
                sucessos++;
                console.log(`✅ [${i + 1}/${produtosCelular.length}] ${produto.nome?.substring(0, 40)} → celular${numero}.png`);
            } else {
                erros++;
                console.error(`❌ [${i + 1}/${produtosCelular.length}] Erro ${updateResponse.status}`);
            }
        } catch (error) {
            erros++;
            console.error(`❌ [${i + 1}/${produtosCelular.length}] ${error.message}`);
        }

        // Progresso a cada 50 produtos
        if ((i + 1) % 50 === 0) {
            console.log(`\n📊 Progresso: ${i + 1}/${produtosCelular.length} (${Math.round((i + 1) / produtosCelular.length * 100)}%)\n`);
        }

        // Delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 4. Resumo final
    console.log('\n' + '='.repeat(50));
    console.log('🏁 CORREÇÃO CONCLUÍDA!');
    console.log('='.repeat(50));
    console.log(`✅ Sucessos: ${sucessos} produtos`);
    console.log(`❌ Erros: ${erros} produtos`);
    console.log('\n📱 TODAS as imagens do segmento CELULAR agora usam:');
    console.log('   celular1.png, celular2.png, ... celular12.png');
    console.log('\n💡 Recarregue a página: location.reload()');
})();
