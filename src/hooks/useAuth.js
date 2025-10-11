import { useState, useEffect } from 'react';
import api from '../api/api';

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
      console.error('Erro ao verificar autenticação:', error);
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

      const { token, expiration } = loginResponse.data;

      // Salvar token e expiration
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expiration);
      localStorage.setItem('email', email);

      // 2. Buscar dados da pessoa para obter o papel (role)
      try {
        const pessoasResponse = await api.get('/api/pessoas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Buscar pessoa pelo email ou login
        const pessoas = pessoasResponse.data;
        const pessoa = pessoas.find(
          p => p.login === email ||
               p.cpfCnpj === email.replace(/[^0-9]/g, '')
        );

        if (pessoa) {
          // Pessoa encontrada - armazenar dados
          const role = pessoa.tipo || 'ASSISTENCIA_TECNICA'; // Default para assistência

          localStorage.setItem('idPessoa', pessoa.id.toString());
          localStorage.setItem('userRole', role);
          localStorage.setItem('userName', pessoa.nome || email);

          setUserId(pessoa.id);
          setUserRole(role);
          setUserName(pessoa.nome || email);
          setUserEmail(email);
          setIsAuthenticated(true);

          return { success: true, role };
        } else {
          // Pessoa não encontrada - usar mock para desenvolvimento
          console.warn('Pessoa não encontrada na API. Usando dados mock.');

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
        console.error('Erro ao buscar dados da pessoa:', apiError);

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
      console.error('Erro no login:', error);

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
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('email');
    localStorage.removeItem('idPessoa');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

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
   * @returns {string} - Rota do dashboard
   */
  const getDashboardRoute = () => {
    switch (userRole) {
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
