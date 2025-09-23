import React, { useState } from 'react';
import styles from './PagamentoPix.module.css';
import { Copy, Check } from 'lucide-react';

function PagamentoPix() {
  const [copiado, setCopiado] = useState(false);
  const chavePix = 'assistencia@techparts.com.br';

  const handleCopy = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  return (
    <div className={styles.pixContainer}>
      {/* 1. Novo container que serve como a MOLDURA TRACEJADA */}
      <div className={styles.qrCodeWrapper}>
        {/* 2. O placeholder do QR Code fica DENTRO da moldura */}
        <div className={styles.qrCodePlaceholder}>
          <span>QR Code PIX</span>
        </div>
      </div>
      
      {/* 3. O restante do conteúdo fica FORA da moldura, como irmãos dela */}
      <p className={styles.label}>Chave PIX:</p>
      
      <div className={styles.pixKeyWrapper}>
        <div className={styles.pixKeyDisplay}>
          {chavePix}
        </div>
        <button className={styles.copyButton} onClick={handleCopy}>
          {copiado ? <Check size={18} color="#16a34a" /> : <Copy size={18} />}
        </button>
      </div>
      
      <p className={styles.instructions}>
        Abra seu app de pagamentos, escaneie o QR Code ou copie a chave PIX
      </p>
    </div>
  );
}

export default PagamentoPix;