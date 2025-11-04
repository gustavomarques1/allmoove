import api from '../api/api';
import logger from '../utils/logger';

/**
 * Serviço de gerenciamento de tokens JWT
 *
 * Funcionalidades:
 * - Armazenamento seguro de tokens
 * - Refresh automático de tokens
 * - Renovação proativa antes da expiração
 * - Retry de requisições após renovação
 */
class TokenService {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
    this.refreshTimer = null;
  }

  /**
   * Salva os tokens no localStorage
   * @param {Object} tokens - Objeto com token, refreshToken e expiresIn
   */
  setTokens({ token, access_token, refreshToken, refresh_token, expiresIn, expires_in, expiration }) {
    // Suporta ambos os formatos de nome (camelCase e snake_case)
    const accessToken = token || access_token;
    const refreshTk = refreshToken || refresh_token;
    const expiresInSeconds = expiresIn || expires_in || 3600;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshTk);

    // Calcula e salva o tempo de expiração
    let expirationTime;
    if (expiration) {
      // Se vier do backend, usa diretamente
      expirationTime = new Date(expiration);
    } else {
      // Senão, calcula baseado em expiresIn
      expirationTime = new Date();
      expirationTime.setSeconds(expirationTime.getSeconds() + expiresInSeconds);
    }
    localStorage.setItem('expiration', expirationTime.toISOString());

    // Agenda renovação proativa (80% do tempo de vida do token)
    this.scheduleProactiveRefresh(expiresInSeconds * 0.8);

    logger.info('✅ Tokens salvos com sucesso');
  }

  /**
   * Obtém o access token atual
   * @returns {string|null} Token de acesso
   */
  getAccessToken() {
    return localStorage.getItem('token');
  }

  /**
   * Obtém o refresh token atual
   * @returns {string|null} Token de refresh
   */
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Verifica se o token está expirado
   * @returns {boolean} True se expirado
   */
  isTokenExpired() {
    const expiration = localStorage.getItem('expiration');
    if (!expiration) return true;

    const expirationDate = new Date(expiration);
    const now = new Date();

    // Considera expirado se falta menos de 1 minuto
    const bufferTime = 60 * 1000; // 1 minuto em ms
    return (expirationDate.getTime() - now.getTime()) < bufferTime;
  }

  /**
   * Agenda renovação automática do token
   * @param {number} secondsBeforeExpiry - Segundos antes da expiração
   */
  scheduleProactiveRefresh(secondsBeforeExpiry) {
    // Cancela timer anterior se existir
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const milliseconds = secondsBeforeExpiry * 1000;

    this.refreshTimer = setTimeout(() => {
      logger.info('⏰ Renovação proativa do token iniciada');
      this.refreshToken().catch(error => {
        logger.error('❌ Falha na renovação proativa:', error);
      });
    }, milliseconds);

    logger.info(`⏱️ Renovação agendada para ${secondsBeforeExpiry / 60} minutos`);
  }

  /**
   * Processa fila de requisições que falharam por token expirado
   * @param {string} newToken - Novo token obtido
   */
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Renova o token usando o refresh token
   * @returns {Promise} Promise com o novo token
   */
  async refreshToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      logger.error('❌ Refresh token não encontrado');
      this.clearTokens();
      window.location.href = '/';
      return Promise.reject('No refresh token available');
    }

    // Se já está refreshing, aguarda na fila
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;
    logger.info('🔄 Iniciando refresh do token...');

    try {
      const response = await api.post('/api/account/RefreshToken', {
        refreshToken: refreshToken  // Backend espera camelCase
      }, {
        // Importante: não enviar o Authorization header aqui
        transformRequest: [(data, headers) => {
          delete headers.Authorization;
          return JSON.stringify(data);
        }],
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Backend retorna no formato camelCase
      const { token, refreshToken: newRefreshToken, expiresIn, expiration } = response.data;

      // Salva os novos tokens
      this.setTokens({
        token,
        refreshToken: newRefreshToken || refreshToken, // Mantém o antigo se não vier novo
        expiresIn: expiresIn || 3600, // Default 1 hora
        expiration
      });

      // Processa fila de requisições pendentes
      this.processQueue(null, token);

      logger.info('✅ Token renovado com sucesso');
      return token;

    } catch (error) {
      logger.error('❌ Erro ao renovar token:', error);

      // Se falhar, limpa tokens e redireciona para login
      this.processQueue(error, null);
      this.clearTokens();

      // Redireciona para login apenas se não for erro de rede
      if (error.response && error.response.status === 401) {
        window.location.href = '/';
      }

      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Limpa todos os tokens e cancela timers
   */
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('email');
    localStorage.removeItem('idPessoa');
    localStorage.removeItem('idDistribuidor');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    logger.info('🧹 Tokens limpos');
  }

  /**
   * Tenta executar uma requisição, renovando o token se necessário
   * @param {Function} requestCallback - Função que faz a requisição
   * @returns {Promise} Resultado da requisição
   */
  async executeWithTokenRefresh(requestCallback) {
    try {
      // Verifica se o token está expirado antes de tentar
      if (this.isTokenExpired()) {
        logger.info('⚠️ Token expirado, renovando antes da requisição...');
        await this.refreshToken();
      }

      // Executa a requisição
      return await requestCallback();

    } catch (error) {
      // Se falhou por 401, tenta renovar e executar novamente
      if (error.response && error.response.status === 401) {
        logger.info('🔄 Requisição falhou com 401, tentando renovar token...');

        try {
          await this.refreshToken();
          // Tenta novamente com o novo token
          return await requestCallback();
        } catch (refreshError) {
          logger.error('❌ Falha após renovação do token:', refreshError);
          throw refreshError;
        }
      }

      throw error;
    }
  }

  /**
   * Obtém tempo restante até expiração em segundos
   * @returns {number} Segundos até expiração (0 se expirado)
   */
  getTimeUntilExpiration() {
    const expiration = localStorage.getItem('expiration');
    if (!expiration) return 0;

    const expirationDate = new Date(expiration);
    const now = new Date();
    const diff = expirationDate.getTime() - now.getTime();

    return diff > 0 ? Math.floor(diff / 1000) : 0;
  }

  /**
   * Formata tempo restante para display
   * @returns {string} Tempo formatado (ex: "5m 30s")
   */
  getFormattedTimeUntilExpiration() {
    const seconds = this.getTimeUntilExpiration();

    if (seconds <= 0) return 'Expirado';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

// Exporta instância única (Singleton)
const tokenService = new TokenService();

// Disponibiliza globalmente para debug
if (typeof window !== 'undefined') {
  window.tokenService = tokenService;

  // Adiciona comandos úteis no console
  window.tokenInfo = () => {
    console.log('🔐 === Token Info ===');
    console.log('📍 Access Token:', tokenService.getAccessToken() ? 'Presente' : 'Ausente');
    console.log('🔄 Refresh Token:', tokenService.getRefreshToken() ? 'Presente' : 'Ausente');
    console.log('⏰ Expirado:', tokenService.isTokenExpired() ? 'Sim' : 'Não');
    console.log('⏱️ Tempo restante:', tokenService.getFormattedTimeUntilExpiration());
    console.log('🔄 Refreshing:', tokenService.isRefreshing ? 'Sim' : 'Não');
    console.log('📋 Fila de espera:', tokenService.failedQueue.length, 'requisições');
  };

  console.log('%c🔐 Token Service carregado! Use window.tokenInfo() para ver status', 'color: #4CAF50; font-weight: bold');
}

export default tokenService;