/**
 * API Test Configuration
 * Configuração centralizada para testes de API
 */

export const API_CONFIG = {
  baseURL: 'https://localhost:44370',
  timeout: 10000,

  // Credenciais de teste (ajuste conforme necessário)
  testCredentials: {
    assistenciaTecnica: {
      email: 'gustavocode.dev@gmail.com',
      password: 'Acessoapi123@'
    },
    distribuidor: {
      email: 'tech@allmoove.com',
      password: 'AllMoove@2024'
    }
  },

  // IDs de teste (ajuste após criar dados de teste no banco)
  testIds: {
    assistenciaId: 1,
    distribuidorId: 1,
    produtoId: 1,
    pedidoId: 1
  }
};

// Cores para output no console
export const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper para logging
export const logger = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  test: (msg) => console.log(`${COLORS.cyan}→${COLORS.reset} ${msg}`)
};
