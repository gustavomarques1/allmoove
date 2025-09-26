import React from 'react';
import propTypes from 'prop-types';
import styles from './OpcaoEntregaCard.module.css';
// 1. Importe TODOS os ícones que você pode precisar
import { MapPin, Clock, Truck, Zap } from 'lucide-react'; 

function OpcaoEntregaCard({ opcao, isSelected, onSelect }) {
  
  // 2. Função que decide qual ícone renderizar com base no texto
  const renderIcon = () => {
    switch (opcao.icone) {
      case 'truck':
        return <Truck size={24} />;
      case 'zap':
        return <Zap size={24} />;
      default:
        return null; // Caso não encontre um ícone correspondente
    }
  };

  return (
    <div 
      className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(opcao)}
    >
      {/* 3. A função é chamada aqui para renderizar o ícone */}
      <div className={styles.optionIcon}>{renderIcon()}</div>
      
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
  opcao: propTypes.shape({
    id: propTypes.number.isRequired,
    titulo: propTypes.string.isRequired,
    descricao: propTypes.string.isRequired,
    prazo: propTypes.string.isRequired,
    origem: propTypes.string.isRequired,
    preco: propTypes.number.isRequired,
    icone: propTypes.string, // Agora espera um texto (string)
    tag: propTypes.string,
  }).isRequired,
  isSelected: propTypes.bool.isRequired,
  onSelect: propTypes.func.isRequired,
};

export default OpcaoEntregaCard;