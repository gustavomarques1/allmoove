import api from '../api';

export const fetchPedidosDaAssistencia = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado.');
    }

    // Agora a rota não precisa de parâmetro - usa o email do token
    const response = await api.get('/api/Pedidos/assistencia/meus-pedidos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;

  } catch (error) {
    console.error('Erro ao buscar os pedidos da assistência:', error);
    throw error;
  }
};