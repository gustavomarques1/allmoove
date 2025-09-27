import React, { useState } from 'react';
import propTypes from 'prop-types';
import styles from './CodigoEntrega.module.css';
import { Package, Copy, Check } from 'lucide-react';

function CodigoEntrega({ codigo }) {
  const [copiado, setCopiado] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Package size={20} />
        <h3>Código de Entrega</h3>
      </div>
      <div className={styles.deliveryCodeWrapper}>
        <span className={styles.deliveryCode}>{codigo}</span>
      </div>
      <button className={styles.copyButton} onClick={handleCopyCode}>
        {copiado ? (
          <>
            <Check size={16} /> Código Copiado!
          </>
        ) : (
          <>
            <Copy size={16} /> Copiar Código
          </>
        )}
      </button>
      <p className={styles.importantNote}>
        <strong>Importante:</strong> Forneça este código ao entregador no momento da entrega. Guarde-o com segurança!
      </p>
    </div>
  );
}

CodigoEntrega.propTypes = {
  codigo: propTypes.string.isRequired,
};

export default CodigoEntrega;