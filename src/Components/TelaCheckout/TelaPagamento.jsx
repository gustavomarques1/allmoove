import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TelaPagamento.module.css';
import { ArrowLeft, MapPin, X, Loader, Edit2, Trash2, Plus, Check, CheckCircle } from 'lucide-react';
import logger from '../../utils/logger';

// Importando os componentes filhos
import ResumoPedido from './ResumoPedidoPagamento/ResumoPedido';
import MetodosPagamento from './MetodosPagamento/MetodosPagamento';
import Stepper from '../Shared/Stepper/Stepper';
import Toast from '../Shared/Toast/Toast';
import CodigoEntrega from '../TelaPagamentoConfirmado/CodigoEntrega/CodigoEntrega';
import DetalhesPedido from '../TelaPagamentoConfirmado/DetalhesPedido/DetalhesPedido';

// Importando services de pedidos (fluxo hierárquico)
import { createPedido } from '../../api/pedidosServices';
import { createPedidoGrupo, gerarCodigoTransacao } from '../../api/pedidoGruposServices';
import { getDistribuidorIdPorNome } from '../../api/distribuidorServices';

function TelaPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados
  const [endereco, setEndereco] = useState(null);
  const [enderecosHistorico, setEnderecosHistorico] = useState([]);
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false); // true = adicionar/editar, false = selecionar do histórico
  const [metodoPagamento, setMetodoPagamento] = useState('Pix');
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [erro, setErro] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);
  const [pedidoConfirmadoData, setPedidoConfirmadoData] = useState(null);
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

  // Steps do checkout
  const checkoutSteps = [
    { label: 'Carrinho' },
    { label: 'Entrega' },
    { label: 'Pagamento' },
    { label: 'Confirmação' }
  ];

  // Carrega histórico de endereços do localStorage
  useEffect(() => {
    // Carrega histórico de endereços
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

  const { cartItems = [], opcaoSelecionada = null } = location.state || {};

  const valorProdutos = cartItems.reduce((acc, item) => {
    const preco = item.precoVenda || item.price || 0;
    return acc + (preco * item.quantity);
  }, 0);
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
    // Se já tem endereços, mostra a lista para seleção
    if (enderecosHistorico.length > 0) {
      setModoEdicao(false);
    } else {
      // Se não tem endereços, vai direto para o formulário
      setModoEdicao(true);
    }

    // Preenche formulário com endereço atual se existir
    if (endereco) {
      setEnderecoForm(endereco);
    }
    setIsModalOpen(true);
  };

  /**
   * Alterna para modo de adição de novo endereço
   */
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
    setModoEdicao(true);
  };

  /**
   * Seleciona um endereço do histórico
   */
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

      setToast({
        message: 'Endereço selecionado com sucesso!',
        type: 'success'
      });
    }
  };

  /**
   * Edita um endereço do histórico
   */
  const handleEditarEndereco = (enderecoId) => {
    const enderecoParaEditar = enderecosHistorico.find(e => e.id === enderecoId);
    if (enderecoParaEditar) {
      setEnderecoForm(enderecoParaEditar);
      setModoEdicao(true);
    }
  };

  /**
   * Exclui um endereço do histórico
   */
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

    setToast({
      message: 'Endereço excluído com sucesso!',
      type: 'success'
    });
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
        logger.error('Erro ao buscar CEP:', error);
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

    setErro('');

    // Fecha modal
    setIsModalOpen(false);
    setModoEdicao(false);

    // Mostra toast de sucesso
    setToast({
      message: enderecoForm.id ? 'Endereço atualizado com sucesso!' : 'Endereço adicionado com sucesso!',
      type: 'success'
    });

    logger.info('Endereço salvo:', enderecoSalvo);
  };

  /**
   * Confirma o pagamento e cria o pedido na API com fluxo hierárquico
   *
   * NOVO FLUXO (3 níveis):
   * 1. Criar PedidoGrupo (1 compra completa)
   * 2. Criar Pedidos (1 por fornecedor) vinculados ao grupo
   * 3. Criar PedidoItems (1 por produto) vinculados a cada pedido
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
      logger.info('🛒 CartItems recebidos:', cartItems);
      logger.info('📍 Endereço:', endereco);
      logger.info('💳 Método de pagamento:', metodoPagamento);
      logger.info('🚚 Opção selecionada:', opcaoSelecionada);

      // ======================
      // 1️⃣ CRIAR PEDIDO GRUPO
      // ======================
      logger.info('\n🎯 ETAPA 1/3: Criando Grupo de Pedidos');

      const codigoTransacao = gerarCodigoTransacao();
      const grupoData = {
        empresa: 1,
        estabelecimento: 1,
        codigo: `COMPRA-${Date.now()}`,
        transacao: codigoTransacao,
        situacao: 'ATIVO'
      };

      const grupoCriado = await createPedidoGrupo(grupoData);
      const grupoId = grupoCriado.id;

      logger.info(`✅ Grupo de Pedidos criado com ID: ${grupoId}`);
      logger.info(`📋 Código: ${grupoCriado.codigo}`);
      logger.info(`🔖 Transação: ${grupoCriado.transacao}`);

      // ======================
      // 2️⃣ AGRUPAR ITENS POR FORNECEDOR
      // ======================
      const itensPorFornecedor = cartItems.reduce((grupos, item) => {
        const fornecedor = item.fornecedor || item.FORNECEDOR || 'TechParts SP';
        if (!grupos[fornecedor]) {
          grupos[fornecedor] = [];
        }
        grupos[fornecedor].push(item);
        return grupos;
      }, {});

      logger.info(`\n📦 Total de ${Object.keys(itensPorFornecedor).length} fornecedor(es) identificado(s)`);

      // Determina tipo de entrega baseado na opção selecionada
      const tipoEntrega = opcaoSelecionada?.tipo === 'urgente' ? 'Urgente' : 'Normal';

      // ======================
      // 3️⃣ CRIAR PEDIDOS E ITENS PARA CADA FORNECEDOR
      // ======================
      const pedidosCriados = [];

      for (const [fornecedor, items] of Object.entries(itensPorFornecedor)) {
        logger.info(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        logger.info(`🏪 Fornecedor: ${fornecedor}`);
        logger.info(`📋 ${items.length} produto(s)`);

        // Calcula valores apenas dos itens deste fornecedor
        const valorProdutosFornecedor = items.reduce((acc, item) => {
          const preco = item.precoVenda || item.price || 0;
          return acc + (preco * item.quantity);
        }, 0);
        const valorFreteFornecedor = valorFrete / Object.keys(itensPorFornecedor).length;
        const totalPagoFornecedor = valorProdutosFornecedor + valorFreteFornecedor;

        logger.info(`💰 Subtotal: R$ ${valorProdutosFornecedor.toFixed(2)}`);
        logger.info(`🚚 Frete: R$ ${valorFreteFornecedor.toFixed(2)}`);
        logger.info(`💳 Total: R$ ${totalPagoFornecedor.toFixed(2)}`);

        // 🔹 3A. BUSCAR idDistribuidor pelo nome do fornecedor
        logger.info(`\n🔍 Buscando idDistribuidor para: ${fornecedor}`);
        const idDistribuidor = await getDistribuidorIdPorNome(fornecedor);

        if (idDistribuidor) {
          logger.info(`✅ idDistribuidor encontrado: ${idDistribuidor}`);
        } else {
          logger.warn(`⚠️ idDistribuidor não encontrado para "${fornecedor}". Pedido será criado sem vínculo ao distribuidor.`);
        }

        // 🔹 3B. CRIAR PEDIDO + ITEMS (backend cria automaticamente)
        logger.info(`\n🔹 Criando Pedido para ${fornecedor}...`);

        const dadosPedido = {
          idGrupoPedido: grupoId, // ⭐ VINCULA AO GRUPO
          idPessoa: parseInt(idPessoa),
          idDistribuidor: idDistribuidor, // ⭐ VINCULA AO DISTRIBUIDOR
          valorFrete: valorFreteFornecedor,
          items: items // Backend cria os PedidoItems automaticamente
        };

        logger.info('📤 Enviando para API:', dadosPedido);

        const pedidoCriado = await createPedido(dadosPedido);
        const pedidoId = pedidoCriado.id;

        logger.info(`✅ Pedido + Items criados com ID: ${pedidoId}`);

        // Gera código de entrega se não vier do backend
        const codigoEntrega = pedidoCriado.codigoEntrega || `M${Math.floor(1000 + Math.random() * 9000)}X${Math.floor(Math.random() * 10)}`;

        // Monta objeto completo do pedido para navegação (inclui dados extras para UX)
        const pedidoCompleto = {
          ...pedidoCriado,
          grupoId: grupoId,
          fornecedor: fornecedor,
          tipoEntrega: tipoEntrega,
          metodoPagamento: metodoPagamento,
          items: items, // Mantém items originais para exibição
          endereco: endereco,
          valorFrete: valorFreteFornecedor,
          valorProdutos: valorProdutosFornecedor,
          totalPago: totalPagoFornecedor,
          codigoEntrega: codigoEntrega,
          status: pedidoCriado.situacao || 'ATIVO',
          prazoEstimado: tipoEntrega === 'Urgente' ? '24-48 horas' : '3-5 dias úteis',
          dataPedido: pedidoCriado.dataHoraCriacaoRegistro || new Date().toISOString()
        };

        // Salva dados extras no cache local (workaround para campos não salvos no banco)
        try {
          localStorage.setItem(`pedido_${pedidoId}`, JSON.stringify({
            grupoId: grupoId,
            fornecedor: fornecedor,
            idDistribuidor: idDistribuidor, // ⭐ Salva idDistribuidor no cache
            tipoEntrega: tipoEntrega,
            metodoPagamento: metodoPagamento,
            codigoEntrega: codigoEntrega,
            totalPago: totalPagoFornecedor
          }));
          logger.info(`💾 Cache salvo para Pedido #${pedidoId}`);
        } catch (e) {
          logger.warn('⚠️ Não foi possível salvar cache:', e);
        }

        pedidosCriados.push(pedidoCompleto);
      }

      // ======================
      // 4️⃣ RESUMO FINAL
      // ======================
      logger.info(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`✅ COMPRA FINALIZADA COM SUCESSO!`);
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`🆔 Grupo ID: ${grupoId}`);
      logger.info(`📦 ${pedidosCriados.length} pedido(s) criado(s)`);
      logger.info(`🛒 ${cartItems.length} produto(s) no total`);
      logger.info(`💰 Total geral: R$ ${valorTotal.toFixed(2)}`);

      // Ao invés de navegar, exibe confirmação inline
      setPedidoConfirmadoData({
        grupoId: grupoId,
        codigoTransacao: codigoTransacao,
        pedidoConfirmado: pedidosCriados[0], // Mostra primeiro pedido
        todosPedidos: pedidosCriados,
        totalGeral: valorTotal
      });
      setPagamentoConfirmado(true);

      // Scroll suave para a seção de confirmação
      setTimeout(() => {
        const confirmacaoSection = document.getElementById('confirmacao-section');
        if (confirmacaoSection) {
          confirmacaoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      logger.error('❌ ERRO AO CRIAR PEDIDO:', error);
      logger.error('❌ Stack completo:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

      if (error.response) {
        logger.error('❌ Status HTTP:', error.response.status);
        logger.error('❌ Dados do erro:', error.response.data);
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

        {/* Seção de Confirmação do Pagamento (aparece após confirmar) */}
        {pagamentoConfirmado && pedidoConfirmadoData && (
          <div id="confirmacao-section" className={styles.confirmacaoSection}>
            <div className={styles.confirmacaoHeader}>
              <CheckCircle size={48} className={styles.confirmacaoIcon} />
              <h2>Pagamento Confirmado!</h2>
              <p>Seu pedido #{pedidoConfirmadoData.pedidoConfirmado.id} foi criado com sucesso e já está sendo processado.</p>
            </div>

            {/* Código de Entrega */}
            <CodigoEntrega codigo={pedidoConfirmadoData.pedidoConfirmado.codigoEntrega} />

            {/* Detalhes do Pedido */}
            <DetalhesPedido pedido={{
              ...pedidoConfirmadoData.pedidoConfirmado,
              itens: pedidoConfirmadoData.pedidoConfirmado.items || pedidoConfirmadoData.pedidoConfirmado.itens,
              pagamento: pedidoConfirmadoData.pedidoConfirmado.metodoPagamento
            }} />

            {/* Botões de Ação após Confirmação */}
            <div className={styles.confirmacaoActions}>
              {/* VERSÃO FINAL: Background Laranja + Texto Branco AllMoove */}
              <button
                className={`${styles.actionButton} ${styles.primaryAllmoove}`}
                onClick={() => navigate('/assistencia/dashboard')}
              >
                Voltar ao Dashboard
              </button>

              <button
                className={`${styles.actionButton} ${styles.secondary}`}
                onClick={() => navigate('/assistencia/loja')}
              >
                Fazer Novo Pedido
              </button>
            </div>
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
                {modoEdicao
                  ? 'Preencha o endereço completo para entrega do pedido.'
                  : 'Selecione um endereço salvo ou adicione um novo.'}
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

            {/* Formulário de Endereço */}
            {modoEdicao && (
              <form onSubmit={handleSalvarEndereco} className={styles.enderecoForm}>
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
            )}
          </div>
        </div>
      )}

      {/* Footer - Oculta quando pagamento confirmado */}
      {!pagamentoConfirmado && (
        <footer className={styles.footer}>
          <button
            className={`${styles.actionButton} ${styles.secondary}`}
            onClick={() => navigate(-1)}
            disabled={criandoPedido}
          >
            Voltar
          </button>
          <button
            className={`${styles.actionButton} ${styles.primaryAllmoove}`}
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
      )}
    </div>
  );
}

export default TelaPagamento;