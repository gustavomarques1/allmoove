/**
 * Debug - Verificar formato exato da resposta de login
 */

import { axiosInstance } from './auth.test.js';
import { API_CONFIG } from './config.js';

async function debugLogin() {
  console.log('\n🔍 DEBUG - Verificando resposta de login...\n');

  try {
    const response = await axiosInstance.post('/api/account/loginuser', {
      email: API_CONFIG.testCredentials.assistenciaTecnica.email,
      password: API_CONFIG.testCredentials.assistenciaTecnica.password
    });

    console.log('✅ Login bem-sucedido!\n');
    console.log('📦 Resposta completa da API:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('\n📋 Campos disponíveis:', Object.keys(response.data));
    console.log('\n🔑 Token (primeiros 50 chars):', response.data.token?.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

debugLogin();
