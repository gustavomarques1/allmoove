import React from 'react';
import styles from './TelaPartsRequest.module.css'; // A importação está correta

function TelaPartsRequest() { 
  return (
    <div>
      {/* A classe agora é aplicada usando o objeto 'styles' */}
      <h1 className={styles.teste}>Solicitação de Peças de Assistência</h1>
      
      <p>Esta é a nova página de solicitação de peças.</p>
    </div>
  );
}

export default TelaPartsRequest;