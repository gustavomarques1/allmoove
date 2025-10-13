/**
 * 🚀 Script de Importação de Produtos do Excel via Console
 *
 * COMO USAR:
 * 1. Faça login na aplicação (http://localhost:5174)
 * 2. Abra o Console do DevTools (F12 -> Console)
 * 3. Copie e cole PRIMEIRO a biblioteca XLSX:
 *    const script = document.createElement('script');
 *    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
 *    document.head.appendChild(script);
 * 4. Aguarde 2 segundos
 * 5. Copie e cole este script completo
 * 6. Pressione Enter e selecione o arquivo Excel quando solicitado
 */

(async function importarProdutosDoExcel() {
    console.clear();
    console.log('🚀 Importador de Produtos do Excel\n');

    // Verificar se XLSX está carregado
    if (typeof XLSX === 'undefined') {
        console.error('❌ Biblioteca XLSX não encontrada!');
        console.log('\n📚 Execute primeiro:');
        console.log('const script = document.createElement("script");');
        console.log('script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";');
        console.log('document.head.appendChild(script);');
        console.log('\nAguarde 2 segundos e execute este script novamente.');
        return;
    }

    // Verificar token
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado! Faça login primeiro.');
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
    const SITUACAO = 'ATIVO';

    // Criar input de arquivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.style.display = 'none';
    document.body.appendChild(input);

    // Aguardar seleção do arquivo
    console.log('\n📂 Selecione o arquivo Excel...');

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.error('❌ Nenhum arquivo selecionado');
            document.body.removeChild(input);
            return;
        }

        console.log(`📄 Arquivo: ${file.name}`);
        console.log('📖 Lendo arquivo...\n');

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // Ler Excel
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                console.log(`✅ ${jsonData.length} linhas encontradas`);
                console.log('\n📋 Preview dos primeiros 3 produtos:');
                console.table(jsonData.slice(0, 3));

                // Confirmar importação
                console.log('\n🚀 Iniciando importação em 3 segundos...');
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Importar produtos
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                let successCount = 0;
                let errorCount = 0;
                const errors = [];

                for (let i = 0; i < jsonData.length; i++) {
                    const row = jsonData[i];

                    // Mapear dados do Excel para o formato da API
                    const produto = {
                        empresa: 1,
                        estabelecimento: 1,
                        codigo: row.sku || row.SKU || row.codigo || row.Codigo || `PROD${i + 1}`,
                        idDistribuidor: parseInt(row.idDistribuidor || row.distribuidor || ID_DISTRIBUIDOR),
                        idSegmento: parseInt(row.idSegmento || row.segmento || ID_SEGMENTO),
                        idMarca: parseInt(row.idMarca || row.marca || 1),
                        idModelo: parseInt(row.idModelo || row.modelo || 1),
                        idGrupo: parseInt(row.idGrupo || row.grupo || 1),
                        idTag: parseInt(row.idTag || row.tag || 1),
                        nome: row.nome || row.Nome || row.NOME || '',
                        descricao: row.descricao || row.Descricao || row.DESCRICAO || '',
                        sku: row.sku || row.SKU || row.codigo || row.Codigo || '',
                        ean: row.ean || row.EAN || row.codigoBarras || '',
                        posicao: row.posicao || row.Posicao || '',
                        situacao: SITUACAO,
                        precoCusto: parseFloat(row.precoCusto || row.PrecoCusto || row.preco_custo || 0),
                        precoVenda: parseFloat(row.precoVenda || row.PrecoVenda || row.preco_venda || row.preco || row.Preco || 0),
                        quantidade: parseInt(row.quantidade || row.Quantidade || row.estoque || row.Estoque || 0)
                    };

                    // Validar campos obrigatórios
                    if (!produto.nome || produto.precoVenda === 0) {
                        errorCount++;
                        console.warn(`⚠️ [${i + 1}/${jsonData.length}] Linha ignorada - nome ou preço inválido`);
                        continue;
                    }

                    try {
                        const response = await fetch(`${API_URL}/api/Produtos`, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(produto)
                        });

                        if (response.ok) {
                            successCount++;
                            const resultado = await response.json();
                            console.log(`✅ [${i + 1}/${jsonData.length}] "${produto.nome}" - ID: ${resultado.id}`);
                        } else {
                            errorCount++;
                            const errorText = await response.text();
                            console.error(`❌ [${i + 1}/${jsonData.length}] "${produto.nome}" - ${response.status}`);
                            errors.push({ produto: produto.nome, error: errorText });
                        }
                    } catch (error) {
                        errorCount++;
                        console.error(`❌ [${i + 1}/${jsonData.length}] "${produto.nome}" - ${error.message}`);
                        errors.push({ produto: produto.nome, error: error.message });
                    }

                    // Delay para não sobrecarregar
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Resumo final
                console.log('\n========================================');
                console.log('🏁 IMPORTAÇÃO CONCLUÍDA!');
                console.log('========================================');
                console.log(`✅ Sucesso: ${successCount} produtos`);
                console.log(`❌ Erros: ${errorCount} produtos`);

                if (errors.length > 0) {
                    console.log('\n📋 Detalhes dos erros:');
                    console.table(errors);
                }

                console.log('\n💡 Execute "location.reload()" para ver os novos produtos!');

            } catch (error) {
                console.error('❌ Erro ao ler arquivo:', error);
            } finally {
                document.body.removeChild(input);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // Abrir seletor de arquivo
    input.click();
})();
