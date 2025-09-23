import React from 'react';
import propTypes from 'prop-types';
import styles from './OpcaoEntregaCard.module.css';
import { MapPin, Clock } from 'lucide-react';

function OpcaoEntregaCard({ opcao, isSelected, onSelect }) {
  return (
    <div 
      className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(opcao)}
    >
      <div className={styles.optionIcon}>{opcao.icone}</div>
      
      <div className={styles.optionDetails}>
        <div className={styles.optionTitle}>
          <h4>{opcao.titulo}</h4>
          {opcao.tag && <span className={styles.tag}>{opcao.tag}</span>}
        </div>
        <p className={styles.optionDescription}>{opcao.descricao}</p>
        <div className={styles.optionSubdetails}>
          <div><Clock size={14} /> {opcao.prazo}</div>
          <div><MapPin size={14} /> {opcao.origem}</div>
        </div>
      </div>
      
      <div className={styles.optionPrice}>
        <span>Frete:</span>
        <strong>{opcao.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
      </div>
    </div>
  );
}

OpcaoEntregaCard.propTypes = {
  opcao: propTypes.object.isRequired,
  isSelected: propTypes.bool.isRequired,
  onSelect: propTypes.func.isRequired,
};

export default OpcaoEntregaCard;