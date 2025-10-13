/**
 * 🚀 Script Node.js para Importar Produtos do Excel para a API
 *
 * COMO USAR:
 * 1. npm install xlsx node-fetch
 * 2. node importar-excel.js
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

// Token - você precisa fazer login e colar aqui
// Ou deixe null e o script tentará sem autenticação
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
      console.log(`⚠️  [${i + 1}/${data.length}] Linha ignorada - nome ou preço inválido`);
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
        errors.push({ produto: produto.nome, status: response.status, error: errorText });
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

  if (errors.length > 0) {
    console.log('\n📋 Detalhes dos erros:');
    console.table(errors);
  }

  console.log('\n💡 Acesse a aplicação para ver os novos produtos!');
}

// Executar
importarProdutos().catch(error => {
  console.error('\n💥 Erro fatal:', error);
  process.exit(1);
});
