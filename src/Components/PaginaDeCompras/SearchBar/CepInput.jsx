// CEPInput.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import styles from './CepInput.module.css';

function CepInput() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [savedCep, setSavedCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCep('');
  };

  const handleCepSubmit = async (e) => {
    e.preventDefault();
    if (cep.length === 8) {
      setIsLoading(true);
      
      // Simula uma validação de CEP (você pode integrar com uma API real)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSavedCep(cep);
      setIsModalOpen(false);
      setCep('');
      setIsLoading(false);
      
      // Aqui você pode adicionar lógica para salvar no context ou localStorage
      console.log('CEP salvo:', formatCep(cep));
    }
  };

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setCep(value);
    }
  };

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className={styles.cepInput} onClick={handleOpenModal}>
        <MapPin size={14} className={styles.cepInputIcon} />
        <div className={styles.cepInputContent}>
          <span className={styles.cepInputLabel}>Enviar para </span><br></br>
          <span className={styles.cepInputValue}>
            {savedCep ? `Brasília ${formatCep(savedCep)}` : 'Brasília 71820210'}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              <X size={20} />
            </button>
            
            <div className={styles.modalHeader}>
              <h3>Selecione onde quer receber suas compras</h3>
              <p className={styles.modalSubtitle}>
                Você poderá ver custos e prazos de entrega precisos em tudo que procurar.
              </p>
            </div>
            
            <form onSubmit={handleCepSubmit} className={styles.cepForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="cep" className={styles.inputLabel}>CEP</label>
                <div className={styles.inputContainer}>
                  <input
                    id="cep"
                    type="text"
                    value={formatCep(cep)}
                    onChange={handleCepChange}
                    placeholder="71820210"
                    className={styles.cepFormInput}
                    maxLength={9}
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className={`${styles.useButton} ${isLoading ? styles.loading : ''}`}
                    disabled={cep.length !== 8 || isLoading}
                  >
                    {isLoading ? '' : 'Usar'}
                  </button>
                </div>
              </div>
              
              <button 
                type="button" 
                className={styles.addAddressButton}
                onClick={() => alert('Funcionalidade em desenvolvimento')}
              >
                <span className={styles.plusIcon}>+</span>
                <span>Adicionar endereço completo</span>
                <button 
                  type="button" 
                  className={styles.dontKnowButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Funcionalidade em desenvolvimento');
                  }}
                >
                  Não sei o meu CEP
                </button>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CepInput;