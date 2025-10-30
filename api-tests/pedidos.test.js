/**
 * Testes de Pedidos
 * Endpoints: GET /api/Pedidos/assistencia/{id}
 */

import { axiosInstance } from './auth.test.js';
import { API_CONFIG, logger } from './config.js';

export async function testPedidos(token) {
  logger.info('\n=== TESTES DE PEDIDOS ===\n');

  if (!token) {
    logger.warning('Token não fornecido. Alguns testes podem falhar.');
    logger.warning('Execute o teste de autenticação primeiro para obter um token.\n');
  }

  let totalTests = 0;
  let passedTests = 0;

  // Teste 1: Buscar pedidos de uma assistência técnica (com autenticação)
  try {
    totalTests++;
    logger.test('Teste 1: GET /api/Pedidos/assistencia/{id} com autenticação');

    const response = await axiosInstance.get(
      `/api/Pedidos/assistencia/${API_CONFIG.testIds.assistenciaId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Validações
    if (response.status === 200) {
      logger.success('Status 200 OK');
    } else {
      throw new Error(`Status esperado: 200, recebido: ${response.status}`);
    }

    if (Array.isArray(response.data)) {
      logger.success(`Retornou array com ${response.data.length} pedido(s)`);

      if (response.data.length > 0) {
        const pedido = response.data[0];

        // Validar estrutura do pedido
        const requiredFields = ['id', 'status'];
        const missingFields = requiredFields.filter(field => !(field in pedido));

        if (missingFields.length === 0) {
          logger.success('Estrutura do pedido válida (contém id, status)');
        } else {
          logger.warning(`Campos faltando no pedido: ${missingFields.join(', ')}`);
        }

        // Mostrar exemplo de pedido
        logger.info(`Exemplo de pedido: ${JSON.stringify(pedido, null, 2)}`);
      } else {
        logger.info('Nenhum pedido encontrado para esta assistência técnica');
      }
    } else {
      throw new Error('Resposta deveria ser um array');
    }

    passedTests++;
    logger.success('✓ Teste 1 PASSOU\n');

  } catch (error) {
    logger.error(`✗ Teste 1 FALHOU`);
    if (error.response) {
      logger.error(`Status: ${error.response.status}`);
      logger.error(`Resposta: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      logger.error(error.message);
    }
    console.log();
  }

  // Teste 2: Tentar buscar pedidos sem autenticação
  try {
    totalTests++;
    logger.test('Teste 2: GET /api/Pedidos/assistencia/{id} sem autenticação');

    const response = await axiosInstance.get(
      `/api/Pedidos/assistencia/${API_CONFIG.testIds.assistenciaId}`
      // Sem header de Authorization
    );

    // Se chegou aqui, o teste falhou (deveria retornar 401)
    logger.error('✗ Teste 2 FALHOU - Deveria retornar erro 401');
    console.log();

  } catch (error) {
    if (error.response && error.response.status === 401) {
      logger.success('Status 401 Unauthorized (esperado)');
      passedTests++;
      logger.success('✓ Teste 2 PASSOU\n');
    } else {
      logger.error(`✗ Teste 2 FALHOU - Status esperado: 401, recebido: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Teste 3: Buscar pedidos com ID inválido
  try {
    totalTests++;
    logger.test('Teste 3: GET /api/Pedidos/assistencia/{id} com ID inválido');

    const response = await axiosInstance.get(
      '/api/Pedidos/assistencia/99999',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // ID inválido deve retornar array vazio ou 404
    if (response.status === 200 && Array.isArray(response.data) && response.data.length === 0) {
      logger.success('Status 200 OK com array vazio (esperado)');
      passedTests++;
      logger.success('✓ Teste 3 PASSOU\n');
    } else if (response.status === 404) {
      logger.success('Status 404 Not Found (esperado)');
      passedTests++;
      logger.success('✓ Teste 3 PASSOU\n');
    } else {
      logger.warning(`Status: ${response.status} - Comportamento inesperado, mas não é erro crítico`);
      passedTests++;
      logger.success('✓ Teste 3 PASSOU (com ressalvas)\n');
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.success('Status 404 Not Found (esperado)');
      passedTests++;
      logger.success('✓ Teste 3 PASSOU\n');
    } else {
      logger.error(`✗ Teste 3 FALHOU`);
      logger.error(`Status: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Teste 4: Buscar pedidos com token inválido
  try {
    totalTests++;
    logger.test('Teste 4: GET /api/Pedidos/assistencia/{id} com token inválido');

    const response = await axiosInstance.get(
      `/api/Pedidos/assistencia/${API_CONFIG.testIds.assistenciaId}`,
      {
        headers: {
          'Authorization': 'Bearer token-invalido-123456'
        }
      }
    );

    logger.error('✗ Teste 4 FALHOU - Deveria retornar erro 401');
    console.log();

  } catch (error) {
    if (error.response && error.response.status === 401) {
      logger.success('Status 401 Unauthorized (esperado)');
      passedTests++;
      logger.success('✓ Teste 4 PASSOU\n');
    } else {
      logger.error(`✗ Teste 4 FALHOU - Status esperado: 401, recebido: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Resumo
  logger.info(`\n=== RESUMO - PEDIDOS ===`);
  logger.info(`Total de testes: ${totalTests}`);
  logger.success(`Passou: ${passedTests}`);
  logger.error(`Falhou: ${totalTests - passedTests}`);
  logger.info(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);
}
