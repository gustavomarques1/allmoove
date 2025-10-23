import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./TelaDashboard.module.css";
import logger from "../../utils/logger";
import { Package, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, ShoppingBag, Plus, Truck, X, RefreshCw, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePedidos } from "../../hooks/usePedidos";
import BuscaSegmentada from "../TelaDashboard/BuscaSegmentada/BuscaSegmentada";
import Button from "../Shared/Button/Button";
import Logo from "../Shared/Logo/Logo";
import Loader from "../Shared/Loader/Loader";
import SkeletonCard from "./SkeletonCard/SkeletonCard";
// QuickActions removido - redundante com BuscaSegmentada
import StatsCards from "./StatsCards/StatsCards";

function TelaDashboard() {
  const navigate = useNavigate();
  const { pedidos, isLoading, error, indicadores, recarregar } = usePedidos();
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounce para busca (evita filtrar a cada tecla)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Recarrega pedidos quando a página ganha foco (usuário volta de outra aba/página)
  useEffect(() => {
    const handleFocus = () => {
      logger.info('🔄 Dashboard ganhou foco - recarregando pedidos...');
      recarregar();
      setLastUpdate(new Date());
    };

    // Adiciona listener para quando a janela ganha foco
    window.addEventListener('focus', handleFocus);

    // Também recarrega quando o componente é montado
    logger.info('✅ Dashboard montado - carregando pedidos...');
    setLastUpdate(new Date());

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [recarregar]);

  // Função de refresh manual
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await recarregar();
    setLastUpdate(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  }, [recarregar]);

  // Formatar tempo desde última atualização
  const getTimeAgo = useCallback(() => {
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    if (seconds < 60) return 'agora há pouco';
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return 'há 1 minuto';
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'há 1 hora';
    return `há ${hours} horas`;
  }, [lastUpdate]);

  // Verificar se pedido é recente (últimas 24h)
  const isRecentOrder = useCallback((dataPedido) => {
    if (!dataPedido) return false;
    const orderDate = new Date(dataPedido);
    const now = new Date();
    const diffHours = (now - orderDate) / (1000 * 60 * 60);
    return diffHours <= 24;
  }, []);

  // Função para obter saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Filtrar e buscar pedidos (usando debouncedSearchTerm)
  const filteredOrders = useMemo(() => {
    return pedidos.filter(pedido => {
      const matchesSearch =
        pedido.id?.toString().includes(debouncedSearchTerm) ||
        pedido.fornecedor?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        pedido.codigoEntrega?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'todos' ||
        pedido.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [pedidos, debouncedSearchTerm, statusFilter]);

  // Limita para 2 pedidos inicialmente
  const displayedOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, 2);

  // Função para obter ícone e cor por status
  const getStatusConfig = (status) => {
    const configs = {
      'pendente': { icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
      'aceito': { icon: CheckCircle, color: '#10b981', bg: '#d1fae5' },
      'em-trânsito': { icon: Truck, color: '#3b82f6', bg: '#dbeafe' },
      'entregue': { icon: CheckCircle, color: '#16a34a', bg: '#dcfce7' },
      'cancelado': { icon: X, color: '#ef4444', bg: '#fee2e2' }
    };

    const statusKey = status?.toLowerCase().replace(/\s/g, '-') || 'pendente';
    return configs[statusKey] || configs['pendente'];
  };

  return (
    <div className={styles["dashboard-page"]}>
      {/* Cabeçalho Melhorado */}
      <div className={styles["dashboard-header-section"]}>
        <div className={styles["dashboard-header"]}>
          <div className={styles["welcome-section"]}>
            <h1 className={styles["welcome-title"]}>
              {getSaudacao()}, <span className={styles["user-name"]}>Assistência Parceira</span>!
            </h1>
            <p className={styles["welcome-subtitle"]}>
              Veja o resumo dos seus pedidos e gerencie suas solicitações dos produtos
            </p>
          </div>

          <div className={styles["header-actions"]}>
            {/* Badge de notificações removido - placeholder não funcional */}

            <button
              className={styles["refresh-btn"]}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label={isRefreshing ? "Atualizando dados..." : "Atualizar dados"}
              title={`Atualizado ${getTimeAgo()}`}
              role="button"
              tabIndex={0}
              aria-busy={isRefreshing}
            >
              <RefreshCw
                size={18}
                className={isRefreshing ? styles["spinning"] : ''}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions removido - funcionalidades duplicadas e não essenciais */}

      {/* 2. Adicione o componente BuscaSegmentada aqui */}
      <BuscaSegmentada />

      {/* Cards de Resumo Modernos */}
      <StatsCards indicadores={indicadores} isLoading={isLoading} />
      
      {/* Seção Meus Pedidos */}
      <section className={styles["orders-section"]} aria-labelledby="orders-heading">
        <div className={styles["orders-header"]}>
          <h1 id="orders-heading">Pedidos</h1>
        </div>

        {/* Filtros e Busca */}
        {!isLoading && !error && pedidos.length > 0 && (
          <div className={styles["filters-section"]}>
            <div className={styles["search-container"]}>
              <input
                type="search"
                placeholder="Buscar por ID, fornecedor ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
                disabled={isLoading}
                aria-label="Buscar pedidos"
                aria-describedby="search-hint"
                autoComplete="off"
              />
              <span id="search-hint" className="sr-only">
                Digite para buscar pedidos por ID, nome do fornecedor ou código de entrega
              </span>
              {searchTerm !== debouncedSearchTerm && (
                <span className={styles["search-loading"]} aria-live="polite">
                  <Loader size="sm" variant="primary" />
                </span>
              )}
            </div>
            <div className={styles["status-filters"]} role="group" aria-label="Filtros de status">
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'todos' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('todos')}
                disabled={isLoading}
                aria-label="Filtrar todos os pedidos"
                aria-pressed={statusFilter === 'todos'}
              >
                Todos ({pedidos.length})
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'pendente' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('pendente')}
                disabled={isLoading}
                aria-label="Filtrar pedidos pendentes"
                aria-pressed={statusFilter === 'pendente'}
              >
                <Clock size={16} aria-hidden="true" />
                Pendente
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'aceito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('aceito')}
                disabled={isLoading}
                aria-label="Filtrar pedidos aceitos"
                aria-pressed={statusFilter === 'aceito'}
              >
                <CheckCircle size={16} aria-hidden="true" />
                Aceito
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'em trânsito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('em trânsito')}
                disabled={isLoading}
                aria-label="Filtrar pedidos em trânsito"
                aria-pressed={statusFilter === 'em trânsito'}
              >
                <Truck size={16} aria-hidden="true" />
                Em Trânsito
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className={styles["orders-mid"]}>
            <Loader size="lg" variant="primary" text="Carregando pedidos..." />
          </div>
        ) : error ? (
          <div className={styles["orders-mid"]}>
            <AlertCircle className={styles["error-icon"]} />
            <p>Não foi possível carregar os pedidos</p>
          </div>
        ) : pedidos.length === 0 ? (
          <>
            <div className={styles["orders-empty"]}>
              <div className={styles["empty-icon-wrapper"]}>
                <ShoppingBag size={64} className={styles["empty-icon"]} />
              </div>
              <h3 className={styles["empty-title"]}>Nenhum pedido encontrado</h3>
              <p className={styles["empty-description"]}>
                Comece a fazer seus pedidos de peças técnicas agora mesmo!
              </p>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Plus size={18} />}
                onClick={() => navigate('/assistencia/loja')}
              >
                Fazer Primeiro Pedido
              </Button>
            </div>
          </>
        ) : filteredOrders.length === 0 ? (
          <>
            <div className={styles["orders-empty"]}>
              <div className={styles["empty-icon-wrapper"]}>
                <Package size={48} className={styles["empty-icon"]} />
              </div>
              <h3 className={styles["empty-title"]}>Nenhum pedido encontrado</h3>
              <p className={styles["empty-description"]}>
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <Button
                variant="ghost"
                size="md"
                onClick={() => { setSearchTerm(''); setStatusFilter('todos'); }}
              >
                Limpar Filtros
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles["orders-list"]}>
              {displayedOrders.map((pedido, index) => {
                const statusConfig = getStatusConfig(pedido.status);
                const StatusIcon = statusConfig.icon;
                const isNew = isRecentOrder(pedido.dataPedido);

                return (
                  <article
                    key={pedido.id}
                    className={styles["order-item"]}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    aria-label={`Pedido número ${pedido.id}`}
                  >
                    <div className={styles["order-info"]}>
                      <div className={styles["order-header-item"]}>
                        <Package size={20} />
                        <h3>Pedido #{pedido.id}</h3>
                        {isNew && (
                          <span className={styles["new-badge"]} title="Pedido recente (últimas 24h)">
                            <Sparkles size={14} />
                            Novo
                          </span>
                        )}
                      </div>
                      <p className={styles["order-date"]}>
                        {pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR') : '-'}
                      </p>
                    </div>
                    <div className={styles["order-details"]}>
                      <p><strong>Fornecedor:</strong> {pedido.fornecedor || 'N/A'}</p>
                      <p><strong>Tipo de Entrega:</strong> {pedido.tipoEntrega || 'N/A'}</p>
                      <p><strong>Código de Entrega:</strong> {pedido.codigoEntrega || 'N/A'}</p>
                    </div>

                    {/* Seção de Items do Pedido */}
                    {pedido.items && pedido.items.length > 0 && (
                      <div className={styles["order-items-section"]}>
                        <h4 className={styles["items-title"]}>
                          <ShoppingBag size={16} />
                          Produtos ({pedido.items.length} {pedido.items.length === 1 ? 'item' : 'itens'})
                        </h4>
                        <div className={styles["items-list"]}>
                          {pedido.items.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles["item-row"]}>
                              <div className={styles["item-info"]}>
                                <span className={styles["item-name"]}>{item.nome || 'Produto sem nome'}</span>
                                <span className={styles["item-quantity"]}>Qtd: {item.quantidade || 0}</span>
                              </div>
                              <div className={styles["item-prices"]}>
                                <span className={styles["item-unit-price"]}>
                                  R$ {(item.preco || 0).toFixed(2)} un.
                                </span>
                                <span className={styles["item-subtotal"]}>
                                  R$ {((item.preco || 0) * (item.quantidade || 0) - (item.desconto || 0)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles["order-status"]}>
                      <span
                        className={styles["status-badge-new"]}
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color
                        }}
                      >
                        <StatusIcon size={16} />
          {pedido.status || 'Pendente'}
                      </span>
                      <p className={styles["order-total"]}>
                        R$ {pedido.totalPago ? pedido.totalPago.toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Botão para expandir/colapsar pedidos se houver mais de 2 */}
            {pedidos.length > 2 && (
              <div className={styles["expand-orders-container"]}>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  leftIcon={showAllOrders ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                >
                  {showAllOrders
                    ? 'Mostrar menos pedidos'
                    : `Ver todos os pedidos (${pedidos.length})`
                  }
                </Button>
              </div>
            )}

            <div className={styles["button-orders"]}>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Plus size={18} />}
                onClick={() => navigate('/assistencia/loja')}
              >
                Fazer Novo Pedido
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default TelaDashboard;