import React from 'react';
import propTypes from 'prop-types';
import styles from './ResumoPedido.module.css';
import { ShoppingCart } from 'lucide-react';

function ResumoPedido({ cartItems, opcaoSelecionada }) {
  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ShoppingCart size={20} />
        <h3>Resumo do Pedido</h3>
      </div>

      <div className={styles.itemsList}>
        <span className={styles.label}>Peças:</span>
        <div className={styles.itemsDetail}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.itemRow}>
              <span>{item.nome} ({item.quantity}x)</span>
              <span>{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.summaryRow}>
        <span className={styles.label}>Entrega:</span>
        <span>{opcaoSelecionada?.titulo || 'N/A'}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.label}>Fornecedor:</span>
        <span>{opcaoSelecionada?.origem || 'N/A'}</span>
      </div>
      
      <div className={styles.divider}></div>

      <div className={styles.summaryRow}>
        <span className={styles.label}>Valor dos produtos:</span>
        <span>{valorProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.label}>Frete:</span>
        <span>{valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
        <strong>Total:</strong>
        <strong>{valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
      </div>
    </div>
  );
}

ResumoPedido.propTypes = {
  cartItems: propTypes.array.isRequired,
  opcaoSelecionada: propTypes.object,
};

ResumoPedido.defaultProps = {
  opcaoSelecionada: null,
};

export default ResumoPedido;