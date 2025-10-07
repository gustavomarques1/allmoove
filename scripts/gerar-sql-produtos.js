/**
 * Script para Gerar SQL de Produtos a partir do Excel
 *
 * Este script lê o Excel e gera um arquivo .sql com todos os INSERTs
 * para você executar direto no SQL Server
 *
 * Uso:
 *   node scripts/gerar-sql-produtos.js
 */

import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo Excel
const excelPath = path.join(__dirname, '..', 'excel', 'produtos.xlsx');
const sqlOutputPath = path.join(__dirname, '..', 'scripts', 'produtos-insert.sql');

console.log('🚀 Gerando script SQL a partir do Excel...\n');
console.log(`📁 Excel: ${excelPath}`);
console.log(`💾 SQL será salvo em: ${sqlOutputPath}\n`);

try {
  // 1. Ler arquivo Excel
  console.log('📖 Lendo arquivo Excel...');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Converter para JSON
  const dados = XLSX.utils.sheet_to_json(sheet);

  console.log(`✅ ${dados.length} produtos encontrados\n`);

  if (dados.length === 0) {
    console.log('⚠️  Nenhum dado encontrado no Excel!');
    process.exit(1);
  }

  // 2. Gerar SQL
  console.log('📝 Gerando comandos SQL...\n');

  let sqlContent = `-- =====================================================
-- Script de Carga de Produtos - WEFIX
-- =====================================================
-- Gerado automaticamente a partir do Excel
-- Total de produtos: ${dados.length}
-- Data: ${new Date().toLocaleString('pt-BR')}
-- =====================================================

USE [NomeDoBanco]; -- ALTERE PARA O NOME DO SEU BANCO
GO

-- Opcional: Limpar tabela antes (CUIDADO EM PRODUÇÃO!)
-- DELETE FROM PRODUTO;
-- DBCC CHECKIDENT ('PRODUTO', RESEED, 0);
-- GO

-- =====================================================
-- INSERÇÃO DE PRODUTOS
-- =====================================================

`;

  let sucessos = 0;
  let ignorados = 0;

  for (let i = 0; i < dados.length; i++) {
    const linha = dados[i];

    try {
      // Mapear campos
      const descricao = (linha['DESCRIÇÃO'] || linha.DESCRICAO || '').trim();
      const grupo = (linha.GRUPO || '').toLowerCase();
      const codigo = linha['CÓDIGO'] || linha.CODIGO || '';
      const marca = linha.MARCA || linha.marca || 'WEFIX';

      // Validar
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

      // Preço padrão (você ajusta depois)
      const preco = linha.Preco || linha.Price || linha.price || linha.PRECO || 99.90;

      // Imagem baseada na categoria
      const imagem = `/images/${categoria}/produto-${codigo.toLowerCase()}.png`;

      // Escapar aspas simples no SQL
      const nomeEscapado = descricao.replace(/'/g, "''");
      const fornecedorEscapado = marca.replace(/'/g, "''");

      // Gerar INSERT
      sqlContent += `INSERT INTO PRODUTO (Nome, Categoria, Price, Imagem, Fornecedor, DataCriacao, Ativo)\n`;
      sqlContent += `VALUES ('${nomeEscapado}', '${categoria}', ${preco}, '${imagem}', '${fornecedorEscapado}', GETUTCDATE(), 1);\n`;

      sucessos++;

      // Adicionar comentário a cada 50 produtos
      if ((i + 1) % 50 === 0) {
        sqlContent += `\n-- ${i + 1} produtos inseridos até aqui...\n\n`;
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
  sqlContent += `-- Verificar total de produtos inseridos\n`;
  sqlContent += `SELECT COUNT(*) AS TotalProdutos FROM PRODUTO;\n\n`;
  sqlContent += `-- Produtos por categoria\n`;
  sqlContent += `SELECT Categoria, COUNT(*) AS Total\n`;
  sqlContent += `FROM PRODUTO\n`;
  sqlContent += `GROUP BY Categoria\n`;
  sqlContent += `ORDER BY Categoria;\n\n`;
  sqlContent += `-- Produtos por fornecedor\n`;
  sqlContent += `SELECT Fornecedor, COUNT(*) AS Total\n`;
  sqlContent += `FROM PRODUTO\n`;
  sqlContent += `GROUP BY Fornecedor\n`;
  sqlContent += `ORDER BY Total DESC;\n\n`;
  sqlContent += `GO\n\n`;
  sqlContent += `PRINT '✅ Carga de produtos concluída!';\n`;
  sqlContent += `PRINT '📦 ${sucessos} produtos inseridos no banco de dados';\n`;
  sqlContent += `GO\n`;

  // 3. Salvar arquivo SQL
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
  console.log('   2. Conecte ao seu banco de dados');
  console.log('   3. Abra o arquivo: scripts/produtos-insert.sql');
  console.log('   4. Altere "NomeDoBanco" para o nome do seu banco');
  console.log('   5. Execute o script (F5)');
  console.log('\n🎉 Pronto! Seus produtos estarão no banco!\n');

} catch (error) {
  console.error('\n❌ ERRO:', error.message);

  if (error.code === 'ENOENT') {
    console.log('\n💡 O arquivo Excel não foi encontrado.');
    console.log(`   Certifique-se de que existe em: ${excelPath}`);
  } else {
    console.log('\n💡 Detalhes:', error);
  }
}
