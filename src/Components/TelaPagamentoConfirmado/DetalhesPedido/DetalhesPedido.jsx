import React from 'react';
import propTypes from 'prop-types';
import styles from './DetalhesPedido.module.css';

function DetalhesPedido({ pedido }) {
  // Garante compatibilidade entre diferentes formatos de itens
  const itens = pedido.itens || pedido.items || [];

  return (
    <div className={styles.card}>
      <h3>Detalhes do Pedido</h3>
      <div className={styles.detailsGrid}>
        <span className={styles.label}>Peças:</span>
        <span>
          {itens.map((item, index) => {
            const nome = item.nome || item.name || 'Item';
            const quantidade = item.quantidade || item.quantity || 1;
            return `${nome} (${quantidade}x)${index < itens.length - 1 ? ', ' : ''}`;
          }).join('')}
        </span>

        <span className={styles.label}>Fornecedor:</span>
        <span>{pedido.fornecedor || 'N/A'}</span>

        <span className={styles.label}>Tipo de Entrega:</span>
        <span>{pedido.tipoEntrega || 'Normal'}</span>

        <span className={styles.label}>Prazo Estimado:</span>
        <span>{pedido.prazoEstimado || 'A confirmar'}</span>

        <span className={styles.label}>Pagamento:</span>
        <span>{pedido.pagamento || pedido.metodoPagamento || 'N/A'}</span>

        <span className={styles.labelTotal}>Total Pago:</span>
        <span className={styles.valueTotal}>
          {(pedido.totalPago || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>

        <span className={styles.label}>Status:</span>
        <span className={styles.status}>{pedido.status || 'Aguardando Aceite'}</span>
      </div>
    </div>
  );
}

DetalhesPedido.propTypes = {
  pedido: propTypes.object.isRequired,
};

export default DetalhesPedido;