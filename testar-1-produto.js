/**
 * 🧪 TESTE COM 1 PRODUTO APENAS
 * Para descobrir o erro real
 */

(async function testarUmProduto() {
    console.clear();
    console.log('🧪 TESTANDO COM 1 PRODUTO\n');

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado!');
        return;
    }

    const API_URL = 'https://localhost:44370';

    // 1. Buscar produtos
    console.log('📦 Buscando produtos...');
    const response = await fetch(`${API_URL}/api/Produtos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const produtos = await response.json();
    console.log(`✅ ${produtos.length} produtos encontrados\n`);

    // 2. Pegar o primeiro produto
    const produto = produtos[0];
    console.log('📋 Produto selecionado para teste:');
    console.table({
        ID: produto.id,
        Nome: produto.nome,
        'Imagem Atual': produto.imagem || 'VAZIO',
        Segmento: produto.idSegmento
    });

    // 3. Tentar adicionar imagem
    console.log('\n🎨 Tentando adicionar imagem...');

    const produtoAtualizado = {
        ...produto,
        imagem: '/images/telas/tela1.png'
    };

    console.log('\n📤 Enviando para API:');
    console.log('URL:', `${API_URL}/api/Produtos/${produto.id}`);
    console.log('Método: PUT');
    console.log('Imagem:', produtoAtualizado.imagem);

    try {
        const updateResponse = await fetch(`${API_URL}/api/Produtos/${produto.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(produtoAtualizado)
        });

        console.log('\n📥 Resposta do servidor:');
        console.log('Status:', updateResponse.status);
        console.log('Status Text:', updateResponse.statusText);

        if (updateResponse.ok) {
            console.log('\n✅ SUCESSO! Produto atualizado!');

            // Buscar novamente para confirmar
            console.log('\n🔍 Buscando produto atualizado...');
            const verificarResponse = await fetch(`${API_URL}/api/Produtos/${produto.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const produtoVerificado = await verificarResponse.json();
            console.log('\n📋 Produto após atualização:');
            console.table({
                ID: produtoVerificado.id,
                Nome: produtoVerificado.nome,
                'Imagem Atual': produtoVerificado.imagem || 'AINDA VAZIO',
                Segmento: produtoVerificado.idSegmento
            });

            if (produtoVerificado.imagem) {
                console.log('\n✅ CONFIRMADO! Imagem foi salva no banco!');
                console.log('💡 Agora você pode executar adicionarImagens() para todos os produtos');
            } else {
                console.log('\n❌ PROBLEMA: Imagem não foi salva!');
                console.log('💡 O backend pode não estar aceitando o campo "imagem"');
            }
        } else {
            const errorText = await updateResponse.text();
            console.log('\n❌ ERRO ao atualizar!');
            console.log('Resposta:', errorText);

            console.log('\n💡 Possíveis causas:');
            console.log('   1. Campo "imagem" não existe na tabela Produtos');
            console.log('   2. Backend não aceita o campo "imagem" no PUT');
            console.log('   3. Validação do backend rejeitando algum campo');
        }
    } catch (error) {
        console.log('\n❌ ERRO de conexão:');
        console.error(error);
    }

})();
