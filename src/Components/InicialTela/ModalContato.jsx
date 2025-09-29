import React from 'react';
import propTypes from 'prop-types';
import { Mail, Phone, X, Copy } from 'lucide-react';
// 1. Importa os estilos como um objeto
import styles from './ModalContato.module.css';

function ModalContato({ onClose }) {

  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    alert(`"${textToCopy}" copiado para a área de transferência!`);
  };

  return (
    // 2. Aplica as classes usando o objeto 'styles'
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Informações de Contato</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.contactItem}>
            <Mail size={20} className={styles.contactIcon} />
            <span className={styles.contactText}>allmoove@gmail.com.br</span>
            <button onClick={() => handleCopy('allmoove@gmail.com.br')} className={styles.copyButton}>
              <Copy size={16} />
            </button>
          </div>
          <div className={styles.contactItem}>
            <Phone size={20} className={styles.contactIcon} />
            <span className={styles.contactText}>(61) 99324-2329</span>
            <button onClick={() => handleCopy('61993242329')} className={styles.copyButton}>
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ModalContato.propTypes = {
  onClose: propTypes.func.isRequired,
};

export default ModalContato;

