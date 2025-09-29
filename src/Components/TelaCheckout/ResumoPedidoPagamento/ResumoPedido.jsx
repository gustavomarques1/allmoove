import React from 'react';
import propTypes from 'prop-types';
import styles from './ResumoPedido.module.css';
import { ShoppingCart, Store } from 'lucide-react';

// --- CORREÇÃO AQUI ---
// Adicionamos '= 0' para garantir que se 'valorFrete' não for passado, ele será 0.
function ResumoPedido({ cartItems, valorFrete = 0 }) {

  // LÓGICA DE AGRUPAMENTO POR FORNECEDOR
  const itensAgrupados = cartItems.reduce((acc, item) => {
    const fornecedor = item.fornecedor || 'Fornecedor Padrão';
    if (!acc[fornecedor]) {
      acc[fornecedor] = { itens: [], subtotal: 0 };
    }
    acc[fornecedor].itens.push(item);
    acc[fornecedor].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  // CÁLCULO DOS TOTAIS GERAIS
  const valorTotalProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // Agora, mesmo que valorFrete seja undefined, a conta funcionará
  const valorTotalGeral = valorTotalProdutos + valorFrete;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ShoppingCart size={20} />
        <h3>Resumo da Compra</h3>
      </div>

      {Object.keys(itensAgrupados).map(fornecedor => (
        <div key={fornecedor} className={styles.fornecedorSection}>
          <div className={styles.fornecedorHeader}>
            <Store size={16} />
            <span className={styles.fornecedorNome}>{fornecedor}</span>
          </div>

          <div className={styles.itemsList}>
            <div className={styles.itemsDetail}>
              {itensAgrupados[fornecedor].itens.map(item => (
                <div key={item.id} className={styles.itemRow}>
                  <span>{item.nome} ({item.quantity}x)</span>
                  <span>{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.subtotalRow}>
            <span>Subtotal (produtos):</span>
            <strong>{itensAgrupados[fornecedor].subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </div>
        </div>
      ))}
      
      <div className={styles.resumoFinal}>
        <div className={styles.summaryRow}>
          <span>Frete Express:</span>
          <span>{valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalGeralRow}`}>
          <strong>Total Geral:</strong>
          <strong>{valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
        </div>
      </div>
    </div>
  );
}

ResumoPedido.propTypes = {
  cartItems: propTypes.array.isRequired,
  valorFrete: propTypes.number,
};

// O defaultProps continua sendo uma boa prática
ResumoPedido.defaultProps = {
  valorFrete: 0,
};

export default ResumoPedido;