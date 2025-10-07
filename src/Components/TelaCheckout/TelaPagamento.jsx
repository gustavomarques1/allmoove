import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft, MapPin, X, Loader } from 'lucide-react';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';
import Stepper from '../Shared/Stepper/Stepper';
import Toast from '../Shared/Toast/Toast';

// Importando service de pedidos
import { createPedido, validarDadosPedido } from '../../api/pedidosServices';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [endereco, setEndereco] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState('Pix');
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [erro, setErro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [enderecoForm, setEnderecoForm] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Steps do checkout
  const checkoutSteps = [
    { label: 'Carrinho' },
    { label: 'Entrega' },
    { label: 'Pagamento' },
    { label: 'Confirmação' }
  ];

  // Carrega endereço do localStorage
  useEffect(() => {
    const enderecoSalvo = localStorage.getItem('endereco');
    if (enderecoSalvo) {
      setEndereco(JSON.parse(enderecoSalvo));
    }
  }, []);

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  const valorProdutos = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const valorFrete = opcaoSelecionada?.preco || 0;
  const valorTotal = valorProdutos + valorFrete;

  /**
   * Valida se o endereço está completo
   */
  const validarEndereco = () => {
    if (!endereco) return false;
    const camposObrigatorios = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
    return camposObrigatorios.every(campo => endereco[campo] && endereco[campo].trim() !== '');
  };

  // Verifica se pode confirmar pagamento
  const podeConfirmar = validarEndereco() && cartItems.length > 0 && !criandoPedido;

  /**
   * Abre modal de endereço
   */
  const handleAbrirModal = () => {
    // Preenche formulário com endereço atual se existir
    if (endereco) {
      setEnderecoForm(endereco);
    }
    setIsModalOpen(true);
  };

  /**
   * Fecha modal de endereço
   */
  const handleFecharModal = () => {
    setIsModalOpen(false);
  };

  /**
   * Atualiza campo do formulário de endereço
   */
  const handleEnderecoChange = (campo, valor) => {
    setEnderecoForm(prev => ({ ...prev, [campo]: valor }));
  };

  /**
   * Busca CEP na API ViaCEP
   */
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
      setIsLoadingCep(true);
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
        console.error('Erro ao buscar CEP:', error);
        setCepError('Erro ao buscar CEP. Tente novamente.');
        setCepSuccess(false);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  /**
   * Salva endereço do formulário
   */
  const handleSalvarEndereco = (e) => {
    e.preventDefault();

    // Valida campos obrigatórios
    if (!enderecoForm.cep || !enderecoForm.logradouro || !enderecoForm.numero ||
        !enderecoForm.bairro || !enderecoForm.cidade || !enderecoForm.estado) {
      setErro('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }

    // Salva no localStorage
    localStorage.setItem('endereco', JSON.stringify(enderecoForm));
    setEndereco(enderecoForm);

    // Fecha modal
    setIsModalOpen(false);
    setErro('');

    // Mostra toast de sucesso
    setToast({
      message: 'Endereço salvo com sucesso!',
      type: 'success'
    });

    console.log('Endereço salvo:', enderecoForm);
  };

  /**
   * Confirma o pagamento e cria o pedido na API
   */
  const handleConfirmPayment = async () => {
    // Validações
    if (!validarEndereco()) {
      setErro('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }

    if (cartItems.length === 0) {
      setErro('Carrinho vazio. Adicione produtos antes de finalizar.');
      return;
    }

    setCriandoPedido(true);
    setErro('');

    try {
      // Pega ID da assistência do localStorage
      const idPessoa = localStorage.getItem('idPessoa');

      if (!idPessoa) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      // Debug: Verifica dados do carrinho
      console.log('🛒 CartItems recebidos:', cartItems);
      console.log('📍 Endereço:', endereco);
      console.log('💳 Método de pagamento:', metodoPagamento);
      console.log('🚚 Opção selecionada:', opcaoSelecionada);

      // Determina fornecedor baseado nos itens do carrinho
      // (assumindo que todos os itens são do mesmo fornecedor por enquanto)
      const fornecedor = cartItems[0]?.fornecedor || cartItems[0]?.FORNECEDOR || 'TechParts SP';

      // Determina tipo de entrega baseado na opção selecionada
      const tipoEntrega = opcaoSelecionada?.tipo === 'urgente' ? 'Urgente' : 'Normal';

      // Monta dados completos do pedido conforme especificação da API
      const dadosPedido = {
        idPessoa: parseInt(idPessoa),
        fornecedor: fornecedor,
        tipoEntrega: tipoEntrega,
        metodoPagamento: metodoPagamento, // "Pix" ou "Cartão de Crédito"
        items: cartItems,
        endereco: endereco,
        valorFrete: valorFrete,
        valorProdutos: valorProdutos,
        totalPago: valorTotal
      };

      console.log('📤 Enviando pedido completo para API:', dadosPedido);
      console.log('📤 JSON stringified:', JSON.stringify(dadosPedido, null, 2));

      // Valida dados antes de enviar
      const validacao = validarDadosPedido(dadosPedido);
      if (!validacao.valid) {
        console.error('❌ Erros de validação:', validacao.errors);
        throw new Error(`Dados inválidos: ${validacao.errors.join(', ')}`);
      }

      // Chama API para criar pedido
      const pedidoCriado = await createPedido(dadosPedido);

      console.log('✅ Pedido criado com sucesso:', pedidoCriado);
      console.log('✅ Resposta da API (JSON):', JSON.stringify(pedidoCriado, null, 2));

      // Verifica se a resposta tem os campos esperados
      if (!pedidoCriado || !pedidoCriado.id) {
        console.warn('⚠️ Resposta da API não tem ID do pedido. Usando dados enviados como fallback.');
      }

      // Navega para tela de confirmação passando dados do pedido retornados pela API
      navigate('/assistencia/payment-success', {
        state: {
          pedidoConfirmado: pedidoCriado
        }
      });

    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      console.error('❌ Erro completo:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

      if (error.response) {
        console.error('❌ Status HTTP:', error.response.status);
        console.error('❌ Dados do erro:', error.response.data);
        setErro(`Erro ${error.response.status}: ${error.response.data?.message || error.message}`);
      } else {
        setErro(error.message || 'Erro ao finalizar pedido. Tente novamente.');
      }
    } finally {
      setCriandoPedido(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <ArrowLeft />
        </button>
        <h2>Pagamento</h2>
      </header>

      {/* Stepper de Progresso */}
      <Stepper steps={checkoutSteps} currentStep={3} />

      {/* Toast de Notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className={styles.mainContent}>
        {/* Card de Endereço */}
        <div className={styles.enderecoCard}>
          <div className={styles.enderecoHeader}>
            <MapPin size={20} className={styles.enderecoIcon} />
            <h3>Endereço de Entrega</h3>
          </div>

          {endereco ? (
            <div className={styles.enderecoInfo}>
              <p className={styles.enderecoDestaque}>
                {endereco.logradouro}, {endereco.numero}
                {endereco.complemento && ` - ${endereco.complemento}`}
              </p>
              <p className={styles.enderecoDetalhes}>
                {endereco.bairro} - {endereco.cidade}/{endereco.estado}
              </p>
              <p className={styles.enderecoCep}>CEP: {endereco.cep}</p>
              <button
                className={styles.editarEnderecoButton}
                onClick={handleAbrirModal}
              >
                Alterar endereço
              </button>
            </div>
          ) : (
            <div className={styles.semEndereco}>
              <p>Nenhum endereço cadastrado</p>
              <button
                className={styles.adicionarEnderecoButton}
                onClick={handleAbrirModal}
              >
                <MapPin size={16} />
                Cadastrar Endereço
              </button>
            </div>
          )}
        </div>

        {/* Resumo do Pedido */}
        <ResumoPedido cartItems={cartItems} opcaoSelecionada={opcaoSelecionada} />

        {/* Métodos de Pagamento */}
        <MetodosPagamento
          valorTotal={valorTotal}
          onMetodoChange={setMetodoPagamento}
          metodoPagamentoAtual={metodoPagamento}
        />

        {/* Mensagem de Erro */}
        {erro && (
          <div className={styles.erroContainer}>
            <span className={styles.erroIcon}>⚠️</span>
            <p className={styles.erroMensagem}>{erro}</p>
          </div>
        )}
      </main>

      {/* Modal de Endereço */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleFecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleFecharModal}>
              <X size={20} />
            </button>

            <div className={styles.modalHeader}>
              <h3>Endereço de Entrega</h3>
              <p className={styles.modalSubtitle}>
                Preencha o endereço completo para entrega do pedido.
              </p>
            </div>

            <form onSubmit={handleSalvarEndereco} className={styles.enderecoForm}>
              <div className={styles.formGrid}>
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
                    {isLoadingCep && (
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
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleFecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isLoadingCep}
                >
                  {isLoadingCep ? 'Buscando...' : 'Salvar Endereço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <button
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={() => navigate(-1)}
          disabled={criandoPedido}
        >
          Voltar
        </button>
        <button
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={handleConfirmPayment}
          disabled={!podeConfirmar}
          title={
            !podeConfirmar ? (
              !validarEndereco() ? 'Preencha o endereço de entrega' :
              cartItems.length === 0 ? 'Adicione itens ao carrinho' : ''
            ) : ''
          }
        >
          {criandoPedido ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </footer>
    </div>
  );
}

export default TelaPagamento;