/**
 * 🚀 Script Node.js para Importar Produtos do Excel para a API
 *
 * COMO USAR:
 * node importar-excel.cjs
 */

const XLSX = require('xlsx');
const fetch = require('node-fetch');
const https = require('https');

// ========================================
// CONFIGURAÇÕES - AJUSTE SE NECESSÁRIO
// ========================================
const API_URL = 'https://localhost:44370';
const EXCEL_PATH = './excel/produtos.xlsx';
const ID_DISTRIBUIDOR = 11;
const ID_SEGMENTO = 1;
const SITUACAO = 'ATIVO';

// Token - deixe null para tentar sem autenticação
let TOKEN = null;

// ========================================
// CÓDIGO PRINCIPAL
// ========================================

// Ignorar certificado SSL auto-assinado (apenas para desenvolvimento)
const agent = new https.Agent({
  rejectUnauthorized: false
});

async function importarProdutos() {
  console.log('🚀 Iniciando importação de produtos do Excel...\n');

  // 1. Ler arquivo Excel
  console.log(`📂 Lendo arquivo: ${EXCEL_PATH}`);
  let workbook;
  try {
    workbook = XLSX.readFile(EXCEL_PATH);
  } catch (error) {
    console.error('❌ Erro ao ler arquivo Excel:', error.message);
    console.log('\n💡 Certifique-se que o arquivo existe em: excel/produtos.xlsx');
    process.exit(1);
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`✅ Arquivo lido com sucesso!`);
  console.log(`📊 Total de linhas: ${data.length}\n`);

  if (data.length === 0) {
    console.error('❌ Nenhum dado encontrado no Excel');
    process.exit(1);
  }

  // 2. Mostrar preview
  console.log('📋 Preview dos primeiros 3 produtos:');
  console.table(data.slice(0, 3));
  console.log('');

  // 3. Verificar se precisa de token
  if (!TOKEN) {
    console.log('⚠️  TOKEN não configurado - tentando sem autenticação');
    console.log('💡 Se der erro 401, faça login e cole o token no script\n');
  }

  // 4. Preparar headers
  const headers = {
    'Content-Type': 'application/json'
  };
  if (TOKEN) {
    headers['Authorization'] = `Bearer ${TOKEN}`;
  }

  // 5. Importar cada produto
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Mapear dados do Excel para o formato da API
    // Seu Excel tem: CÓDIGO, DESCRIÇÃO, GRUPO, MARCA (sem coluna de preço)
    const codigo = row.CÓDIGO || row.codigo || row.Codigo || row.sku || row.SKU || `PROD${i + 1}`;
    const descricao = row.DESCRIÇÃO || row.Descricao || row.descricao || row.nome || row.Nome || '';
    const grupo = row.GRUPO || row.grupo || row.Grupo || '';
    const marca = row.MARCA || row.marca || row.Marca || '';

    // Usar preço padrão se não houver coluna de preço
    const precoVenda = parseFloat(row.precoVenda || row.PrecoVenda || row.preco_venda || row.preco || row.Preco || row.PREÇO || 100.00);
    const precoCusto = parseFloat(row.precoCusto || row.PrecoCusto || row.preco_custo || precoVenda * 0.7);

    const produto = {
      empresa: 1,
      estabelecimento: 1,
      codigo: codigo,
      idDistribuidor: parseInt(row.idDistribuidor || row.distribuidor || ID_DISTRIBUIDOR),
      idSegmento: parseInt(row.idSegmento || row.segmento || ID_SEGMENTO),
      idMarca: parseInt(row.idMarca || 1),
      idModelo: parseInt(row.idModelo || 1),
      idGrupo: parseInt(row.idGrupo || 1),
      idTag: parseInt(row.idTag || 1),
      nome: descricao.trim(),
      descricao: `${descricao} - Grupo: ${grupo} - Marca: ${marca}`.trim(),
      sku: codigo.trim(),
      ean: row.ean || row.EAN || row.codigoBarras || '',
      posicao: row.posicao || row.Posicao || '',
      situacao: SITUACAO,
      precoCusto: precoCusto,
      precoVenda: precoVenda,
      quantidade: parseInt(row.quantidade || row.Quantidade || row.estoque || row.Estoque || 10)
    };

    // Validar campos obrigatórios
    if (!produto.nome || produto.nome.length < 2) {
      errorCount++;
      console.log(`⚠️  [${i + 1}/${data.length}] Linha ignorada - nome inválido: "${produto.nome}"`);
      continue;
    }

    try {
      const response = await fetch(`${API_URL}/api/Produtos`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(produto),
        agent: agent
      });

      if (response.ok) {
        successCount++;
        const resultado = await response.json();
        console.log(`✅ [${i + 1}/${data.length}] "${produto.nome}" - ID: ${resultado.id}`);
      } else {
        errorCount++;
        const errorText = await response.text();
        console.error(`❌ [${i + 1}/${data.length}] "${produto.nome}" - ${response.status}`);
        errors.push({ produto: produto.nome, status: response.status, error: errorText.substring(0, 100) });
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${data.length}] "${produto.nome}" - ${error.message}`);
      errors.push({ produto: produto.nome, error: error.message });
    }

    // Pequeno delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 6. Resumo final
  console.log('\n========================================');
  console.log('🏁 IMPORTAÇÃO CONCLUÍDA!');
  console.log('========================================');
  console.log(`✅ Sucesso: ${successCount} produtos`);
  console.log(`❌ Erros: ${errorCount} produtos`);

  if (errors.length > 0 && errors.length <= 10) {
    console.log('\n📋 Detalhes dos erros:');
    console.table(errors);
  } else if (errors.length > 10) {
    console.log(`\n📋 ${errors.length} erros encontrados (mostrando primeiros 10):`);
    console.table(errors.slice(0, 10));
  }

  console.log('\n💡 Acesse a aplicação para ver os novos produtos!');
}

// Executar
importarProdutos().catch(error => {
  console.error('\n💥 Erro fatal:', error);
  process.exit(1);
});
