import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import styles from './MetodosPagamento.module.css';
import { CreditCard, QrCode } from 'lucide-react';
import FormularioCartao from './FormularioCartao/FormularioCartao';
import PagamentoPix from './PagamentoPix/PagamentoPix';

function MetodosPagamento({ valorTotal, onMetodoChange, metodoPagamentoAtual }) {
  const [metodoPagamento, setMetodoPagamento] = useState(metodoPagamentoAtual || 'pix');

  // Atualiza método quando usuário alterna
  useEffect(() => {
    if (onMetodoChange) {
      // Normaliza para formato da API: "Pix" ou "Cartão de Crédito"
      const metodoFormatado = metodoPagamento === 'pix' ? 'Pix' : 'Cartão de Crédito';
      onMetodoChange(metodoFormatado);
    }
  }, [metodoPagamento, onMetodoChange]);

  const handleMetodoChange = (metodo) => {
    setMetodoPagamento(metodo);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Forma de Pagamento</h3>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${metodoPagamento === 'pix' ? styles.active : ''}`}
          onClick={() => handleMetodoChange('pix')}
        >
          <QrCode size={16} /> PIX
        </button>
        <button
          className={`${styles.tabButton} ${metodoPagamento === 'cartao' ? styles.active : ''}`}
          onClick={() => handleMetodoChange('cartao')}
        >
          <CreditCard size={16} /> Cartão
        </button>
      </div>

      {metodoPagamento === 'pix' && <PagamentoPix />}
      {metodoPagamento === 'cartao' && <FormularioCartao valorTotal={valorTotal} />}
    </div>
  );
}

MetodosPagamento.propTypes = {
  valorTotal: propTypes.number.isRequired,
  onMetodoChange: propTypes.func,
  metodoPagamentoAtual: propTypes.string,
};

export default MetodosPagamento;