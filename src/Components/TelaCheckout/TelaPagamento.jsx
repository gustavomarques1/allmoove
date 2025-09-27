import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft } from 'lucide-react';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  // 1. FUNÇÃO PARA CONFIRMAR O PAGAMENTO E NAVEGAR
  const handleConfirmPayment = () => {
    // Em um aplicativo real, aqui você faria a chamada POST para sua API
    // para criar o pedido no banco de dados.
    // A API retornaria os dados do pedido criado.
    
    // Vamos simular a resposta da API criando um objeto de pedido confirmado:
    const pedidoConfirmado = {
      id: Math.floor(Math.random() * 1000), // ID aleatório
      codigoEntrega: `M${Math.floor(Math.random() * 9000) + 1000}X${Math.floor(Math.random() * 9)}`, // Código aleatório
      itens: cartItems,
      fornecedor: opcaoSelecionada?.origem || 'N/A',
      tipoEntrega: opcaoSelecionada?.titulo || 'N/A',
      prazoEstimado: opcaoSelecionada?.prazo || 'N/A',
      pagamento: 'Pix', // Poderia ser dinâmico com base na aba selecionada
      totalPago: valorTotal,
      status: 'Aguardando Aceite',
    };

    // 2. NAVEGA PARA A TELA DE SUCESSO, PASSANDO OS DADOS DO PEDIDO
    navigate('/assistencia/payment-success', {
      state: { pedidoConfirmado }
    });
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
        <ResumoPedido cartItems={cartItems} opcaoSelecionada={opcaoSelecionada} />
        <MetodosPagamento valorTotal={valorTotal} />
      </main>

      <footer className={styles.footer}>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate(-1)}>Voltar</button>
        {/* 3. BOTÃO AGORA CHAMA A FUNÇÃO DE CONFIRMAÇÃO */}
        <button 
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={handleConfirmPayment}
        >
          Confirmar Pagamento
        </button>
      </footer>
    </div>
  );
}

export default TelaPagamento;
