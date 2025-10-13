/**
 * 🔄 Script para Atualizar Produtos com Grupos e Imagens Corretos
 *
 * COMO USAR (no console do navegador após login):
 * 1. Faça login na aplicação
 * 2. Abra Console (F12)
 * 3. Copie e cole todo este script
 * 4. Aguarde a atualização
 */

(async function atualizarProdutosComGrupos() {
    console.clear();
    console.log('🔄 Atualizando Produtos com Grupos e Imagens Corretos\n');

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
    // 1. BUSCAR GRUPOS CRIADOS
    // ========================================
    console.log('\n📋 Buscando grupos...');

    let grupos = {};
    try {
        const response = await fetch(`${API_URL}/api/ProdutoGrupos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.error('❌ Erro ao buscar grupos:', response.status);
            console.log('💡 Execute primeiro o script de criação de grupos!');
            return;
        }

        const gruposAPI = await response.json();
        console.log(`✅ ${gruposAPI.length} grupos encontrados`);

        // Mapear grupos por nome
        gruposAPI.forEach(g => {
            grupos[g.nome.toUpperCase()] = g.id;
            console.log(`  [${g.id}] ${g.nome}`);
        });

        if (Object.keys(grupos).length === 0) {
            console.error('❌ Nenhum grupo encontrado! Execute primeiro o script de criação de grupos.');
            return;
        }

    } catch (error) {
        console.error('❌ Erro:', error);
        return;
    }

    // ========================================
    // 2. BUSCAR TODOS OS PRODUTOS
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
    // 3. FUNÇÃO PARA DETECTAR GRUPO
    // ========================================
    function detectarGrupo(produto) {
        const nome = (produto.nome || '').toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
        const texto = `${nome} ${descricao}`;

        // Telas (maioria dos produtos)
        if (texto.includes('tela') || texto.includes('lcd') || texto.includes('oled') ||
            texto.includes('amoled') || texto.includes('incell') || texto.includes('display') ||
            texto.includes('fog') || texto.includes('touch')) {
            return {
                idGrupo: grupos['TELAS'] || 1,
                tipo: 'tela',
                pasta: 'telas'
            };
        }

        // Baterias
        if (texto.includes('bateria') || texto.includes('battery')) {
            return {
                idGrupo: grupos['BATERIAS'] || 1,
                tipo: 'bateria',
                pasta: 'acessorios'
            };
        }

        // Câmeras
        if (texto.includes('camera') || texto.includes('câmera') || texto.includes('cam ')) {
            return {
                idGrupo: grupos['CAMERAS'] || 1,
                tipo: 'camera',
                pasta: 'acessorios'
            };
        }

        // Conectores / Placas
        if (texto.includes('conector') || texto.includes('placa') || texto.includes('flex') ||
            texto.includes('carga') || texto.includes('usb')) {
            return {
                idGrupo: grupos['CONECTORES'] || 1,
                tipo: 'conector',
                pasta: 'acessorios'
            };
        }

        // Celulares completos
        if ((texto.includes('iphone ') || texto.includes('samsung ') || texto.includes('galaxy ') ||
            texto.includes('motorola') || texto.includes('xiaomi')) &&
            (texto.includes('gb') || texto.includes('completo') || texto.includes('novo'))) {
            return {
                idGrupo: grupos['CELULARES'] || 1,
                tipo: 'celular',
                pasta: 'celulares'
            };
        }

        // Padrão: acessório
        return {
            idGrupo: grupos['ACESSORIOS'] || 1,
            tipo: 'acessorio',
            pasta: 'acessorios'
        };
    }

    // ========================================
    // 4. FUNÇÃO PARA OBTER IMAGEM
    // ========================================
    const imagensPorPasta = {
        'celulares': 12,
        'telas': 12,
        'acessorios': 12,
        'notebooks': 12
    };

    const contadorPorPasta = {
        'celulares': 0,
        'telas': 0,
        'acessorios': 0,
        'notebooks': 0
    };

    function obterImagem(pasta) {
        const total = imagensPorPasta[pasta] || 12;
        contadorPorPasta[pasta] = (contadorPorPasta[pasta] || 0) + 1;
        const numero = ((contadorPorPasta[pasta] - 1) % total) + 1;

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
    // 5. ATUALIZAR PRODUTOS
    // ========================================
    console.log('🔄 Atualizando produtos...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    const estatisticasGrupo = {};

    for (let i = 0; i < produtos.length; i++) {
        const produto = produtos[i];

        // Detectar grupo
        const categoria = detectarGrupo(produto);

        // Obter imagem
        const imagem = obterImagem(categoria.pasta);

        // Contar estatísticas
        estatisticasGrupo[categoria.tipo] = (estatisticasGrupo[categoria.tipo] || 0) + 1;

        // Criar produto atualizado
        const produtoAtualizado = {
            ...produto,
            idGrupo: categoria.idGrupo,
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
    // 6. RESUMO
    // ========================================
    console.log('\n========================================');
    console.log('🏁 ATUALIZAÇÃO CONCLUÍDA!');
    console.log('========================================');
    console.log(`✅ Sucesso: ${successCount} produtos`);
    console.log(`❌ Erros: ${errorCount} produtos`);

    console.log('\n📊 Distribuição por tipo:');
    console.table(estatisticasGrupo);

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
