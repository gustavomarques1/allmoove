/**
 * Script para importar produtos do JSON para o backend via API
 *
 * USO:
 * node scripts/importar-produtos.js
 *
 * REQUISITOS:
 * - Backend ASP.NET Core rodando em https://localhost:44370/
 * - Endpoint POST /api/Produtos implementado
 * - Autenticação configurada (ou endpoint público para seed)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuração
const API_BASE_URL = 'https://localhost:44370';
const PRODUCTS_FILE = path.join(__dirname, '../public/data/products.json');

// Token de autenticação (se necessário)
// Obter fazendo login primeiro ou usar token de admin
const AUTH_TOKEN = process.env.API_TOKEN || null;

/**
 * Faz requisição HTTP
 */
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    // Ignora certificado SSL auto-assinado (apenas dev)
    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const req = https.request({ ...options, agent }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Importa um produto
 */
async function importarProduto(produto) {
  const options = {
    hostname: 'localhost',
    port: 44370,
    path: '/api/Produtos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Adiciona autenticação se disponível
  if (AUTH_TOKEN) {
    options.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  try {
    const result = await makeRequest(options, produto);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Verifica se produto já existe
 */
async function produtoExiste(produtoId) {
  const options = {
    hostname: 'localhost',
    port: 44370,
    path: `/api/Produtos/${produtoId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (AUTH_TOKEN) {
    options.headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  try {
    await makeRequest(options);
    return true;
  } catch {
    return false;
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Iniciando importação de produtos...\n');

  // Lê arquivo JSON
  if (!fs.existsSync(PRODUCTS_FILE)) {
    console.error(`❌ Arquivo não encontrado: ${PRODUCTS_FILE}`);
    process.exit(1);
  }

  const produtos = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  console.log(`📦 ${produtos.length} produtos encontrados no JSON\n`);

  // Estatísticas
  let importados = 0;
  let ja_existentes = 0;
  let erros = 0;

  // Importa cada produto
  for (const produto of produtos) {
    process.stdout.write(`[${produto.id}] ${produto.nome}... `);

    // Verifica se já existe (opcional)
    const existe = await produtoExiste(produto.id);
    if (existe) {
      console.log('⏭️  Já existe');
      ja_existentes++;
      continue;
    }

    // Importa
    const resultado = await importarProduto(produto);

    if (resultado.success) {
      console.log('✅ Importado');
      importados++;
    } else {
      console.log(`❌ Erro: ${resultado.error}`);
      erros++;
    }

    // Delay para não sobrecarregar API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Resumo
  console.log('\n' + '='.repeat(50));
  console.log('📊 Resumo da Importação:');
  console.log('='.repeat(50));
  console.log(`✅ Importados:     ${importados}`);
  console.log(`⏭️  Já existentes:  ${ja_existentes}`);
  console.log(`❌ Erros:          ${erros}`);
  console.log(`📦 Total:          ${produtos.length}`);
  console.log('='.repeat(50));

  if (erros > 0) {
    console.log('\n⚠️  Houve erros durante a importação.');
    console.log('Verifique se o backend está rodando e os endpoints estão implementados.');
  } else {
    console.log('\n🎉 Importação concluída com sucesso!');
  }
}

// Executa
main().catch((error) => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
