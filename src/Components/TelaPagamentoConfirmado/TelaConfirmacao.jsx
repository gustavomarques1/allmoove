import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaConfirmacao.module.css';
import logger from '../../utils/logger';
import { CheckCircle } from 'lucide-react';

// Importando os novos componentes filhos
import CodigoEntrega from './CodigoEntrega/CodigoEntrega';
import DetalhesPedido from './DetalhesPedido/DetalhesPedido';

function TelaConfirmacao() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados do pedido vêm do 'state' da navegação (retornados pela API)
  const { pedidoConfirmado } = location.state || {};

  // Fallback com dados de exemplo se a página for acessada diretamente
  const pedido = pedidoConfirmado || {
    id: 0,
    codigoEntrega: 'M000X0',
    items: [{ nome: 'Produto Exemplo', quantidade: 1 }],
    totalPago: 0,
    status: 'Aguardando Aceite',
    fornecedor: 'N/A',
    tipoEntrega: 'Normal',
    prazoEstimado: 'N/A',
    metodoPagamento: 'N/A'
  };

  logger.info('📦 Pedido confirmado recebido:', pedido);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <CheckCircle size={48} className={styles.successIcon} />
        <h1>Pagamento Confirmado!</h1>
        <p>Seu pedido #{pedido.id} foi criado com sucesso e já está sendo processado.</p>
      </header>

      <main className={styles.mainContent}>
        {/* Código de Entrega */}
        <CodigoEntrega codigo={pedido.codigoEntrega} />

        {/* Detalhes do Pedido */}
        <DetalhesPedido pedido={{
          ...pedido,
          itens: pedido.items || pedido.itens, // Compatibilidade com API
          pagamento: pedido.metodoPagamento
        }} />
      </main>

      <footer className={styles.footer}>
        {/* VERSÃO FINAL: Background Laranja + Texto Branco AllMoove */}
        <button className={`${styles.actionButton} ${styles.primaryAllmoove}`} onClick={() => navigate('/assistencia/dashboard')}>
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