import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaConfirmacao.module.css';
import { CheckCircle } from 'lucide-react';

// Importando os novos componentes filhos
import CodigoEntrega from './CodigoEntrega/CodigoEntrega';
import DetalhesPedido from './DetalhesPedido/DetalhesPedido';

function TelaConfirmacao() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados do pedido vêm do 'state' da navegação
  const { pedidoConfirmado } = location.state || {};
  
  // Fallback com dados de exemplo se a página for acessada diretamente
  const pedido = pedidoConfirmado || {
    id: 105,
    codigoEntrega: 'M501X8',
    itens: [{ nome: 'Produto Exemplo', quantity: 1 }],
    totalPago: 0,
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <CheckCircle size={48} className={styles.successIcon} />
        <h1>Pagamento Confirmado!</h1>
        <p>Seu pedido foi criado com sucesso e já está sendo processado.</p>
      </header>

      <main className={styles.mainContent}>
        {/* Usando os componentes filhos e passando os dados */}
        <CodigoEntrega codigo={pedido.codigoEntrega} />
        {/* <DetalhesPedido pedido={pedido} /> */}
      </main>

      <footer className={styles.footer}>
        <button className={`${styles.actionButton} ${styles.primary}`} onClick={() => navigate('/assistencia/dashboard')}>
          Voltar ao Dashboard
        </button>
        <button className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate('/assistencia/loja')}>
          Fazer Novo Pedido
        </button>
      </footer>
    </div>
  );
}

export default TelaConfirmacao;