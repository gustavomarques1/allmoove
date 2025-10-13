/**
 * 🚀 Script de Importação de Produtos via Console
 *
 * COMO USAR:
 * 1. Faça login na aplicação (http://localhost:5174)
 * 2. Abra o Console do DevTools (F12 -> Console)
 * 3. Copie e cole este script completo
 * 4. Altere os dados dos produtos abaixo
 * 5. Pressione Enter
 *
 * O script irá importar os produtos automaticamente usando o token do localStorage
 */

(async function importarProdutos() {
    console.clear();
    console.log('🚀 Iniciando importação de produtos...\n');

    // ========================================
    // CONFIGURAÇÕES - ALTERE AQUI
    // ========================================
    const API_URL = 'https://localhost:44370';
    const ID_DISTRIBUIDOR = 11;
    const ID_SEGMENTO = 1;
    const ID_MARCA = 1;
    const ID_MODELO = 1;
    const ID_GRUPO = 1;
    const ID_TAG = 1;
    const SITUACAO = 'ATIVO';

    // ========================================
    // PRODUTOS PARA IMPORTAR - EDITE AQUI
    // ========================================
    const produtos = [
        {
            nome: "iPhone 14 128GB",
            descricao: "iPhone 14 128GB Preto",
            sku: "APL-IP14-128-BK",
            ean: "0194253396419",
            precoCusto: 3500.00,
            precoVenda: 4200.00,
            quantidade: 10,
            posicao: "A1-P1"
        },
        {
            nome: "iPhone 14 Pro Max 256GB",
            descricao: "iPhone 14 Pro Max 256GB Roxo Profundo",
            sku: "APL-IP14PM-256-PP",
            ean: "0194253397126",
            precoCusto: 5800.00,
            precoVenda: 7200.00,
            quantidade: 5,
            posicao: "A1-P2"
        },
        {
            nome: "Tela LCD iPhone 12",
            descricao: "Tela LCD Original iPhone 12 com Touch",
            sku: "TL-IP12-LCD",
            ean: "7891234567890",
            precoCusto: 280.00,
            precoVenda: 450.00,
            quantidade: 20,
            posicao: "B2-P1"
        },
        {
            nome: "Bateria iPhone 13",
            descricao: "Bateria Original Apple iPhone 13",
            sku: "BAT-IP13-ORI",
            ean: "7891234567891",
            precoCusto: 150.00,
            precoVenda: 280.00,
            quantidade: 15,
            posicao: "B2-P2"
        },
        {
            nome: "Câmera Traseira iPhone 14",
            descricao: "Câmera Traseira Principal 12MP iPhone 14",
            sku: "CAM-IP14-TRAS",
            ean: "7891234567892",
            precoCusto: 320.00,
            precoVenda: 520.00,
            quantidade: 8,
            posicao: "B3-P1"
        },
        {
            nome: "Alto Falante iPhone 11",
            descricao: "Alto Falante Auricular iPhone 11",
            sku: "AF-IP11-AUR",
            ean: "7891234567893",
            precoCusto: 45.00,
            precoVenda: 85.00,
            quantidade: 30,
            posicao: "C1-P1"
        },
        {
            nome: "Conector de Carga iPhone 12",
            descricao: "Conector de Carga Lightning iPhone 12",
            sku: "CC-IP12-LGT",
            ean: "7891234567894",
            precoCusto: 65.00,
            precoVenda: 130.00,
            quantidade: 25,
            posicao: "C1-P2"
        },
        {
            nome: "Placa Lógica iPhone SE",
            descricao: "Placa Lógica iPhone SE 2022 64GB",
            sku: "PL-IPSE-64",
            ean: "7891234567895",
            precoCusto: 850.00,
            precoVenda: 1200.00,
            quantidade: 3,
            posicao: "D1-P1"
        },
        {
            nome: "Tela OLED iPhone 13 Pro",
            descricao: "Tela OLED Original iPhone 13 Pro com Touch",
            sku: "TL-IP13P-OLED",
            ean: "7891234567896",
            precoCusto: 680.00,
            precoVenda: 950.00,
            quantidade: 12,
            posicao: "B2-P3"
        },
        {
            nome: "Microfone iPhone 12 Pro",
            descricao: "Microfone Principal iPhone 12 Pro",
            sku: "MIC-IP12P-PRI",
            ean: "7891234567897",
            precoCusto: 35.00,
            precoVenda: 70.00,
            quantidade: 40,
            posicao: "C2-P1"
        },
        {
            nome: "Câmera Frontal iPhone 13",
            descricao: "Câmera Frontal 12MP iPhone 13",
            sku: "CAM-IP13-FRONT",
            ean: "7891234567898",
            precoCusto: 180.00,
            precoVenda: 320.00,
            quantidade: 18,
            posicao: "B3-P2"
        },
        {
            nome: "Botão Power iPhone 11",
            descricao: "Botão Power/Liga Desliga iPhone 11",
            sku: "BT-IP11-PWR",
            ean: "7891234567899",
            precoCusto: 25.00,
            precoVenda: 55.00,
            quantidade: 35,
            posicao: "C3-P1"
        },
        {
            nome: "Vibracall iPhone XR",
            descricao: "Motor de Vibração iPhone XR",
            sku: "VIB-IPXR",
            ean: "7891234567900",
            precoCusto: 30.00,
            precoVenda: 65.00,
            quantidade: 28,
            posicao: "C3-P2"
        },
        {
            nome: "Sensor de Proximidade iPhone 12",
            descricao: "Sensor de Proximidade iPhone 12",
            sku: "SEN-IP12-PROX",
            ean: "7891234567901",
            precoCusto: 40.00,
            precoVenda: 80.00,
            quantidade: 22,
            posicao: "C4-P1"
        },
        {
            nome: "Blindagem/Shield iPhone 13",
            descricao: "Blindagem de Proteção Placa iPhone 13",
            sku: "BL-IP13-PROT",
            ean: "7891234567902",
            precoCusto: 15.00,
            precoVenda: 35.00,
            quantidade: 50,
            posicao: "C4-P2"
        },
        {
            nome: "Samsung Galaxy S23 128GB",
            descricao: "Samsung Galaxy S23 128GB Phantom Black",
            sku: "SAM-S23-128-BK",
            ean: "8806094669022",
            precoCusto: 2800.00,
            precoVenda: 3500.00,
            quantidade: 8,
            posicao: "A2-P1"
        },
        {
            nome: "Tela AMOLED Galaxy S22",
            descricao: "Tela AMOLED Original Galaxy S22 com Touch",
            sku: "TL-S22-AMOLED",
            ean: "7891234567903",
            precoCusto: 520.00,
            precoVenda: 780.00,
            quantidade: 10,
            posicao: "B4-P1"
        },
        {
            nome: "Bateria Galaxy A54",
            descricao: "Bateria Original Samsung Galaxy A54 5000mAh",
            sku: "BAT-A54-5000",
            ean: "7891234567904",
            precoCusto: 85.00,
            precoVenda: 150.00,
            quantidade: 25,
            posicao: "B4-P2"
        },
        {
            nome: "Câmera Traseira Galaxy S21",
            descricao: "Câmera Traseira 64MP Galaxy S21",
            sku: "CAM-S21-TRAS",
            ean: "7891234567905",
            precoCusto: 280.00,
            precoVenda: 450.00,
            quantidade: 12,
            posicao: "B5-P1"
        },
        {
            nome: "Conector USB-C Galaxy A52",
            descricao: "Conector de Carga USB-C Galaxy A52",
            sku: "CC-A52-USBC",
            ean: "7891234567906",
            precoCusto: 55.00,
            precoVenda: 110.00,
            quantidade: 30,
            posicao: "C5-P1"
        }
    ];

    // ========================================
    // LÓGICA DE IMPORTAÇÃO
    // ========================================

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ Token não encontrado! Faça login primeiro.');
        return;
    }

    console.log(`🔐 Token encontrado: ${token.substring(0, 20)}...`);
    console.log(`📦 Total de produtos a importar: ${produtos.length}\n`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < produtos.length; i++) {
        const produtoOriginal = produtos[i];

        // Montar objeto completo com valores padrão
        const produto = {
            empresa: 1,
            estabelecimento: 1,
            codigo: produtoOriginal.sku || `PROD${i + 1}`,
            idDistribuidor: ID_DISTRIBUIDOR,
            idSegmento: ID_SEGMENTO,
            idMarca: ID_MARCA,
            idModelo: ID_MODELO,
            idGrupo: ID_GRUPO,
            idTag: ID_TAG,
            nome: produtoOriginal.nome,
            descricao: produtoOriginal.descricao || '',
            sku: produtoOriginal.sku || '',
            ean: produtoOriginal.ean || '',
            posicao: produtoOriginal.posicao || '',
            situacao: SITUACAO,
            precoCusto: produtoOriginal.precoCusto || 0,
            precoVenda: produtoOriginal.precoVenda || 0,
            quantidade: produtoOriginal.quantidade || 0
        };

        try {
            const response = await fetch(`${API_URL}/api/Produtos`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                successCount++;
                const resultado = await response.json();
                console.log(`✅ [${i + 1}/${produtos.length}] "${produto.nome}" - ID: ${resultado.id}`);
            } else {
                errorCount++;
                const errorText = await response.text();
                const errorMsg = `❌ [${i + 1}/${produtos.length}] "${produto.nome}" - ${response.status}: ${errorText}`;
                console.error(errorMsg);
                errors.push({ produto: produto.nome, error: errorText });
            }
        } catch (error) {
            errorCount++;
            const errorMsg = `❌ [${i + 1}/${produtos.length}] "${produto.nome}" - Erro: ${error.message}`;
            console.error(errorMsg);
            errors.push({ produto: produto.nome, error: error.message });
        }

        // Pequeno delay para não sobrecarregar
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

    console.log('\n💡 Dica: Execute "location.reload()" para recarregar a página e ver os novos produtos!');
})();
