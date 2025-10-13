/**
 * 🔄 Script para Atualizar Produtos com Segmento e Imagem Corretos
 *
 * COMO USAR (no console do navegador após login):
 * 1. Faça login na aplicação
 * 2. Abra Console (F12)
 * 3. Copie e cole todo este script
 * 4. Aguarde a atualização
 */

(async function atualizarProdutos() {
    console.clear();
    console.log('🔄 Atualizando Produtos com Segmento e Imagem Corretos\n');

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
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
        console.log('⚠️  Nenhum produto para atualizar');
        return;
    }

    // ========================================
    // FUNÇÃO PARA DETECTAR CATEGORIA
    // ========================================
    function detectarCategoria(produto) {
        const nome = (produto.nome || '').toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
        const texto = `${nome} ${descricao}`;

        // Telas (maioria dos produtos)
        if (texto.includes('tela') || texto.includes('lcd') || texto.includes('oled') ||
            texto.includes('amoled') || texto.includes('incell') || texto.includes('display') ||
            texto.includes('fog') || texto.includes('touch')) {
            return {
                segmento: 1, // CELULAR
                tipo: 'tela',
                pasta: 'telas'
            };
        }

        // Baterias
        if (texto.includes('bateria') || texto.includes('battery')) {
            return {
                segmento: 1, // CELULAR
                tipo: 'bateria',
                pasta: 'acessorios'
            };
        }

        // Câmeras
        if (texto.includes('camera') || texto.includes('câmera') || texto.includes('cam ')) {
            return {
                segmento: 1, // CELULAR
                tipo: 'camera',
                pasta: 'acessorios'
            };
        }

        // Conectores / Placas
        if (texto.includes('conector') || texto.includes('placa') || texto.includes('flex') ||
            texto.includes('carga') || texto.includes('usb')) {
            return {
                segmento: 1, // CELULAR
                tipo: 'conector',
                pasta: 'acessorios'
            };
        }

        // Celulares completos (se houver)
        if (texto.includes('iphone ') || texto.includes('samsung ') || texto.includes('galaxy ') ||
            texto.includes('motorola') || texto.includes('xiaomi')) {
            // Se tiver GB ou "completo" é celular inteiro
            if (texto.includes('gb') || texto.includes('completo') || texto.includes('novo')) {
                return {
                    segmento: 1, // CELULAR
                    tipo: 'celular',
                    pasta: 'celulares'
                };
            }
        }

        // Padrão: acessório
        return {
            segmento: 1, // CELULAR (maioria das peças)
            tipo: 'acessorio',
            pasta: 'acessorios'
        };
    }

    // ========================================
    // MAPEAR IMAGENS
    // ========================================
    const imagensPorPasta = {
        'celulares': 12,
        'telas': 12,
        'acessorios': 12,
        'notebooks': 12
    };

    function obterImagem(pasta, indice) {
        const total = imagensPorPasta[pasta] || 12;
        const numero = (indice % total) + 1;

        if (pasta === 'telas') {
            return `/images/telas/tela${numero}.png`;
        } else if (pasta === 'celulares') {
            return `/images/celulares/celular${numero}.png`;
        } else if (pasta === 'acessorios') {
            return `/images/acessorios/acessorio${numero}.png`;
        } else {
            return `/images/notebooks/notebook${numero}.png`;
        }
    }

    // ========================================
    // ATUALIZAR PRODUTOS
    // ========================================
    console.log('🔄 Atualizando produtos...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    const contadorPorPasta = {
        'celulares': 0,
        'telas': 0,
        'acessorios': 0,
        'notebooks': 0
    };

    for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];

        // Detectar categoria
        const categoria = detectarCategoria(produto);

        // Obter imagem
        contadorPorPasta[categoria.pasta]++;
        const imagem = obterImagem(categoria.pasta, contadorPorPasta[categoria.pasta]);

        // Criar produto atualizado
        const produtoAtualizado = {
            ...produto,
            idSegmento: categoria.segmento,
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
                console.log(`✅ [${i + 1}/${produtos.length}] "${produto.nome?.substring(0, 40)}" - ${categoria.tipo} - ${imagem.split('/').pop()}`);
            } else {
                errorCount++;
                const errorText = await response.text();
                console.error(`❌ [${i + 1}/${produtos.length}] Erro ${response.status}`);

                if (errors.length < 10) {
                    errors.push({
                        produto: produto.nome?.substring(0, 30),
                        status: response.status,
                        error: errorText.substring(0, 50)
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
    console.log('🏁 ATUALIZAÇÃO CONCLUÍDA!');
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
        console.log('\n✨ Produtos atualizados!');
        console.log('💡 Recarregue a página: location.reload()');
    }
})();
