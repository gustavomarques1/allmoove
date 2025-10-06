import api from '../api';

export const fetchPedidosDaAssistencia = async () => {
  try {
    const token = localStorage.getItem('token');
    const idPessoa = localStorage.getItem('idPessoa');

    console.log('🔑 Token:', token ? 'Presente' : 'Ausente');
    console.log('👤 idPessoa:', idPessoa);

    if (!token || !idPessoa) {
      throw new Error('Usuário não autenticado.');
    }

    console.log('📡 Fazendo requisição para:', `/api/Pedidos/assistencia/${idPessoa}`);

    const response = await api.get(`/api/Pedidos/assistencia/${idPessoa}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Pedidos recebidos:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);

    // Mostra detalhes do erro
    if (error.response) {
      console.error('Status do erro:', error.response.status);
      console.error('Dados do erro:', error.response.data);
      console.error('Headers do erro:', error.response.headers);
    } else if (error.request) {
      console.error('Requisição feita, mas sem resposta:', error.request);
    } else {
      console.error('Erro ao configurar requisição:', error.message);
    }

    throw error;
  }
};