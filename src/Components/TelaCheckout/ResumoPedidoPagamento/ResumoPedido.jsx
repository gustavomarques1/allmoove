import React from 'react';
import propTypes from 'prop-types';
import styles from './ResumoPedido.module.css';
import { ShoppingCart, Store } from 'lucide-react';

function ResumoPedido({ cartItems, valorFrete = 0 }) {

  // 1. LÓGICA DE AGRUPAMENTO (permanece a mesma)
  const itensAgrupados = cartItems.reduce((acc, item) => {
    const fornecedor = item.fornecedor || 'Fornecedor Padrão';
    if (!acc[fornecedor]) {
      acc[fornecedor] = { itens: [], subtotal: 0 };
    }
    acc[fornecedor].itens.push(item);
    acc[fornecedor].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  // 2. CÁLCULO DO TOTAL GERAL
  const numeroDeFornecedores = Object.keys(itensAgrupados).length;
  const valorTotalProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorTotalFrete = valorFrete * numeroDeFornecedores;
  const valorTotalGeral = valorTotalProdutos + valorTotalFrete;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <ShoppingCart size={20} />
        <h3>Resumo da Compra</h3>
      </div>

      {/* 3. RENDERIZAÇÃO DAS SUBSEÇÕES */}
      {Object.keys(itensAgrupados).map(fornecedor => {
        const totalDoFornecedor = itensAgrupados[fornecedor].subtotal + valorFrete;

        return (
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
            
            {/* 4. SEÇÃO DE TOTAIS DA SUBSEÇÃO */}
            <div className={styles.subtotalSection}>
              <div className={styles.summaryRow}>
                <span>Subtotal (produtos):</span>
                <span>{itensAgrupados[fornecedor].subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Frete Express:</span>
                <span>{valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalFornecedorRow}`}>
                <strong>Total do Pedido:</strong>
                <strong>{totalDoFornecedor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* 5. SEÇÃO FINAL COM FRETE TOTAL E TOTAL GERAL */}
      <div className={styles.resumoFinal}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>Frete Total:</span>
          <span>{valorTotalFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

ResumoPedido.defaultProps = {
  valorFrete: 0,
};

export default ResumoPedido;