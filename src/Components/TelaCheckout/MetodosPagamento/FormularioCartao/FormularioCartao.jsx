import React, { useState } from 'react';
import propTypes from 'prop-types';
import styles from './FormularioCartao.module.css';

function FormularioCartao({ valorTotal }) {
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [parcelas, setParcelas] = useState(1);

  // Lógica simples para gerar opções de parcelas
  const gerarOpcoesParcelas = () => {
    const opcoes = [];
    for (let i = 1; i <= 6; i++) {
      const valorParcela = valorTotal / i;
      const texto = `${i}x de ${valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ${i > 1 ? '' : 'sem juros'}`;
      opcoes.push(<option key={i} value={i}>{texto}</option>);
    }
    return opcoes;
  };

  return (
    <form className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="numeroCartao" className={styles.formLabel}>Número do Cartão</label>
        <input
          id="numeroCartao"
          type="text"
          className={styles.formInput}
          value={numeroCartao}
          onChange={(e) => setNumeroCartao(e.target.value)}
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="nomeCartao" className={styles.formLabel}>Nome no Cartão</label>
        <input
          id="nomeCartao"
          type="text"
          className={styles.formInput}
          value={nomeCartao}
          onChange={(e) => setNomeCartao(e.target.value)}
          placeholder="NOME COMPLETO"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="validade" className={styles.formLabel}>Validade</label>
          <input
            id="validade"
            type="text"
            className={styles.formInput}
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
            placeholder="MM/AA"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cvv" className={styles.formLabel}>CVV</label>
          <input
            id="cvv"
            type="text"
            className={styles.formInput}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="parcelas" className={styles.formLabel}>Parcelas</label>
        <select
          id="parcelas"
          className={styles.selectInput}
          value={parcelas}
          onChange={(e) => setParcelas(e.target.value)}
        >
          {gerarOpcoesParcelas()}
        </select>
      </div>
    </form>
  );
}

FormularioCartao.propTypes = {
  valorTotal: propTypes.number.isRequired,
};

export default FormularioCartao;