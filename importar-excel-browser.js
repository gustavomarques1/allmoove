/**
 * 🚀 Script para Importar Produtos do Excel - Executa no Console do Navegador
 *
 * COMO USAR:
 * 1. Faça login na aplicação (http://localhost:5174)
 * 2. Abra o Console (F12 → Console)
 * 3. Execute PRIMEIRO (para carregar biblioteca XLSX):
 *    const script = document.createElement('script');
 *    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
 *    document.head.appendChild(script);
 * 4. Aguarde 2 segundos
 * 5. Copie e cole TODO este arquivo no console
 * 6. Selecione o arquivo Excel quando solicitado
 */

(async function importarProdutosExcel() {
    console.clear();
    console.log('🚀 Importador de Produtos do Excel - AllMoove\n');

    // ========================================
    // VERIFICAÇÕES INICIAIS
    // ========================================

    // 1. Verificar biblioteca XLSX
    if (typeof XLSX === 'undefined') {
        console.error('❌ Biblioteca XLSX não encontrada!');
        console.log('\n📚 Execute primeiro:');
        console.log('const script = document.createElement("script");');
        console.log('script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";');
        console.log('document.head.appendChild(script);');
        console.log('\nAguarde 2 segundos e execute este script novamente.');
        return;
    }

    // 2. Buscar token automaticamente
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado no localStorage!');
        console.error('💡 Faça login na aplicação primeiro.');
        return;
    }

    console.log('✅ Biblioteca XLSX carregada');
    console.log(`🔐 Token encontrado: ${token.substring(0, 20)}...`);

    // ========================================
    // CONFIGURAÇÕES
    // ========================================
    const API_URL = 'https://localhost:44370';
    const ID_DISTRIBUIDOR = 11;
    const ID_SEGMENTO = 1;
    const PRECO_PADRAO = 100.00;
    const QUANTIDADE_PADRAO = 10;
    const SITUACAO = 'ATIVO';

    // ========================================
    // CRIAR INPUT DE ARQUIVO
    // ========================================
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.style.display = 'none';
    document.body.appendChild(input);

    console.log('\n📂 Selecione o arquivo Excel...');

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('❌ Nenhum arquivo selecionado');
            document.body.removeChild(input);
            return;
        }

        console.log(`\n📄 Arquivo: ${file.name}`);
        console.log('📖 Lendo arquivo...');

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // ========================================
                // LER EXCEL
                // ========================================
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                console.log(`\n✅ Arquivo lido com sucesso!`);
                console.log(`📊 Total de linhas: ${jsonData.length}`);

                if (jsonData.length === 0) {
                    console.error('❌ Nenhum dado encontrado no Excel');
                    document.body.removeChild(input);
                    return;
                }

                // ========================================
                // PREVIEW
                // ========================================
                console.log('\n📋 Preview dos primeiros 3 produtos:');
                console.table(jsonData.slice(0, 3));

                // ========================================
                // CONFIRMAR IMPORTAÇÃO
                // ========================================
                console.log('\n🚀 Iniciando importação em 3 segundos...');
                console.log('💡 Feche esta aba para cancelar\n');
                await new Promise(resolve => setTimeout(resolve, 3000));

                // ========================================
                // PREPARAR HEADERS
                // ========================================
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                // ========================================
                // IMPORTAR PRODUTOS
                // ========================================
                let successCount = 0;
                let errorCount = 0;
                let skipCount = 0;
                const errors = [];

                console.log('📦 Importando produtos...\n');

                for (let i = 0; i < jsonData.length; i++) {
                    const row = jsonData[i];

                    // Mapear dados (seu Excel: CÓDIGO, DESCRIÇÃO, GRUPO, MARCA)
                    const codigo = (row.CÓDIGO || row.codigo || row.Codigo || row.sku || row.SKU || `PROD${i + 1}`).toString().trim();
                    const descricao = (row.DESCRIÇÃO || row.Descricao || row.descricao || row.nome || row.Nome || '').toString().trim();
                    const grupo = (row.GRUPO || row.grupo || row.Grupo || '').toString().trim();
                    const marca = (row.MARCA || row.marca || row.Marca || '').toString().trim();

                    // Usar preço padrão se não houver
                    const precoVenda = parseFloat(row.precoVenda || row.PrecoVenda || row.preco || row.Preco || row.PREÇO || PRECO_PADRAO);
                    const precoCusto = parseFloat(row.precoCusto || row.PrecoCusto || precoVenda * 0.7);
                    const quantidade = parseInt(row.quantidade || row.Quantidade || row.estoque || row.Estoque || QUANTIDADE_PADRAO);

                    // Montar produto
                    const produto = {
                        empresa: 1,
                        estabelecimento: 1,
                        codigo: codigo,
                        idDistribuidor: ID_DISTRIBUIDOR,
                        idSegmento: ID_SEGMENTO,
                        idMarca: 1,
                        idModelo: 1,
                        idGrupo: 1,
                        idTag: 1,
                        nome: descricao,
                        descricao: `${descricao} - ${grupo} - ${marca}`,
                        sku: codigo,
                        ean: row.ean || row.EAN || '',
                        posicao: row.posicao || row.Posicao || '',
                        situacao: SITUACAO,
                        precoCusto: precoCusto,
                        precoVenda: precoVenda,
                        quantidade: quantidade
                    };

                    // Validar
                    if (!produto.nome || produto.nome.length < 2) {
                        skipCount++;
                        console.warn(`⚠️  [${i + 1}/${jsonData.length}] Ignorado - nome inválido`);
                        continue;
                    }

                    // Enviar para API
                    try {
                        const response = await fetch(`${API_URL}/api/Produtos`, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(produto)
                        });

                        if (response.ok) {
                            successCount++;
                            const resultado = await response.json();
                            console.log(`✅ [${i + 1}/${jsonData.length}] "${produto.nome.substring(0, 40)}" - ID: ${resultado.id}`);
                        } else {
                            errorCount++;
                            const errorText = await response.text();
                            const shortError = errorText.length > 50 ? errorText.substring(0, 50) + '...' : errorText;
                            console.error(`❌ [${i + 1}/${jsonData.length}] "${produto.nome.substring(0, 30)}" - ${response.status}`);

                            if (errors.length < 10) {
                                errors.push({
                                    produto: produto.nome.substring(0, 30),
                                    status: response.status,
                                    error: shortError
                                });
                            }
                        }
                    } catch (error) {
                        errorCount++;
                        console.error(`❌ [${i + 1}/${jsonData.length}] "${produto.nome.substring(0, 30)}" - ${error.message}`);

                        if (errors.length < 10) {
                            errors.push({
                                produto: produto.nome.substring(0, 30),
                                error: error.message
                            });
                        }
                    }

                    // Delay para não sobrecarregar
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Atualizar progresso a cada 50 produtos
                    if ((i + 1) % 50 === 0) {
                        console.log(`\n📊 Progresso: ${i + 1}/${jsonData.length} (${Math.round((i + 1) / jsonData.length * 100)}%)\n`);
                    }
                }

                // ========================================
                // RESUMO FINAL
                // ========================================
                console.log('\n========================================');
                console.log('🏁 IMPORTAÇÃO CONCLUÍDA!');
                console.log('========================================');
                console.log(`✅ Sucesso: ${successCount} produtos`);
                console.log(`❌ Erros: ${errorCount} produtos`);
                console.log(`⚠️  Ignorados: ${skipCount} produtos`);
                console.log(`📊 Total processado: ${jsonData.length} linhas`);

                if (errors.length > 0) {
                    console.log('\n📋 Primeiros erros (máximo 10):');
                    console.table(errors);
                }

                if (successCount > 0) {
                    console.log('\n✨ Produtos importados com sucesso!');
                    console.log('💡 Recarregue a página para ver os produtos: location.reload()');
                }

            } catch (error) {
                console.error('\n❌ Erro ao processar arquivo:', error);
            } finally {
                document.body.removeChild(input);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // Abrir seletor de arquivo
    input.click();
})();
