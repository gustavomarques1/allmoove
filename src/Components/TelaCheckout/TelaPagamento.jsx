import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft, MapPin } from 'lucide-react';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';
import CepInput from '../PaginaDeCompras/SearchBar/CepInput';

// Importando service de pedidos
import { createPedido, validarDadosPedido } from '../../api/pedidosServices';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [endereco, setEndereco] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('Pix');
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [erro, setErro] = useState('');
  const [modalKey, setModalKey] = useState(0); // Para forçar re-render do CepInput

  // Carrega endereço do localStorage
  useEffect(() => {
    const carregarEndereco = () => {
      const enderecoSalvo = localStorage.getItem('endereco');
      if (enderecoSalvo) {
        setEndereco(JSON.parse(enderecoSalvo));
      }
    };

    carregarEndereco();

    // Escuta mudanças no localStorage (quando modal salva)
    const handleStorageChange = () => {
      carregarEndereco();
    };

    window.addEventListener('storage', handleStorageChange);

    // Também escuta um evento customizado para mudanças na mesma aba
    const handleEnderecoUpdate = () => {
      carregarEndereco();
    };
    window.addEventListener('enderecoUpdated', handleEnderecoUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('enderecoUpdated', handleEnderecoUpdate);
    };
  }, [modalKey]);

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  /**
   * Valida se o endereço está completo
   */
  const validarEndereco = () => {
    if (!endereco) return false;
    const camposObrigatorios = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
    return camposObrigatorios.every(campo => endereco[campo] && endereco[campo].trim() !== '');
  };

  /**
   * Confirma o pagamento e cria o pedido na API
   */
  const handleConfirmPayment = async () => {
    // Validações
    if (!validarEndereco()) {
      setErro('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }

    if (cartItems.length === 0) {
      setErro('Carrinho vazio. Adicione produtos antes de finalizar.');
      return;
    }

    setCriandoPedido(true);
    setErro('');

    try {
      // Pega ID da assistência do localStorage
      const idPessoa = localStorage.getItem('idPessoa');

      if (!idPessoa) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      // Monta dados do pedido conforme API
      const dadosPedido = {
        idPessoa: parseInt(idPessoa),  // ✅ CORRIGIDO: Backend espera idPessoa
        empresa: 1, // TODO: Buscar do usuário logado
        estabelecimento: 1, // TODO: Buscar do usuário logado
        valorFrete: valorFrete
      };

      console.log('📤 Enviando pedido para API:', dadosPedido);

      // Valida dados antes de enviar
      const validacao = validarDadosPedido(dadosPedido);
      if (!validacao.valid) {
        throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
      }

      // Chama API para criar pedido
      const pedidoCriado = await createPedido(dadosPedido);

      console.log('✅ Pedido criado com sucesso:', pedidoCriado);

      // Navega para tela de confirmação passando dados do pedido
      navigate('/assistencia/payment-success', {
        state: {
          pedidoConfirmado: {
            ...pedidoCriado,
            itens: cartItems,
            prazoEstimado: opcaoSelecionada?.prazo || pedidoCriado.prazoEstimado
          }
        }
      });

    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      setErro(error.message || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setCriandoPedido(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft />
        </button>
        <h2>Pagamento</h2>
      </header>

      <main className={styles.mainContent}>
        {/* Card de Endereço */}
        <div className={styles.enderecoCard}>
          <div className={styles.enderecoHeader}>
            <MapPin size={20} className={styles.enderecoIcon} />
            <h3>Endereço de Entrega</h3>
          </div>

          {endereco ? (
            <div className={styles.enderecoInfo}>
              <p className={styles.enderecoDestaque}>
                {endereco.logradouro}, {endereco.numero}
                {endereco.complemento && ` - ${endereco.complemento}`}
              </p>
              <p className={styles.enderecoDetalhes}>
                {endereco.bairro} - {endereco.cidade}/{endereco.estado}
              </p>
              <p className={styles.enderecoCep}>CEP: {endereco.cep}</p>
              <div className={styles.editarEnderecoContainer}>
                <CepInput key={modalKey} onEnderecoChange={() => setModalKey(prev => prev + 1)} />
              </div>
            </div>
          ) : (
            <div className={styles.semEndereco}>
              <p>Nenhum endereço cadastrado</p>
              <div className={styles.cepInputWrapper}>
                <CepInput key={modalKey} onEnderecoChange={() => setModalKey(prev => prev + 1)} />
              </div>
            </div>
          )}
        </div>

        {/* Resumo do Pedido */}
        <ResumoPedido cartItems={cartItems} opcaoSelecionada={opcaoSelecionada} />

        {/* Métodos de Pagamento */}
        <MetodosPagamento
          valorTotal={valorTotal}
          onMetodoChange={setMetodoPagamento}
          metodoPagamentoAtual={metodoPagamento}
        />

        {/* Mensagem de Erro */}
        {erro && (
          <div className={styles.erroContainer}>
            <span className={styles.erroIcon}>⚠️</span>
            <p className={styles.erroMensagem}>{erro}</p>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={() => navigate(-1)}
          disabled={criandoPedido}
        >
          Voltar
        </button>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={handleConfirmPayment}
          disabled={criandoPedido}
        >
          {criandoPedido ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </footer>
    </div>
  );
}

export default TelaPagamento;