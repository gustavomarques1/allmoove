import React, { useState, useMemo } from "react";
import styles from "./DistribuidorDashboard.module.css";
import logger from "../../../utils/logger";
// Importações dos ícones que você precisará (ex: de 'lucide-react')
import {
  Package,
  CheckCircle,
  Clock,
  Plus,
  CircleCheck,
  Info,
  Search,
  Truck,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePedidosDistribuidor } from "../../../hooks/usePedidosDistribuidor";
import { updateStatusPedido } from "../../../api/pedidosServices";
import formatCurrency from "../../../utils/formatCurrency";
import Loader from "../../Shared/Loader/Loader";
import Toast from "../../Shared/Toast/Toast";
import PedidoTimeline from "../PedidoTimeline/PedidoTimeline";

function DistribuidorDashboard() {
  const navigate = useNavigate();
  const { pedidos, isLoading, error, indicadores } = usePedidosDistribuidor();
  const [processandoPedido, setProcessandoPedido] = useState(null);
  const [toast, setToast] = useState(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [mostrarTodosPedidos, setMostrarTodosPedidos] = useState(false);
  const [pedidosLocal, setPedidosLocal] = useState([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('dia'); // 'dia', 'mes' ou 'mesAnterior'

  // Sincroniza pedidos do hook com estado local
  React.useEffect(() => {
    setPedidosLocal(pedidos);
  }, [pedidos]);

  const handleAceitarPedido = async (e, pedidoId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      logger.info('🔄 Iniciando aceite do pedido:', pedidoId);
      setProcessandoPedido(pedidoId);

      // Atualização otimista do estado local
      setPedidosLocal(prevPedidos =>
        prevPedidos.map(p =>
          p.id === pedidoId ? { ...p, status: 'Aceito' } : p
        )
      );

      // Chama a API para atualizar no backend
      await updateStatusPedido(pedidoId, 'Aceito', 'Pedido aceito pelo distribuidor');
      logger.info('✅ Status atualizado na API com sucesso');

      setToast({
        type: 'success',
        message: 'Pedido aceito com sucesso!'
      });
    } catch (err) {
      logger.error('❌ Erro ao aceitar pedido:', err);

      // Reverte a atualização otimista em caso de erro
      setPedidosLocal(pedidos);

      setToast({
        type: 'error',
        message: err.message || 'Erro ao aceitar pedido. Tente novamente.'
      });
    } finally {
      setProcessandoPedido(null);
      logger.info('🏁 Processo finalizado');
    }
  };

  // Função para mudar status do pedido (transições entre etapas)
  const handleMudarStatus = async (e, pedidoId, novoStatus) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      setProcessandoPedido(pedidoId);

      // Atualização otimista do estado local
      setPedidosLocal(prevPedidos =>
        prevPedidos.map(p =>
          p.id === pedidoId ? { ...p, status: novoStatus } : p
        )
      );

      // Chama a API para atualizar no backend
      await updateStatusPedido(pedidoId, novoStatus, `Status alterado para ${novoStatus}`);
      logger.info('✅ Status atualizado na API com sucesso');

      setToast({
        type: 'success',
        message: `Status atualizado para "${novoStatus}"!`
      });
    } catch (err) {
      logger.error('Erro ao mudar status:', err);

      // Reverte a atualização otimista em caso de erro
      setPedidosLocal(pedidos);

      setToast({
        type: 'error',
        message: err.message || 'Erro ao atualizar status.'
      });
    } finally {
      setProcessandoPedido(null);
    }
  };

  const handleGerenciarEstoque = () => {
    navigate('/distribuidor/estoque');
  };

  // Filtrar pedidos por busca e status
  const pedidosFiltrados = useMemo(() => {
    return pedidosLocal.filter(pedido => {
      const matchesSearch =
        pedido.id?.toString().includes(searchTerm) ||
        pedido.codigoEntrega?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'todos' ||
        pedido.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [pedidosLocal, searchTerm, statusFilter]);

  // Pedidos visíveis (limitados a 5 ou todos)
  const pedidosVisiveis = useMemo(() => {
    return mostrarTodosPedidos ? pedidosFiltrados : pedidosFiltrados.slice(0, 5);
  }, [pedidosFiltrados, mostrarTodosPedidos]);

  // Função para obter saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Função para obter a classe CSS baseada no status
  const getStatusClass = (status) => {
    const statusNormalizado = status?.toLowerCase() || '';

    if (statusNormalizado.includes('aguardando aceite')) {
      return styles["distribuidor-order-tag-aguardando-aceite"];
    }
    if (statusNormalizado.includes('aceito') || statusNormalizado.includes('confirmado')) {
      return styles["distribuidor-order-tag-aceito"];
    }
    if (statusNormalizado.includes('separação')) {
      return styles["distribuidor-order-tag-separacao"];
    }
    if (statusNormalizado.includes('aguardando retirada')) {
      return styles["distribuidor-order-tag-aguardando-retirada"];
    }
    if (statusNormalizado.includes('trânsito') || statusNormalizado.includes('transito')) {
      return styles["distribuidor-order-tag-transito"];
    }
    if (statusNormalizado.includes('entregue') || statusNormalizado.includes('concluído') || statusNormalizado.includes('concluido')) {
      return styles["distribuidor-order-tag-concluido"];
    }

    return styles["distribuidor-order-tag-eletronicos"]; // fallback
  };

  // Função para obter a cor da borda baseada no status
  const getStatusBorderColor = (status) => {
    const statusNormalizado = status?.toLowerCase() || '';

    if (statusNormalizado.includes('aguardando aceite')) return '#FF3600';
    if (statusNormalizado.includes('aceito')) return '#3B82F6';
    if (statusNormalizado.includes('separação')) return '#8B5CF6';
    if (statusNormalizado.includes('aguardando retirada')) return '#F59E0B';
    if (statusNormalizado.includes('trânsito') || statusNormalizado.includes('transito')) return '#06B6D4';
    if (statusNormalizado.includes('entregue') || statusNormalizado.includes('concluído') || statusNormalizado.includes('concluido')) return '#10B981';

    return '#e5e7eb';
  };

  // Função para calcular tempo decorrido
  const getTempoDecorrido = (dataPedido) => {
    const agora = new Date();
    const data = new Date(dataPedido);
    const diffMs = agora - data;
    const diffMinutos = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMinutos < 60) return `Há ${diffMinutos} min`;
    if (diffHoras < 24) return `Há ${diffHoras}h`;
    if (diffDias === 1) return 'Há 1 dia';
    return `Há ${diffDias} dias`;
  };

  // Função para verificar se pedido é novo (últimas 24h)
  const isPedidoNovo = (dataPedido) => {
    const agora = new Date();
    const data = new Date(dataPedido);
    const diffHoras = (agora - data) / 3600000;
    return diffHoras <= 24;
  };

  // Função para calcular progresso do pedido (0-100%)
  const getProgressoPedido = (status) => {
    const statusNormalizado = status?.toLowerCase() || '';

    if (statusNormalizado.includes('aguardando aceite')) return 16;
    if (statusNormalizado.includes('aceito')) return 33;
    if (statusNormalizado.includes('separação')) return 50;
    if (statusNormalizado.includes('aguardando retirada')) return 66;
    if (statusNormalizado.includes('trânsito') || statusNormalizado.includes('transito')) return 83;
    if (statusNormalizado.includes('entregue') || statusNormalizado.includes('concluído') || statusNormalizado.includes('concluido')) return 100;

    return 0;
  };

  return (
    <div className={styles["distribuidor-page"]}>
      {/* Cabeçalho principal com saudação */}
      <div className={styles["distribuidor-header-section"]}>
        <div className={styles["distribuidor-header"]}>
          <div className={styles["welcome-section"]}>
            <h1 className={styles["welcome-title"]}>
              {getSaudacao()}, <span className={styles["user-name"]}>Distribuidor Parceiro!</span>
            </h1>
            <p className={styles["welcome-subtitle"]}>
              Painel de Controle e Gestão
            </p>
          </div>
          <div className={styles["header-actions"]}>
            <button
              type="button"
              className={styles["distribuidor-stock-button-header"]}
              onClick={handleGerenciarEstoque}
            >
              <Package size={18} />
              Gerenciar Estoque
            </button>
            <p className={styles["header-actions-description"]}>
              Controle de produtos
            </p>
          </div>
        </div>
      </div>

      {/* Seletor de Período */}
      <div className={styles["periodo-selector-container"]}>
        <div className={styles["periodo-selector"]}>
          <button
            type="button"
            className={`${styles["periodo-button"]} ${periodoSelecionado === 'dia' ? styles["periodo-button-active"] : ''}`}
            onClick={() => setPeriodoSelecionado('dia')}
          >
            Relatório Diário
          </button>
          <button
            type="button"
            className={`${styles["periodo-button"]} ${periodoSelecionado === 'mes' ? styles["periodo-button-active"] : ''}`}
            onClick={() => setPeriodoSelecionado('mes')}
          >
            Relatório Mensal
          </button>
          <button
            type="button"
            className={`${styles["periodo-button"]} ${periodoSelecionado === 'mesAnterior' ? styles["periodo-button-active"] : ''}`}
            onClick={() => setPeriodoSelecionado('mesAnterior')}
          >
            Mês Anterior
          </button>
        </div>
      </div>

      {/* Seção de Cards Superiores (Métricas) */}
      <div className={styles["distribuidor-top-cards-grid"]}>
        {/* Card: Ticket Médio */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Ticket Médio
            </h3>
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : formatCurrency(indicadores[periodoSelecionado]?.ticketMedio || 0, 'BRL')}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Valor médio por pedido
          </p>
        </div>

        {/* Card: Valor */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Valor
            </h3>
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : formatCurrency(indicadores[periodoSelecionado]?.valorTotal || 0, 'BRL')}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Faturamento total
          </p>
        </div>

        {/* Card: Volume */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Volume
            </h3>
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : indicadores[periodoSelecionado]?.volumeTotal || 0}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Itens vendidos
          </p>
        </div>

        {/* Card: Pedidos */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Pedidos
            </h3>
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : indicadores[periodoSelecionado]?.totalPedidos || 0}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Total de pedidos
          </p>
        </div>
      </div>

      {/* Seção Painel de Controle - Entregas de Peças */}
      <div className={styles["distribuidor-control-panel-section"]}>
        <h3 className={styles["distribuidor-control-panel-title"]}>
          Painel de Controle - Entregas
        </h3>
        <p className={styles["distribuidor-control-panel-subtitle"]}>
          Gerencie pedidos e gere códigos para entregadores
        </p>

        {/* Campo de Busca */}
        {!isLoading && !error && pedidosLocal.length > 0 && (
          <>
            <div className={styles["search-container"]}>
              <Search size={18} className={styles["search-icon"]} />
              <input
                type="search"
                placeholder="Buscar por ID ou código de entrega..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
              />
            </div>

            {/* Filtros de Status */}
            <div className={styles["status-filters"]}>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'todos' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('todos')}
              >
                Todos ({pedidosLocal.length})
              </button>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'aguardando aceite' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('aguardando aceite')}
              >
                <Clock size={16} />
                Aguardando Aceite
              </button>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'aceito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('aceito')}
              >
                <CheckCircle size={16} />
                Aceito
              </button>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'em separação' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('em separação')}
              >
                <Package size={16} />
                Em Separação
              </button>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'em trânsito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('em trânsito')}
              >
                <Truck size={16} />
                Em Trânsito
              </button>
              <button
                type="button"
                className={`${styles["filter-btn"]} ${statusFilter === 'entregue ao cliente' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('entregue ao cliente')}
              >
                <CircleCheck size={16} />
                Entregue
              </button>
            </div>
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Carregando pedidos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
            <p>❌ {error}</p>
          </div>
        )}

        {/* Mensagem quando não há pedidos */}
        {!isLoading && !error && pedidosLocal.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Nenhum pedido encontrado.</p>
          </div>
        )}

        {/* Mensagem quando não há resultados nos filtros */}
        {!isLoading && !error && pedidosLocal.length > 0 && pedidosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Nenhum pedido encontrado com os filtros aplicados.</p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setStatusFilter('todos'); }}
              style={{
                marginTop: '1rem',
                backgroundColor: '#FF3600',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Lista de Pedidos Filtrados */}
        {!isLoading && !error && pedidosVisiveis.map((pedido) => (
          <div
            key={pedido.id}
            className={styles["distribuidor-order-item"]}
            style={{ borderLeft: `4px solid ${getStatusBorderColor(pedido.status)}` }}
          >
            {/* Badge NOVO */}
            {isPedidoNovo(pedido.dataPedido || pedido.dataHoraCriacaoRegistro) && (
              <span className={styles["badge-novo"]}>NOVO</span>
            )}

            <div className={styles["distribuidor-order-details"]}>
              <Package size={24} className={styles["distribuidor-order-icon"]} />
              <div className={styles["distribuidor-order-text"]}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p className={styles["distribuidor-order-plate"]}>
                    Pedido #{pedido.id}
                  </p>
                  <span className={styles["tempo-decorrido"]}>
                    <Clock size={14} />
                    {getTempoDecorrido(pedido.dataPedido || pedido.dataHoraCriacaoRegistro)}
                  </span>
                </div>
                <p className={styles["distribuidor-order-model"]}>
                  {pedido.items?.length || 0} {pedido.items?.length === 1 ? 'item' : 'itens'}
                </p>
                <div className={styles["distribuidor-order-tags"]}>
                  <span className={getStatusClass(pedido.status)}>
                    {pedido.status}
                  </span>
                  <span className={styles["distribuidor-order-tag-eletronicos"]}>
                    {pedido.tipoEntrega || 'Normal'}
                  </span>
                </div>

                {/* Mini Barra de Progresso */}
                <div className={styles["progress-bar-container"]}>
                  <div className={styles["progress-bar-bg"]}>
                    <div
                      className={styles["progress-bar-fill"]}
                      style={{
                        width: `${getProgressoPedido(pedido.status)}%`,
                        backgroundColor: getStatusBorderColor(pedido.status)
                      }}
                    ></div>
                  </div>
                  <span className={styles["progress-text"]}>
                    {getProgressoPedido(pedido.status)}% completo
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["distribuidor-order-info"]}>
              <p className={styles["distribuidor-order-price"]}>
                {formatCurrency(pedido.totalPago || 0, 'BRL')}
              </p>
              <p className={styles["distribuidor-order-date"]}>
                {pedido.dataPedido || pedido.dataHoraCriacaoRegistro
                  ? new Date(pedido.dataPedido || pedido.dataHoraCriacaoRegistro).toLocaleDateString('pt-BR')
                  : 'Data não disponível'}
              </p>
              <div className={styles["distribuidor-order-actions"]}>
                {/* Aguardando Aceite → Aceitar */}
                {pedido.status === 'Aguardando Aceite' && (
                  <button
                    type="button"
                    className={`${styles["distribuidor-order-button-accept"]} ${styles["distribuidor-order-button-urgent"]}`}
                    onClick={(e) => handleAceitarPedido(e, pedido.id)}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Aceitando...' : 'Aceitar Pedido'}
                  </button>
                )}

                {/* Aceito → Em Separação */}
                {pedido.status === 'Aceito' && (
                  <button
                    type="button"
                    className={`${styles["distribuidor-order-button-accept"]} ${styles["distribuidor-order-button-processing"]}`}
                    onClick={(e) => handleMudarStatus(e, pedido.id, 'Em Separação')}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Processando...' : 'Iniciar Separação'}
                  </button>
                )}

                {/* Em Separação → Aguardando Retirada */}
                {pedido.status === 'Em Separação' && (
                  <button
                    type="button"
                    className={`${styles["distribuidor-order-button-accept"]} ${styles["distribuidor-order-button-preparing"]}`}
                    onClick={(e) => handleMudarStatus(e, pedido.id, 'Aguardando Retirada')}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Processando...' : 'Marcar Pronto'}
                  </button>
                )}

                {/* Aguardando Retirada → Em Trânsito */}
                {pedido.status === 'Aguardando Retirada' && (
                  <button
                    type="button"
                    className={`${styles["distribuidor-order-button-accept"]} ${styles["distribuidor-order-button-ready"]}`}
                    onClick={(e) => handleMudarStatus(e, pedido.id, 'Em Trânsito')}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Processando...' : 'Saiu para Entrega'}
                  </button>
                )}

                {/* Em Trânsito → Entregue */}
                {pedido.status === 'Em Trânsito' && (
                  <button
                    type="button"
                    className={`${styles["distribuidor-order-button-accept"]} ${styles["distribuidor-order-button-transit"]}`}
                    onClick={(e) => handleMudarStatus(e, pedido.id, 'Entregue ao Cliente')}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Processando...' : 'Confirmar Entrega'}
                  </button>
                )}

                {/* Pedidos concluídos não têm ações */}
                {(pedido.status === 'Entregue ao Cliente' || pedido.status === 'Concluído') && (
                  <span style={{ color: '#10b981', fontWeight: 500 }}>
                    <CheckCircle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    Finalizado
                  </span>
                )}

                <button
                  type="button"
                  className={styles["distribuidor-order-button-details"]}
                  onClick={() => setPedidoSelecionado(pedido.id)}
                >
                  <Info size={16} /> Histórico
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Botão Ver Todos os Pedidos */}
        {!isLoading && !error && pedidosFiltrados.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              type="button"
              className={styles["ver-todos-button"]}
              onClick={() => setMostrarTodosPedidos(!mostrarTodosPedidos)}
            >
              <ChevronDown size={18} />
              {mostrarTodosPedidos ? 'Ver Menos' : `Ver Todos os Pedidos (${pedidosFiltrados.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Toast de Notificações */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}

      {/* Modal de Histórico do Pedido */}
      {pedidoSelecionado && (
        <PedidoTimeline
          pedidoId={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </div>
  );
}

export default DistribuidorDashboard;
