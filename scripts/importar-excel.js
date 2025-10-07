/**
 * Script de Importação de Produtos via Excel
 *
 * Este script lê o arquivo Excel (produtos.xlsx) e importa os produtos
 * para a API do backend em https://localhost:44370/api/Produtos
 *
 * Uso:
 *   node scripts/importar-excel.js
 */

import XLSX from 'xlsx';
import axios from 'axios';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração da API
const API_URL = 'https://localhost:44370/api/Produtos';

// Ignorar certificado SSL em desenvolvimento
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Caminho do arquivo Excel
const excelPath = path.join(__dirname, '..', 'excel', 'produtos.xlsx');

console.log('🚀 Iniciando importação de produtos do Excel...\n');
console.log(`📁 Arquivo: ${excelPath}\n`);

// Estatísticas
let importados = 0;
let erros = 0;
let jaExistentes = 0;

async function importarProdutos() {
  try {
    // 1. Ler arquivo Excel
    console.log('📖 Lendo arquivo Excel...');
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0]; // Primeira aba
    const sheet = workbook.Sheets[sheetName];

    // Converter para JSON
    const dados = XLSX.utils.sheet_to_json(sheet);

    console.log(`✅ ${dados.length} linhas encontradas no Excel\n`);

    if (dados.length === 0) {
      console.log('⚠️  Nenhum dado encontrado no Excel!');
      return;
    }

    // Mostrar exemplo da primeira linha para verificar estrutura
    console.log('📋 Estrutura detectada (primeira linha):');
    console.log(JSON.stringify(dados[0], null, 2));
    console.log('\n' + '='.repeat(60) + '\n');

    // 2. Importar cada produto (TESTE: apenas 5 produtos)
    const LIMITE_TESTE = 5;
    const totalParaImportar = Math.min(dados.length, LIMITE_TESTE);

    console.log(`⚠️  MODO TESTE: Importando apenas ${totalParaImportar} produtos\n`);

    for (let i = 0; i < totalParaImportar; i++) {
      const linha = dados[i];

      try {
        // Mapear campos do Excel para o modelo de Produto
        const descricao = linha['DESCRIÇÃO'] || linha.DESCRICAO || '';
        const grupo = (linha.GRUPO || '').toLowerCase();
        const codigo = linha['CÓDIGO'] || linha.CODIGO || '';

        // Mapear GRUPO para categoria
        let categoria = 'celulares'; // padrão
        if (grupo.includes('apple')) categoria = 'celulares';
        else if (grupo.includes('samsung')) categoria = 'celulares';
        else if (grupo.includes('motorola')) categoria = 'celulares';
        else if (grupo.includes('xiaomi') || grupo.includes('redmi')) categoria = 'celulares';
        else if (grupo.includes('lg')) categoria = 'telas';
        else categoria = 'acessorios';

        // Preço padrão (você pode ajustar depois no banco)
        const preco = linha.Preco || linha.Price || linha.price || linha.PRECO || 99.90;

        // Imagem baseada na categoria
        const imagem = `/images/${categoria}/produto-${codigo.toLowerCase()}.png`;

        const produto = {
          nome: descricao,
          categoria: categoria,
          price: parseFloat(preco),
          imagem: imagem,
          fornecedor: linha.MARCA || linha.marca || 'WEFIX'
        };

        // Validar dados obrigatórios
        if (!produto.nome || produto.nome.trim() === '') {
          console.log(`⏭️  [${i + 1}] Linha ignorada - Sem descrição`);
          erros++;
          continue;
        }

        // Enviar para API
        const response = await axios.post(API_URL, produto, {
          httpsAgent,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(`✅ [${i + 1}/${dados.length}] ${produto.nome} - R$ ${produto.price.toFixed(2)}`);
        importados++;

      } catch (error) {
        if (error.response?.status === 409 || error.response?.status === 400) {
          console.log(`⏭️  [${i + 1}] ${linha.Nome || 'Produto'} - Já existe ou inválido`);
          jaExistentes++;
        } else {
          console.log(`❌ [${i + 1}] Erro ao importar ${linha.Nome || 'produto'}:`, error.message);
          erros++;
        }
      }

      // Pequeno delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 3. Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DA IMPORTAÇÃO:');
    console.log('='.repeat(60));
    console.log(`✅ Importados:     ${importados}`);
    console.log(`⏭️  Já existentes:  ${jaExistentes}`);
    console.log(`❌ Erros:          ${erros}`);
    console.log(`📦 Total:          ${dados.length}`);
    console.log('='.repeat(60));

    if (importados > 0) {
      console.log('\n🎉 Importação concluída com sucesso!\n');
    } else {
      console.log('\n⚠️  Nenhum produto foi importado. Verifique o arquivo Excel.\n');
    }

  } catch (error) {
    console.error('\n❌ ERRO FATAL:', error.message);

    if (error.code === 'ENOENT') {
      console.log('\n💡 O arquivo Excel não foi encontrado.');
      console.log(`   Certifique-se de que existe em: ${excelPath}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Não foi possível conectar à API.');
      console.log('   Certifique-se de que o backend está rodando em https://localhost:44370/');
    } else {
      console.log('\n💡 Detalhes do erro:', error);
    }
  }
}

// Executar importação
importarProdutos();
