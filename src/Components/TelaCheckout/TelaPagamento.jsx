import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft } from 'lucide-react';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';
import TelaConfirmacao from '../TelaPagamentoConfirmado/TelaConfirmacao';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado para controlar se a confirmação foi feita
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  // Função para confirmar o pagamento (agora não navega mais)
  const handleConfirmPayment = () => {
    // Simula a resposta da API criando um objeto de pedido confirmado
    const novoPedido = {
      id: Math.floor(Math.random() * 1000),
      codigoEntrega: `M${Math.floor(Math.random() * 9000) + 1000}X${Math.floor(Math.random() * 9)}`,
      itens: cartItems,
      fornecedor: opcaoSelecionada?.origem || 'N/A',
      tipoEntrega: opcaoSelecionada?.titulo || 'N/A',
      prazoEstimado: opcaoSelecionada?.prazo || 'N/A',
      pagamento: 'Pix',
      totalPago: valorTotal,
      status: 'Aguardando Aceite',
    };

    // Define os dados do pedido e marca como confirmado
    setPedidoConfirmado(novoPedido);
    setPagamentoConfirmado(true);
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

      {/* Só mostra o footer se o pagamento ainda não foi confirmado */}
      {!pagamentoConfirmado && (
        <footer className={styles.footer}>
          <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate(-1)}>
            Voltar
          </button>
          <button 
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={handleConfirmPayment}
          >
            Confirmar Pagamento
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