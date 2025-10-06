import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft, MapPin } from 'lucide-react';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';
import TelaConfirmacao from '../TelaPagamentoConfirmado/TelaConfirmacao';

// Importando service de pedidos
import { createPedido } from '../../api/pedidosServices';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('Pix');
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [erro, setErro] = useState('');

  // Carrega endereço do localStorage
  useEffect(() => {
    const enderecoSalvo = localStorage.getItem('endereco');
    if (enderecoSalvo) {
      setEndereco(JSON.parse(enderecoSalvo));
    }
  }, []);

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
   * Navega para tela de produtos para cadastrar endereço
   */
  const handleAdicionarEndereco = () => {
    navigate('/assistencia/loja');
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
        assistenciaTecnicaId: parseInt(idPessoa),
        fornecedor: opcaoSelecionada?.origem || 'WEFIX',
        tipoEntrega: opcaoSelecionada?.titulo === 'Entrega Expressa' ? 'Urgente' : 'Normal',
        metodoPagamento: metodoPagamento,
        items: cartItems.map(item => ({
          produtoId: item.id,
          nome: item.nome,
          quantidade: item.quantity,
          preco: item.price || 0
        })),
        endereco: {
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento || '',
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado
        },
        valorFrete: valorFrete,
        valorProdutos: valorProdutos,
        totalPago: valorTotal
      };

      console.log('📤 Enviando pedido para API:', dadosPedido);

      // Chama API para criar pedido
      const pedidoCriado = await createPedido(dadosPedido);

      console.log('✅ Pedido criado com sucesso:', pedidoCriado);

      // Define dados do pedido confirmado
      setPedidoConfirmado({
        ...pedidoCriado,
        itens: cartItems,
        prazoEstimado: opcaoSelecionada?.prazo || pedidoCriado.prazoEstimado
      });
      setPagamentoConfirmado(true);

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
              <button
                className={styles.editarEnderecoButton}
                onClick={handleAdicionarEndereco}
              >
                Alterar endereço
              </button>
            </div>
          ) : (
            <div className={styles.semEndereco}>
              <p>Nenhum endereço cadastrado</p>
              <button
                className={styles.adicionarEnderecoButton}
                onClick={handleAdicionarEndereco}
              >
                <MapPin size={16} />
                Cadastrar Endereço
              </button>
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

      {/* Só mostra o footer se o pagamento ainda não foi confirmado */}
      {!pagamentoConfirmado && (
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
      )}

      {/* Renderiza a TelaConfirmacao quando o pagamento é confirmado */}
      {pagamentoConfirmado && pedidoConfirmado && (
        <div className={styles.confirmacaoContainer}>
          <TelaConfirmacao pedidoData={pedidoConfirmado} />
        </div>
      )}
    </div>
  );
}

export default TelaPagamento;