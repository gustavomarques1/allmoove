import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft } from 'lucide-react';

// Importando os novos componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  // 1. CALCULAMOS O VALOR TOTAL AQUI PARA PASSAR ADIANTE
  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft />
        </button>
        <h2>Pagamento</h2>
      </header>

      <main className={styles.mainContent}>
        {/* Usando os componentes filhos e passando os dados necessários */}
        <ResumoPedido cartItems={cartItems} opcaoSelecionada={opcaoSelecionada} />
        
        {/* 2. PASSAMOS O valorTotal COMO PROP PARA O MetodosPagamento */}
        <MetodosPagamento valorTotal={valorTotal} />
      </main>

      <footer className={styles.footer}>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate(-1)}>Voltar</button>
        <button className={`${styles.actionButton} ${styles.primary}`}>Confirmar Pagamento</button>
      </footer>
    </div>
  );
}

export default TelaPagamento;