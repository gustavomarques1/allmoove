// CEPInput.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import styles from './CepInput.module.css';

function CepInput() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cep, setCep] = useState('');
  const [savedCep, setSavedCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFullAddressForm, setShowFullAddressForm] = useState(false);
  const [endereco, setEndereco] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Carrega endereço salvo do localStorage ao montar
  useEffect(() => {
    const enderecoSalvo = localStorage.getItem('endereco');
    if (enderecoSalvo) {
      const parsed = JSON.parse(enderecoSalvo);
      setEndereco(parsed);
      setSavedCep(parsed.cep);
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowFullAddressForm(false);
    setCep('');
  };

  const handleCepSubmit = async (e) => {
    e.preventDefault();
    if (cep.length === 8) {
      setIsLoading(true);

      try {
        // Busca CEP na API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          alert('CEP não encontrado');
          setIsLoading(false);
          return;
        }

        // Preenche endereço com dados do CEP
        const novoEndereco = {
          cep: formatCep(cep),
          logradouro: data.logradouro || '',
          numero: '',
          complemento: '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        };

        setEndereco(novoEndereco);
        setSavedCep(formatCep(cep));

        // Salva no localStorage
        localStorage.setItem('endereco', JSON.stringify(novoEndereco));

        setIsModalOpen(false);
        setCep('');
        setIsLoading(false);

        console.log('CEP salvo:', novoEndereco);
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
        setIsLoading(false);
      }
    }
  };

  const handleShowFullAddressForm = () => {
    setShowFullAddressForm(true);
  };

  const handleFullAddressSubmit = (e) => {
    e.preventDefault();

    // Valida campos obrigatórios
    if (!endereco.cep || !endereco.logradouro || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Salva endereço completo no localStorage
    localStorage.setItem('endereco', JSON.stringify(endereco));
    setSavedCep(endereco.cep);

    console.log('Endereço completo salvo:', endereco);

    setIsModalOpen(false);
    setShowFullAddressForm(false);
  };

  const handleEnderecoChange = (campo, valor) => {
    setEndereco(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCepChangeInForm = async (e) => {
    const valor = e.target.value;
    handleEnderecoChange('cep', formatCep(valor));

    // Busca automática quando CEP completo
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setEndereco(prev => ({
            ...prev,
            logradouro: data.logradouro || prev.logradouro,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setIsLoading(false);
      }
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
              
              {!showFullAddressForm && (
                <button
                  type="button"
                  className={styles.addAddressButton}
                  onClick={handleShowFullAddressForm}
                >
                  <span className={styles.plusIcon}>+</span>
                  <span>Adicionar endereço completo</span>
                </button>
              )}
            </form>

            {/* Formulário de Endereço Completo */}
            {showFullAddressForm && (
              <form onSubmit={handleFullAddressSubmit} className={styles.fullAddressForm}>
                <h4 className={styles.formTitle}>Endereço Completo</h4>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>CEP *</label>
                    <input
                      type="text"
                      value={endereco.cep}
                      onChange={handleCepChangeInForm}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Logradouro *</label>
                    <input
                      type="text"
                      value={endereco.logradouro}
                      onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                      placeholder="Rua, Avenida, etc."
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Número *</label>
                    <input
                      type="text"
                      value={endereco.numero}
                      onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Complemento</label>
                    <input
                      type="text"
                      value={endereco.complemento}
                      onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                      placeholder="Apto, Sala..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Bairro *</label>
                    <input
                      type="text"
                      value={endereco.bairro}
                      onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                      placeholder="Centro"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cidade *</label>
                    <input
                      type="text"
                      value={endereco.cidade}
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Estado *</label>
                    <select
                      value={endereco.estado}
                      onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setShowFullAddressForm(false)}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                  >
                    Salvar Endereço
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CepInput;