import React from 'react';
import propTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';
import styles from './ResumoPedido.module.css';

function ResumoPedido({ valorProdutos, opcaoSelecionada }) {
  const valorTotal = opcaoSelecionada ? valorProdutos + opcaoSelecionada.preco : valorProdutos;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ShoppingCart size={20} />
        <h3>Resumo do Pedido</h3>
      </div>
      <div className={styles.summaryRow}>
        <span>Valor dos produtos:</span>
        <span>{valorProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      
      {opcaoSelecionada ? (
        <>
          <div className={styles.summaryRow}>
            <span>Frete:</span>
            <span>{opcaoSelecionada.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total:</span>
            <span>{valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        </>
      ) : (
        <p className={styles.selectOptionMessage}>Selecione uma opção de entrega para ver o total</p>
      )}
    </div>
  );
}

ResumoPedido.propTypes = {
  valorProdutos: propTypes.number.isRequired,
  opcaoSelecionada: propTypes.object,
};

ResumoPedido.defaultProps = {
  opcaoSelecionada: null,
};

export default ResumoPedido;