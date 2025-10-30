/**
 * Testes de Autenticação
 * Endpoint: POST /api/account/loginuser
 */

import axios from 'axios';
import https from 'https';
import { API_CONFIG, logger } from './config.js';

// Configurar axios para aceitar certificados SSL auto-assinados (apenas para dev/teste)
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

export async function testLogin() {
  logger.info('\n=== TESTES DE AUTENTICAÇÃO ===\n');

  let totalTests = 0;
  let passedTests = 0;

  // Teste 1: Login com credenciais válidas
  try {
    totalTests++;
    logger.test('Teste 1: Login com credenciais válidas');

    const response = await axiosInstance.post('/api/account/loginuser', {
      email: API_CONFIG.testCredentials.assistenciaTecnica.email,
      password: API_CONFIG.testCredentials.assistenciaTecnica.password
    });

    // Validações
    if (response.status === 200) {
      logger.success('Status 200 OK');
    } else {
      throw new Error(`Status esperado: 200, recebido: ${response.status}`);
    }

    if (response.data.token) {
      logger.success('Token JWT recebido');
    } else {
      throw new Error('Token não encontrado na resposta');
    }

    if (response.data.expiration) {
      logger.success(`Expiração: ${response.data.expiration}`);
    } else {
      throw new Error('Data de expiração não encontrada');
    }

    // Verificar formato do token JWT
    const tokenParts = response.data.token.split('.');
    if (tokenParts.length === 3) {
      logger.success('Token JWT no formato correto (3 partes)');
    } else {
      throw new Error('Token JWT em formato inválido');
    }

    passedTests++;
    logger.success('✓ Teste 1 PASSOU\n');

    // Retornar token para uso em outros testes
    return response.data.token;

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

  // Teste 2: Login com credenciais inválidas (senha errada)
  try {
    totalTests++;
    logger.test('Teste 2: Login com senha incorreta');

    const response = await axiosInstance.post('/api/account/loginuser', {
      email: API_CONFIG.testCredentials.assistenciaTecnica.email,
      password: 'SenhaErrada123!'
    });

    // Se chegou aqui sem erro, o teste falhou (deveria retornar 401)
    logger.error('✗ Teste 2 FALHOU - Deveria retornar erro 401');
    console.log();

  } catch (error) {
    if (error.response && error.response.status === 401) {
      logger.success('Status 401 Unauthorized (esperado)');
      logger.success('Mensagem: ' + (error.response.data.message || 'Credenciais inválidas'));
      passedTests++;
      logger.success('✓ Teste 2 PASSOU\n');
    } else {
      logger.error(`✗ Teste 2 FALHOU - Status esperado: 401, recebido: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Teste 3: Login com email inexistente
  try {
    totalTests++;
    logger.test('Teste 3: Login com email inexistente');

    const response = await axiosInstance.post('/api/account/loginuser', {
      email: 'naoexiste@exemplo.com',
      password: 'SenhaQualquer123!'
    });

    logger.error('✗ Teste 3 FALHOU - Deveria retornar erro 401');
    console.log();

  } catch (error) {
    if (error.response && error.response.status === 401) {
      logger.success('Status 401 Unauthorized (esperado)');
      passedTests++;
      logger.success('✓ Teste 3 PASSOU\n');
    } else {
      logger.error(`✗ Teste 3 FALHOU - Status esperado: 401, recebido: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Teste 4: Login sem enviar dados
  try {
    totalTests++;
    logger.test('Teste 4: Login sem enviar email/password');

    const response = await axiosInstance.post('/api/account/loginuser', {});

    logger.error('✗ Teste 4 FALHOU - Deveria retornar erro 400');
    console.log();

  } catch (error) {
    if (error.response && (error.response.status === 400 || error.response.status === 401)) {
      logger.success(`Status ${error.response.status} (esperado - Bad Request ou Unauthorized)`);
      passedTests++;
      logger.success('✓ Teste 4 PASSOU\n');
    } else {
      logger.error(`✗ Teste 4 FALHOU - Status esperado: 400/401, recebido: ${error.response?.status || 'N/A'}`);
      console.log();
    }
  }

  // Resumo
  logger.info(`\n=== RESUMO - AUTENTICAÇÃO ===`);
  logger.info(`Total de testes: ${totalTests}`);
  logger.success(`Passou: ${passedTests}`);
  logger.error(`Falhou: ${totalTests - passedTests}`);
  logger.info(`Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

  return null;
}

// Exportar instância do axios para uso em outros testes
export { axiosInstance };
