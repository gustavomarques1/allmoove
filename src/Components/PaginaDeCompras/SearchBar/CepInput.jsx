// CEPInput.jsx - Sistema integrado de múltiplos endereços
import React, { useState, useEffect } from 'react';
import logger from '../../../utils/logger';
import { flushSync } from 'react-dom';
import { MapPin, X, Loader, Edit2, Trash2, Plus, Check } from 'lucide-react';
import styles from './CepInput.module.css';
import Toast from '../../Shared/Toast/Toast';

function CepInput() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endereco, setEndereco] = useState(null);
  const [enderecosHistorico, setEnderecosHistorico] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false); // false = lista, true = formulário
  const [isLoading, setIsLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [enderecoForm, setEnderecoForm] = useState({
    descricao: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Carrega histórico de endereços do localStorage ao montar
  useEffect(() => {
    const historico = localStorage.getItem('enderecosHistorico');
    if (historico) {
      const enderecosArray = JSON.parse(historico);
      setEnderecosHistorico(enderecosArray);

      // Define o último endereço como ativo (mais recente)
      if (enderecosArray.length > 0) {
        const enderecoAtivo = enderecosArray[enderecosArray.length - 1];
        setEndereco(enderecoAtivo);
        setEnderecoSelecionadoId(enderecoAtivo.id);
      }
    } else {
      // MIGRAÇÃO: Se existir endereço antigo no formato legado, migra para novo formato
      const enderecoLegado = localStorage.getItem('endereco');
      if (enderecoLegado) {
        const enderecoObj = JSON.parse(enderecoLegado);
        const novoEndereco = {
          ...enderecoObj,
          id: Date.now(),
          nome: `${enderecoObj.cidade}/${enderecoObj.estado} - ${enderecoObj.logradouro}`
        };
        const novoHistorico = [novoEndereco];

        localStorage.setItem('enderecosHistorico', JSON.stringify(novoHistorico));
        localStorage.removeItem('endereco'); // Remove formato legado

        setEnderecosHistorico(novoHistorico);
        setEndereco(novoEndereco);
        setEnderecoSelecionadoId(novoEndereco.id);
      }
    }
  }, []);

  // Listener para sincronização quando checkout alterar endereços
  useEffect(() => {
    const handleEnderecoUpdated = () => {
      const historico = localStorage.getItem('enderecosHistorico');
      if (historico) {
        const enderecosArray = JSON.parse(historico);
        setEnderecosHistorico(enderecosArray);

        // Mantém o endereço selecionado se ainda existir
        const enderecoAtual = enderecosArray.find(e => e.id === enderecoSelecionadoId);
        if (enderecoAtual) {
          setEndereco(enderecoAtual);
        } else if (enderecosArray.length > 0) {
          // Se o selecionado foi removido, pega o último
          const ultimo = enderecosArray[enderecosArray.length - 1];
          setEndereco(ultimo);
          setEnderecoSelecionadoId(ultimo.id);
        }
      }
    };

    window.addEventListener('enderecoUpdated', handleEnderecoUpdated);
    return () => window.removeEventListener('enderecoUpdated', handleEnderecoUpdated);
  }, [enderecoSelecionadoId]);

  const handleOpenModal = () => {
    // Se já tem endereços, mostra a lista
    if (enderecosHistorico.length > 0) {
      setModoEdicao(false);
    } else {
      // Se não tem, vai direto para o formulário
      setModoEdicao(true);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModoEdicao(false);
    setEnderecoForm({
      descricao: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
    setCepError('');
    setCepSuccess(false);
  };

  const handleAdicionarNovoEndereco = () => {
    setEnderecoForm({
      descricao: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
    setCepError('');
    setCepSuccess(false);
    setModoEdicao(true);
  };

  const handleSelecionarEndereco = (enderecoId) => {
    const enderecoSelecionado = enderecosHistorico.find(e => e.id === enderecoId);
    if (enderecoSelecionado) {
      // Força atualização síncrona do estado
      flushSync(() => {
        setEndereco(enderecoSelecionado);
        setEnderecoSelecionadoId(enderecoId);
      });

      // Fecha o modal
      setIsModalOpen(false);

      // Dispara evento para sincronizar com checkout
      window.dispatchEvent(new Event('enderecoUpdated'));

      setToast({
        message: 'Endereço selecionado! Frete será calculado para esta localização.',
        type: 'success'
      });
    }
  };

  const handleEditarEndereco = (enderecoId) => {
    const enderecoParaEditar = enderecosHistorico.find(e => e.id === enderecoId);
    if (enderecoParaEditar) {
      setEnderecoForm(enderecoParaEditar);
      setCepError('');
      setCepSuccess(false);
      setModoEdicao(true);
    }
  };

  const handleExcluirEndereco = (enderecoId) => {
    const novosEnderecos = enderecosHistorico.filter(e => e.id !== enderecoId);
    setEnderecosHistorico(novosEnderecos);
    localStorage.setItem('enderecosHistorico', JSON.stringify(novosEnderecos));

    // Se excluiu o endereço ativo, seleciona o último disponível
    if (enderecoSelecionadoId === enderecoId) {
      if (novosEnderecos.length > 0) {
        const novoAtivo = novosEnderecos[novosEnderecos.length - 1];
        setEndereco(novoAtivo);
        setEnderecoSelecionadoId(novoAtivo.id);
      } else {
        setEndereco(null);
        setEnderecoSelecionadoId(null);
      }
    }

    // Dispara evento para sincronizar com checkout
    window.dispatchEvent(new Event('enderecoUpdated'));

    setToast({
      message: 'Endereço excluído com sucesso!',
      type: 'success'
    });
  };

  const handleEnderecoChange = (campo, valor) => {
    setEnderecoForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCepChange = async (e) => {
    const valor = e.target.value;
    const cepLimpo = valor.replace(/\D/g, '');

    // Formata CEP
    let cepFormatado = cepLimpo;
    if (cepLimpo.length > 5) {
      cepFormatado = `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`;
    }

    handleEnderecoChange('cep', cepFormatado);

    // Limpa mensagens anteriores
    setCepError('');
    setCepSuccess(false);

    // Busca automática quando CEP completo
    if (cepLimpo.length === 8) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado. Verifique e tente novamente.');
          setCepSuccess(false);
        } else {
          setEnderecoForm(prev => ({
            ...prev,
            logradouro: data.logradouro || prev.logradouro,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            estado: data.uf || prev.estado
          }));
          setCepSuccess(true);
          setCepError('');
        }
      } catch (error) {
        logger.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao buscar CEP. Tente novamente.');
        setCepSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSalvarEndereco = (e) => {
    e.preventDefault();

    // Valida campos obrigatórios
    if (!enderecoForm.cep || !enderecoForm.logradouro || !enderecoForm.numero ||
        !enderecoForm.bairro || !enderecoForm.cidade || !enderecoForm.estado) {
      setToast({
        message: 'Por favor, preencha todos os campos obrigatórios.',
        type: 'error'
      });
      return;
    }

    let novosEnderecos;
    let enderecoSalvo;

    // Verifica se está editando um endereço existente
    if (enderecoForm.id) {
      // Atualiza endereço existente e recalcula o nome
      enderecoSalvo = {
        ...enderecoForm,
        nome: enderecoForm.descricao
          ? `${enderecoForm.cidade}/${enderecoForm.estado} - ${enderecoForm.descricao}`
          : `${enderecoForm.cidade}/${enderecoForm.estado} - ${enderecoForm.logradouro}`
      };
      novosEnderecos = enderecosHistorico.map(e =>
        e.id === enderecoForm.id ? enderecoSalvo : e
      );
    } else {
      // Cria novo endereço com ID único
      enderecoSalvo = {
        ...enderecoForm,
        id: Date.now(),
        nome: enderecoForm.descricao
          ? `${enderecoForm.cidade}/${enderecoForm.estado} - ${enderecoForm.descricao}`
          : `${enderecoForm.cidade}/${enderecoForm.estado} - ${enderecoForm.logradouro}`
      };
      novosEnderecos = [...enderecosHistorico, enderecoSalvo];
    }

    // Salva no localStorage primeiro
    localStorage.setItem('enderecosHistorico', JSON.stringify(novosEnderecos));

    // Força atualização síncrona dos estados
    flushSync(() => {
      setEnderecosHistorico(novosEnderecos);
      setEndereco(enderecoSalvo);
      setEnderecoSelecionadoId(enderecoSalvo.id);
    });

    // Fecha modal
    setIsModalOpen(false);
    setModoEdicao(false);

    // Dispara evento para sincronizar com checkout
    window.dispatchEvent(new Event('enderecoUpdated'));

    // Mostra toast de sucesso
    setToast({
      message: enderecoForm.id
        ? 'Endereço atualizado! Frete será recalculado.'
        : 'Endereço adicionado! Frete será calculado para esta localização.',
      type: 'success'
    });

    logger.info('Endereço salvo:', enderecoSalvo);
  };

  const formatCep = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
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
      {/* Toast de Notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className={styles.cepInput} onClick={handleOpenModal}>
        <MapPin size={14} className={styles.cepInputIcon} />
        <div className={styles.cepInputContent}>
          <span className={styles.cepInputLabel}>Enviar para</span>
          <span className={styles.cepInputValue}>
            {endereco
              ? endereco.nome || `${endereco.cidade}/${endereco.estado} - ${formatCep(endereco.cep)}`
              : 'Informe seu CEP'}
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
              <h3>Endereço de Entrega</h3>
              <p className={styles.modalSubtitle}>
                {modoEdicao
                  ? 'Preencha o endereço para calcular o frete e prazo de entrega.'
                  : 'Selecione um endereço salvo ou adicione um novo para calcular o frete.'}
              </p>
            </div>

            {/* Lista de Endereços Salvos */}
            {!modoEdicao && (
              <div className={styles.enderecosLista}>
                {enderecosHistorico.map((end) => (
                  <div
                    key={end.id}
                    className={`${styles.enderecoItem} ${
                      enderecoSelecionadoId === end.id ? styles.enderecoItemAtivo : ''
                    }`}
                  >
                    <div className={styles.enderecoItemInfo} onClick={() => handleSelecionarEndereco(end.id)}>
                      {enderecoSelecionadoId === end.id && (
                        <Check size={20} className={styles.checkIcon} />
                      )}
                      <div className={styles.enderecoItemDetalhes}>
                        <p className={styles.enderecoItemNome}>{end.nome || 'Endereço'}</p>
                        <p className={styles.enderecoItemEndereco}>
                          {end.logradouro}, {end.numero}
                          {end.complemento && ` - ${end.complemento}`}
                        </p>
                        <p className={styles.enderecoItemCidade}>
                          {end.bairro} - {end.cidade}/{end.estado} - CEP: {end.cep}
                        </p>
                      </div>
                    </div>
                    <div className={styles.enderecoItemAcoes}>
                      <button
                        type="button"
                        onClick={() => handleEditarEndereco(end.id)}
                        className={styles.btnEditar}
                        title="Editar endereço"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExcluirEndereco(end.id)}
                        className={styles.btnExcluir}
                        title="Excluir endereço"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAdicionarNovoEndereco}
                  className={styles.btnAdicionarNovo}
                >
                  <Plus size={18} />
                  Adicionar Novo Endereço
                </button>
              </div>
            )}

            {/* Formulário de Endereço Completo */}
            {modoEdicao && (
              <form onSubmit={handleSalvarEndereco} className={styles.fullAddressForm}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Descrição (opcional)</label>
                    <input
                      type="text"
                      value={enderecoForm.descricao}
                      onChange={(e) => handleEnderecoChange('descricao', e.target.value)}
                      placeholder="Ex: Minha casa, Trabalho, Casa dos pais..."
                      maxLength={50}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>CEP *</label>
                    <div className={styles.inputWithFeedback}>
                      <input
                        type="text"
                        value={enderecoForm.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        maxLength={9}
                        required
                        className={cepSuccess ? styles.inputSuccess : cepError ? styles.inputError : ''}
                      />
                      {isLoading && (
                        <div className={styles.inputIcon}>
                          <Loader size={16} className={styles.spinner} />
                        </div>
                      )}
                    </div>
                    {cepError && <span className={styles.errorMessage}>{cepError}</span>}
                    {cepSuccess && <span className={styles.successMessage}>✓ CEP válido</span>}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Logradouro *</label>
                    <input
                      type="text"
                      value={enderecoForm.logradouro}
                      onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                      placeholder="Rua, Avenida, etc."
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Número *</label>
                    <input
                      type="text"
                      value={enderecoForm.numero}
                      onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                      placeholder="123"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Complemento</label>
                    <input
                      type="text"
                      value={enderecoForm.complemento}
                      onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                      placeholder="Apto, Sala..."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Bairro *</label>
                    <input
                      type="text"
                      value={enderecoForm.bairro}
                      onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                      placeholder="Centro"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cidade *</label>
                    <input
                      type="text"
                      value={enderecoForm.cidade}
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Estado *</label>
                    <select
                      value={enderecoForm.estado}
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
                  {enderecosHistorico.length > 0 && (
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={() => setModoEdicao(false)}
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Buscando...' : 'Salvar Endereço'}
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
