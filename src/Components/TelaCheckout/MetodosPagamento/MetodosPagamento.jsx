import React, { useState } from 'react';
import propTypes from 'prop-types';
import styles from './MetodosPagamento.module.css';
import { CreditCard, QrCode } from 'lucide-react';
import FormularioCartao from './FormularioCartao/FormularioCartao';
import PagamentoPix from './PagamentoPix/PagamentoPix';

function MetodosPagamento({ valorTotal }) {
  const [metodoPagamento, setMetodoPagamento] = useState('pix');

  return (
    <div className={styles.card}>
      {/* TÍTULO ADICIONADO AQUI */}
      <h3 className={styles.cardTitle}>Forma de Pagamento</h3>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${metodoPagamento === 'pix' ? styles.active : ''}`}
          onClick={() => setMetodoPagamento('pix')}
        >
          <QrCode size={16} /> PIX
        </button>
        <button 
          className={`${styles.tabButton} ${metodoPagamento === 'cartao' ? styles.active : ''}`}
          onClick={() => setMetodoPagamento('cartao')}
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
};

export default MetodosPagamento;