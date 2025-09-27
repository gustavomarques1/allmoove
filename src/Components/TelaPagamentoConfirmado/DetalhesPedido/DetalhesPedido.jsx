import React from 'react';
import propTypes from 'prop-types';
import styles from './DetalhesPedido.module.css';

function DetalhesPedido({ pedido }) {
  return (
    <div className={styles.card}>
      <h3>Detalhes do Pedido</h3>
      <div className={styles.detailsGrid}>
        <span className={styles.label}>Peças:</span>
        <span>{pedido.itens.map(item => `${item.nome} (${item.quantity}x)`).join(', ')}</span>

        <span className={styles.label}>Fornecedor:</span>
        <span>{pedido.fornecedor}</span>
        
        <span className={styles.label}>Tipo de Entrega:</span>
        <span>{pedido.tipoEntrega}</span>

        <span className={styles.label}>Prazo Estimado:</span>
        <span>{pedido.prazoEstimado}</span>
        
        <span className={styles.label}>Pagamento:</span>
        <span>{pedido.pagamento}</span>

        <span className={styles.labelTotal}>Total Pago:</span>
        <span className={styles.valueTotal}>
          {pedido.totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        
        <span className={styles.label}>Status:</span>
        <span className={styles.status}>{pedido.status}</span>
      </div>
    </div>
  );
}

DetalhesPedido.propTypes = {
  pedido: propTypes.object.isRequired,
};

export default DetalhesPedido;