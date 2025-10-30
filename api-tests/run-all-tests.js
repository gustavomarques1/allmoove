/**
 * AllMoove API Tests Runner
 *
 * Script principal para executar todos os testes de API
 *
 * Como executar:
 * 1. Certifique-se de que a API está rodando em https://localhost:44370/
 * 2. Execute: node api-tests/run-all-tests.js
 */

import { testLogin } from './auth.test.js';
import { testPedidos } from './pedidos.test.js';
import { testProdutos } from './produtos.test.js';
import { logger, COLORS } from './config.js';

async function runAllTests() {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('          ALLMOOVE - TESTE DE APIs                    ');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`${COLORS.cyan}Iniciando testes em: ${new Date().toLocaleString('pt-BR')}${COLORS.reset}`);
  console.log('═══════════════════════════════════════════════════════\n');

  logger.info('🔧 Configuração:');
  logger.info(`   Base URL: https://localhost:44370/`);
  logger.info(`   Timeout: 10 segundos`);
  console.log();

  logger.warning('⚠️  IMPORTANTE:');
  logger.warning('   1. Certifique-se de que a API backend está rodando');
  logger.warning('   2. Ajuste as credenciais em api-tests/config.js se necessário');
  logger.warning('   3. Ajuste os IDs de teste em api-tests/config.js conforme seu banco');
  console.log();

  const startTime = Date.now();
  let token = null;

  try {
    // 1. Testes de Autenticação
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    token = await testLogin();
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Aguardar um pouco entre os testes
    await sleep(1000);

    // 2. Testes de Pedidos
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await testPedidos(token);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await sleep(1000);

    // 3. Testes de Produtos
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await testProdutos(token);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    logger.error(`\n❌ Erro fatal durante a execução dos testes:`);
    logger.error(error.message);
    console.error(error);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Resumo final
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('                  RESUMO FINAL                         ');
  console.log('═══════════════════════════════════════════════════════');
  logger.info(`⏱️  Tempo total de execução: ${duration} segundos`);
  logger.info(`📅 Finalizado em: ${new Date().toLocaleString('pt-BR')}`);
  console.log('═══════════════════════════════════════════════════════\n');

  logger.info('💡 Próximos passos:');
  logger.info('   - Se testes falharam: verifique se a API está rodando');
  logger.info('   - Ajuste credenciais e IDs em api-tests/config.js');
  logger.info('   - Verifique logs do backend para mais detalhes');
  logger.info('   - Execute testes individuais: node api-tests/auth.test.js');
  console.log();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Executar testes
runAllTests().catch(error => {
  logger.error('Erro ao executar testes:');
  console.error(error);
  process.exit(1);
});
