/**
 * Testes de Produtos
 * Endpoints relacionados a produtos
 */

import { axiosInstance } from './auth.test.js';
import { API_CONFIG, logger } from './config.js';

export async function testProdutos(token) {
  logger.info('\n=== TESTES DE PRODUTOS ===\n');

  let totalTests = 0;
  let passedTests = 0;

  // Teste 1: Listar todos os produtos (se o endpoint existir)
  try {
    totalTests++;
    logger.test('Teste 1: GET /api/produtos - Listar todos os produtos');

    const response = await axiosInstance.get('/api/produtos');

    if (response.status === 200) {
      logger.success('Status 200 OK');

      if (Array.isArray(response.data)) {
        logger.success(`Retornou array com ${response.data.length} produto(s)`);

        if (response.data.length > 0) {
          const produto = response.data[0];

          // Validar estrutura do produto
          const expectedFields = ['id', 'nome', 'price', 'categoria'];
          const hasFields = expectedFields.filter(field => field in produto);

          logger.info(`Campos encontrados: ${hasFields.join(', ')}`);

          if (hasFields.length >= 2) {
            logger.success('Estrutura do produto válida');
          } else {
            logger.warning('Estrutura do produto pode estar incompleta');
          }

          // Mostrar exemplo de produto
          logger.info(`Exemplo de produto: ${JSON.stringify(produto, null, 2)}`);
        } else {
          logger.info('Nenhum produto cadastrado no banco');
        }

        passedTests++;
        logger.success('✓ Teste 1 PASSOU\n');
      } else {
        logger.error('Resposta deveria ser um array');
        logger.error(`Resposta: ${JSON.stringify(response.data)}`);
        console.log();
      }
    } else {
      throw new Error(`Status esperado: 200, recebido: ${response.status}`);
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warning('✗ Teste 1: Endpoint /api/produtos não encontrado (404)');
      logger.info('Nota: Este endpoint pode não estar implementado ainda.\n');
    } else {
      logger.error(`✗ Teste 1 FALHOU`);
      if (error.response) {
        logger.error(`Status: ${error.response.status}`);
        logger.error(`Resposta: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        logger.error(error.message);
      }
    }
    console.log();
  }

  // Teste 2: Buscar produto por ID (se o endpoint existir)
  try {
    totalTests++;
    logger.test(`Teste 2: GET /api/produtos/${API_CONFIG.testIds.produtoId} - Buscar produto por ID`);

    const response = await axiosInstance.get(`/api/produtos/${API_CONFIG.testIds.produtoId}`);

    if (response.status === 200) {
      logger.success('Status 200 OK');

      if (response.data && typeof response.data === 'object') {
        logger.success('Produto encontrado');

        // Validar que tem ID
        if (response.data.id) {
          logger.success(`ID do produto: ${response.data.id}`);
        }

        if (response.data.nome) {
          logger.success(`Nome do produto: ${response.data.nome}`);
        }

        if (response.data.price !== undefined) {
          logger.success(`Preço: R$ ${response.data.price}`);
        }

        passedTests++;
        logger.success('✓ Teste 2 PASSOU\n');
      } else {
        logger.error('Resposta deveria ser um objeto');
        console.log();
      }
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warning('✗ Teste 2: Endpoint ou produto não encontrado (404)');
      logger.info('Nota: Verifique se o produto existe no banco ou se o endpoint está implementado.\n');
    } else {
      logger.error(`✗ Teste 2 FALHOU`);
      if (error.response) {
        logger.error(`Status: ${error.response.status}`);
      } else {
        logger.error(error.message);
      }
      console.log();
    }
  }

  // Teste 3: Buscar produtos por categoria (se o endpoint existir)
  try {
    totalTests++;
    logger.test('Teste 3: GET /api/produtos?categoria=celulares - Filtrar por categoria');

    const response = await axiosInstance.get('/api/produtos', {
      params: { categoria: 'celulares' }
    });

    if (response.status === 200) {
      logger.success('Status 200 OK');

      if (Array.isArray(response.data)) {
        const celulares = response.data.filter(p => p.categoria === 'celulares');
        logger.success(`Produtos na categoria "celulares": ${celulares.length}`);

        if (celulares.length > 0) {
          logger.success('Filtro de categoria funcionando corretamente');
          passedTests++;
          logger.success('✓ Teste 3 PASSOU\n');
        } else if (response.data.length === 0) {
          logger.info('Nenhum produto encontrado na categoria "celulares"');
          passedTests++;
          logger.success('✓ Teste 3 PASSOU (sem dados)\n');
        } else {
          logger.warning('Filtro pode não estar funcionando - retornou produtos de outras categorias');
          console.log();
        }
      } else {
        logger.error('Resposta deveria ser um array');
        console.log();
      }
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warning('✗ Teste 3: Endpoint não encontrado (404)');
      logger.info('Nota: Filtro por categoria pode não estar implementado.\n');
    } else {
      logger.error(`✗ Teste 3 FALHOU`);
      if (error.response) {
        logger.error(`Status: ${error.response.status}`);
      } else {
        logger.error(error.message);
      }
      console.log();
    }
  }

  // Teste 4: Buscar produtos do distribuidor (se o endpoint existir)
  try {
    totalTests++;
    logger.test(`Teste 4: GET /api/distribuidores/${API_CONFIG.testIds.distribuidorId}/produtos`);

    const response = await axiosInstance.get(
      `/api/distribuidores/${API_CONFIG.testIds.distribuidorId}/produtos`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );

    if (response.status === 200) {
      logger.success('Status 200 OK');

      if (Array.isArray(response.data)) {
        logger.success(`Retornou ${response.data.length} produto(s) do distribuidor`);
        passedTests++;
        logger.success('✓ Teste 4 PASSOU\n');
      } else {
        logger.error('Resposta deveria ser um array');
        console.log();
      }
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warning('✗ Teste 4: Endpoint não encontrado (404)');
      logger.info('Nota: Endpoint de produtos por distribuidor pode não estar implementado.\n');
    } else {
      logger.error(`✗ Teste 4 FALHOU`);
      if (error.response) {
        logger.error(`Status: ${error.response.status}`);
      } else {
        logger.error(error.message);
      }
      console.log();
    }
  }

  // Resumo
  logger.info(`\n=== RESUMO - PRODUTOS ===`);
  logger.info(`Total de testes: ${totalTests}`);
  logger.success(`Passou: ${passedTests}`);
  logger.error(`Falhou: ${totalTests - passedTests}`);
  if (passedTests > 0) {
    logger.info(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);
  } else {
    logger.warning('Nenhum teste passou - os endpoints de produtos podem não estar implementados ainda.\n');
  }
}
