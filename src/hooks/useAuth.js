import { useState, useEffect } from 'react';
import api from '../api/api';
import logger from '../utils/logger';
import tokenService from '../services/tokenService';

/**
 * Hook customizado para gerenciar autenticação e roles/papéis do usuário
 *
 * Papéis disponíveis:
 * - ASSISTENCIA_TECNICA: Assistências técnicas que fazem pedidos
 * - DISTRIBUIDOR: Distribuidores que gerenciam pedidos e estoque
 * - ENTREGADOR: Entregadores que realizam as entregas
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação ao carregar o hook
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verifica se o usuário está autenticado checando localStorage
   */
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const expiration = localStorage.getItem('expiration');
      const storedEmail = localStorage.getItem('email');
      const storedUserId = localStorage.getItem('idPessoa');
      const storedUserRole = localStorage.getItem('userRole');
      const storedUserName = localStorage.getItem('userName');

      if (token && expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();

        // Verifica se o token expirou
        if (expirationDate > now) {
          setIsAuthenticated(true);
          setUserEmail(storedEmail);
          setUserId(storedUserId ? parseInt(storedUserId) : null);
          setUserRole(storedUserRole);
          setUserName(storedUserName);
        } else {
          // Token expirado, fazer logout
          logout();
        }
      }
    } catch (error) {
      logger.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<{success: boolean, error?: string, role?: string}>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      // 1. Autenticar com a API
      const loginResponse = await api.post('/api/account/LoginUser', {
        email,
        password
      });

      // Backend pode retornar Token (antigo) ou token (novo)
      const tokenData = loginResponse.data;
      const accessToken = tokenData.token || tokenData.Token;
      const refreshToken = tokenData.refreshToken || tokenData.RefreshToken;
      const expiration = tokenData.expiration || tokenData.Expiration;
      const expiresIn = tokenData.expiresIn || tokenData.ExpiresIn;

      // Se refresh token estiver disponível, usa tokenService
      if (refreshToken) {
        tokenService.setTokens({
          token: accessToken,
          refreshToken: refreshToken,
          expiresIn: expiresIn || 3600,
          expiration: expiration
        });
      } else {
        // Fallback: modo antigo sem refresh token
        console.warn('⚠️ Backend não retornou refresh token, usando modo compatibilidade');
        localStorage.setItem('token', accessToken);
        localStorage.setItem('expiration', expiration || new Date(Date.now() + 3600000).toISOString());
      }

      // Salva email separadamente
      localStorage.setItem('email', email);

      // 2. Buscar dados da pessoa para obter o papel (role)
      try {
        // O token já é adicionado automaticamente pelo interceptor do api.js
        const pessoasResponse = await api.get('/api/pessoas');

        // Buscar pessoa pelo email ou login
        const pessoas = pessoasResponse.data;

        logger.info('🔍 Buscando pessoa no array de pessoas...');
        logger.info('📧 Email de busca:', email);
        logger.info('📊 Total de pessoas retornadas:', pessoas.length);

        // Log das primeiras 3 pessoas para diagnóstico
        if (pessoas.length > 0) {
          logger.info('🔍 Exemplo de pessoa (primeira do array):', {
            ...pessoas[0],
            // Mostrar também as propriedades em maiúsculo caso o backend retorne assim
            Login: pessoas[0].Login,
            Tipo: pessoas[0].Tipo,
            CpfCnpj: pessoas[0].CpfCnpj
          });
        }

        const pessoa = pessoas.find(
          p => (p.login === email || p.Login === email) ||
               (p.cpfCnpj === email.replace(/[^0-9]/g, '') || p.CpfCnpj === email.replace(/[^0-9]/g, ''))
        );

        if (pessoa) {
          // Pessoa encontrada - armazenar dados
          // Backend pode retornar com letra maiúscula (Tipo) ou minúscula (tipo)
          const role = pessoa.tipo || pessoa.Tipo || 'ASSISTENCIA_TECNICA'; // Default para assistência

          logger.info('👤 Pessoa encontrada na API:', {
            id: pessoa.id || pessoa.Id,
            nome: pessoa.nome || pessoa.Nome,
            login: pessoa.login || pessoa.Login,
            tipo: pessoa.tipo || pessoa.Tipo,
            roleAtribuido: role
          });

          const idPessoa = pessoa.id || pessoa.Id;
          const nomePessoa = pessoa.nome || pessoa.Nome || email;
          const cpfCnpj = pessoa.cpfCnpj || pessoa.CpfCnpj;

          localStorage.setItem('idPessoa', idPessoa.toString());
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', nomePessoa);

          // 🔧 SE for DISTRIBUIDOR, busca o idDistribuidor e salva no localStorage
          if (role === 'DISTRIBUIDOR' && cpfCnpj) {
            logger.info('🔍 Usuário é DISTRIBUIDOR, buscando idDistribuidor...');

            try {
              // Importa dinamicamente para evitar dependência circular
              const { getDistribuidorIdByCpfCnpj } = await import('../api/distribuidorServices');
              const idDistribuidor = await getDistribuidorIdByCpfCnpj(cpfCnpj);

              if (idDistribuidor) {
                localStorage.setItem('idDistribuidor', idDistribuidor.toString());
                logger.info('✅ idDistribuidor salvo:', idDistribuidor);
              } else {
                logger.warn('⚠️ Não foi possível encontrar idDistribuidor para este usuário');
              }
            } catch (distribError) {
              logger.error('❌ Erro ao buscar idDistribuidor:', distribError);
              // Continua o login mesmo sem o idDistribuidor (fallback)
            }
          }

          setUserId(idPessoa);
          setUserRole(role);
          setUserName(nomePessoa);
          setUserEmail(email);
          setIsAuthenticated(true);

          logger.info('✅ Login concluído com sucesso! Role:', role);
          return { success: true, role };
        } else {
          // Pessoa não encontrada - usar mock para desenvolvimento
          logger.warn('⚠️ Pessoa não encontrada na API. Usando dados mock.');
          logger.info('📧 Email procurado:', email);
          logger.info('📋 Total de pessoas encontradas:', pessoas.length);

          const mockId = 1;
          const mockRole = 'ASSISTENCIA_TECNICA';
          const mockName = email.split('@')[0];

          localStorage.setItem('idPessoa', mockId.toString());
          localStorage.setItem('userRole', mockRole);
          localStorage.setItem('userName', mockName);

          setUserId(mockId);
          setUserRole(mockRole);
          setUserName(mockName);
          setUserEmail(email);
          setIsAuthenticated(true);

          return { success: true, role: mockRole };
        }
      } catch (apiError) {
        logger.error('Erro ao buscar dados da pessoa:', apiError);

        // Fallback: usar mock se a API de pessoas falhar
        const mockId = 1;
        const mockRole = 'ASSISTENCIA_TECNICA';
        const mockName = email.split('@')[0];

        localStorage.setItem('idPessoa', mockId.toString());
        localStorage.setItem('userRole', mockRole);
        localStorage.setItem('userName', mockName);

        setUserId(mockId);
        setUserRole(mockRole);
        setUserName(mockName);
        setUserEmail(email);
        setIsAuthenticated(true);

        return { success: true, role: mockRole };
      }
    } catch (error) {
      logger.error('Erro no login:', error);

      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (error.response.status === 400) {
          errorMessage = 'Dados de login inválidos.';
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
      }

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = () => {
    // Usa tokenService para limpar tudo, incluindo refresh token e timers
    tokenService.clearTokens();

    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUserEmail(null);
    setUserName(null);
  };

  /**
   * Verifica se o usuário tem um papel específico
   * @param {string} role - Papel a verificar
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return userRole === role;
  };

  /**
   * Verifica se o usuário tem algum dos papéis fornecidos
   * @param {string[]} roles - Array de papéis
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  /**
   * Retorna o dashboard apropriado baseado no papel
   * @param {string} role - Papel opcional (usa userRole do estado se não fornecido)
   * @returns {string} - Rota do dashboard
   */
  const getDashboardRoute = (role = null) => {
    const effectiveRole = role || userRole;

    switch (effectiveRole) {
      case 'ASSISTENCIA_TECNICA':
        return '/assistencia/dashboard';
      case 'DISTRIBUIDOR':
        return '/distribuidor/dashboard';
      case 'ENTREGADOR':
        return '/entregador/dashboard';
      default:
        return '/assistencia/dashboard';
    }
  };

  return {
    // Estado
    isAuthenticated,
    userRole,
    userId,
    userEmail,
    userName,
    loading,

    // Métodos
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
    getDashboardRoute
  };
};

// Constantes para os papéis
export const ROLES = {
  ASSISTENCIA_TECNICA: 'ASSISTENCIA_TECNICA',
  DISTRIBUIDOR: 'DISTRIBUIDOR',
  ENTREGADOR: 'ENTREGADOR'
};
