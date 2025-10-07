/**
 * Script para Gerar SQL COMPLETO dos 702 Produtos
 * Com as colunas corretas do banco de dados
 */

import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', 'excel', 'produtos.xlsx');
const sqlOutputPath = path.join(__dirname, '..', 'scripts', 'produtos-completo.sql');

console.log('🚀 Gerando SQL completo de produtos...\n');

try {
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const dados = XLSX.utils.sheet_to_json(sheet);

  console.log(`✅ ${dados.length} produtos encontrados\n`);

  let sqlContent = `-- =====================================================
-- Carga COMPLETA de Produtos WEFIX - ${dados.length} produtos
-- =====================================================
-- Data: ${new Date().toLocaleString('pt-BR')}
-- =====================================================

USE [allmoove];
GO

-- LIMPAR produtos existentes (CUIDADO!)
-- DELETE FROM PRODUTO WHERE CODIGO LIKE 'W%' OR CODIGO LIKE 'M%';
-- GO

-- =====================================================
-- INSERÇÃO DOS ${dados.length} PRODUTOS
-- =====================================================

`;

  let sucessos = 0;
  let ignorados = 0;

  for (let i = 0; i < dados.length; i++) {
    const linha = dados[i];

    try {
      const descricao = (linha['DESCRIÇÃO'] || linha.DESCRICAO || '').trim();
      const grupo = (linha.GRUPO || '').toLowerCase();
      const codigo = linha['CÓDIGO'] || linha.CODIGO || '';
      const marca = linha.MARCA || linha.marca || 'WEFIX';

      if (!descricao || descricao === '') {
        ignorados++;
        continue;
      }

      // Mapear GRUPO para categoria
      let categoria = 'celulares';
      if (grupo.includes('apple')) categoria = 'celulares';
      else if (grupo.includes('samsung')) categoria = 'celulares';
      else if (grupo.includes('motorola')) categoria = 'celulares';
      else if (grupo.includes('xiaomi') || grupo.includes('redmi')) categoria = 'celulares';
      else if (grupo.includes('lg') || grupo.includes('display')) categoria = 'telas';
      else if (grupo.includes('cabo') || grupo.includes('carregador')) categoria = 'acessorios';
      else categoria = 'acessorios';

      const preco = linha.Preco || linha.Price || linha.price || linha.PRECO || 99.90;

      // Imagem baseada na categoria com rotação de 1-5
      const imagemNum = ((i % 5) + 1);
      let imagem = '';
      if (categoria === 'celulares') imagem = `/images/celulares/celular${imagemNum}.png`;
      else if (categoria === 'notebooks') imagem = `/images/notebooks/notebook${imagemNum}.png`;
      else if (categoria === 'telas') imagem = `/images/telas/tela${imagemNum}.png`;
      else imagem = `/images/acessorios/acessorio${imagemNum}.png`;

      const nomeEscapado = descricao.replace(/'/g, "''");
      const fornecedorEscapado = marca.replace(/'/g, "''");

      // Gerar INSERT com as colunas corretas
      sqlContent += `INSERT INTO PRODUTO (CODIGO, NOME, DESCRICAO, CATEGORIA, PRICE, SITUACAO, IMAGEM, FORNECEDOR, DATA_HORA_CRICAO_REGISTRO)\n`;
      sqlContent += `VALUES ('${codigo}', '${nomeEscapado}', '${nomeEscapado}', '${categoria}', ${preco}, 'ATIVO', '${imagem}', '${fornecedorEscapado}', GETDATE());\n`;

      sucessos++;

      if ((i + 1) % 50 === 0) {
        sqlContent += `\n-- ${i + 1} produtos inseridos...\n\n`;
      }

    } catch (error) {
      console.log(`⚠️  Erro ao processar linha ${i + 1}:`, error.message);
      ignorados++;
    }
  }

  sqlContent += `\nGO\n\n`;
  sqlContent += `-- =====================================================\n`;
  sqlContent += `-- VERIFICAÇÃO\n`;
  sqlContent += `-- =====================================================\n\n`;
  sqlContent += `SELECT COUNT(*) AS TotalProdutos FROM PRODUTO;\n\n`;
  sqlContent += `SELECT CATEGORIA, COUNT(*) AS Total\n`;
  sqlContent += `FROM PRODUTO\n`;
  sqlContent += `GROUP BY CATEGORIA\n`;
  sqlContent += `ORDER BY Total DESC;\n\n`;
  sqlContent += `SELECT FORNECEDOR, COUNT(*) AS Total\n`;
  sqlContent += `FROM PRODUTO\n`;
  sqlContent += `GROUP BY FORNECEDOR\n`;
  sqlContent += `ORDER BY Total DESC;\n\n`;
  sqlContent += `GO\n\n`;
  sqlContent += `PRINT '✅ ${sucessos} produtos importados com sucesso!';\n`;
  sqlContent += `GO\n`;

  fs.writeFileSync(sqlOutputPath, sqlContent, 'utf8');

  console.log('='.repeat(60));
  console.log('📊 RESULTADO:');
  console.log('='.repeat(60));
  console.log(`✅ Produtos processados: ${sucessos}`);
  console.log(`⏭️  Ignorados:           ${ignorados}`);
  console.log(`📦 Total no Excel:      ${dados.length}`);
  console.log('='.repeat(60));
  console.log(`\n💾 Arquivo SQL salvo em:`);
  console.log(`   ${sqlOutputPath}\n`);
  console.log('🎯 PRÓXIMO PASSO:');
  console.log('   1. Abra o SQL Server Management Studio');
  console.log('   2. Execute o arquivo: scripts/produtos-completo.sql');
  console.log(`   3. ${sucessos} produtos serão importados!`);
  console.log('\n🎉 Script pronto para execução!\n');

} catch (error) {
  console.error('\n❌ ERRO:', error.message);
}
