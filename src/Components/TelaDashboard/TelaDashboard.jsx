import React, { useState, useEffect } from "react";
import styles from "./TelaDashboard.module.css";
import { Package, CheckCircle, Clock, AlertCircle, Loader, ChevronDown, ChevronUp, ShoppingBag, Plus, Truck, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePedidos } from "../../hooks/usePedidos";
import BuscaSegmentada from "../TelaDashboard/BuscaSegmentada/BuscaSegmentada";
import Button from "../Shared/Button/Button";
import Logo from "../Shared/Logo/Logo";
import SkeletonCard from "./SkeletonCard/SkeletonCard";

function TelaDashboard() {
  const navigate = useNavigate();
  const { pedidos, isLoading, error, indicadores, recarregar } = usePedidos();
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Recarrega pedidos quando a página ganha foco (usuário volta de outra aba/página)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Dashboard ganhou foco - recarregando pedidos...');
      recarregar();
    };

    // Adiciona listener para quando a janela ganha foco
    window.addEventListener('focus', handleFocus);

    // Também recarrega quando o componente é montado
    console.log('✅ Dashboard montado - carregando pedidos...');

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [recarregar]);

  // Função para obter saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Filtrar e buscar pedidos
  const filteredOrders = pedidos.filter(pedido => {
    const matchesSearch =
      pedido.id?.toString().includes(searchTerm) ||
      pedido.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.codigoEntrega?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ||
      pedido.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
      {/* Cabeçalho */}
      <div className={styles["dashboard-header-section"]}>
        <div className={styles["dashboard-header"]}>
          {/* <Logo size={20} /> */}
        </div>
        
        <div className={styles["dashboard-subtitle-and-button"]}>
          <div>
            <p className={styles["dashboard-greeting"]}>{getSaudacao()}!</p>
            <h2 className={styles["dashboard-subtitle"]}>Assistência Técnica</h2>
          </div>

          <Button
            variant="primary"
            size="md"
            leftIcon={<ShoppingBag size={18} />}
            onClick={() => navigate('/assistencia/loja')}
          >
            Buscar Produtos
          </Button>
        </div>
      </div>

      {/* Linha divisória */}
      <div className={styles["divider"]}></div>

      {/* 2. Adicione o componente BuscaSegmentada aqui */}
      <BuscaSegmentada />

      {/* Cards de Resumo */}
      <div className={styles["cards-section"]}>
        {isLoading ? (
          <div className={styles["cards-grid"]}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div className={styles["error-container"]}>
            <AlertCircle className={styles["error-icon"]} />
            <p>Erro ao carregar indicadores</p>
          </div>
        ) : (
          <div className={styles["cards-grid"]}>
            <div className={styles["card"]} style={{ borderTop: `4px solid var(--color-primary)` }}>
              <div className={styles["card-header"]}>
                <h3>Meus Pedidos</h3>
                <Package className={styles["card-icon"]} style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className={styles["card-number"]}>{indicadores.totalPedidos}</p>
              <p className={styles["card-description"]}>
                Total de pedidos realizados
              </p>
            </div>
            <div className={styles["card"]} style={{ borderTop: `4px solid #16a34a` }}>
              <div className={styles["card-header"]}>
                <h3>Pedidos Encerrados</h3>
                <CheckCircle className={styles["card-icon"]} style={{ color: '#16a34a' }} />
              </div>
              <p className={styles["card-number"]}>{indicadores.pedidosEncerrados}</p>
              <p className={styles["card-description"]}>
                Pedidos entregues com sucesso
              </p>
            </div>
            <div className={styles["card"]} style={{ borderTop: `4px solid #f59e0b` }}>
              <div className={styles["card-header"]}>
                <h3>Pedidos em Andamento</h3>
                <Clock className={styles["card-icon"]} style={{ color: '#f59e0b' }} />
              </div>
              <p className={styles["card-number"]}>{indicadores.pedidosEmAndamento}</p>
              <p className={styles["card-description"]}>
                Aceitos ou em trânsito
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Seção Meus Pedidos */}
      <div className={styles["orders-section"]}>
        <div className={styles["orders-header"]}>
          <h1>Meus Pedidos de Peças</h1>
          <p>Histórico e status dos seus pedidos de peças</p>
        </div>

        {/* Filtros e Busca */}
        {!isLoading && !error && pedidos.length > 0 && (
          <div className={styles["filters-section"]}>
            <div className={styles["search-container"]}>
              <input
                type="text"
                placeholder="Buscar por ID, fornecedor ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles["search-input"]}
              />
            </div>
            <div className={styles["status-filters"]}>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'todos' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('todos')}
              >
                Todos ({pedidos.length})
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'pendente' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('pendente')}
              >
                <Clock size={16} />
                Pendente
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'aceito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('aceito')}
              >
                <CheckCircle size={16} />
                Aceito
              </button>
              <button
                className={`${styles["filter-btn"]} ${statusFilter === 'em trânsito' ? styles["active"] : ''}`}
                onClick={() => setStatusFilter('em trânsito')}
              >
                <Truck size={16} />
                Em Trânsito
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className={styles["orders-mid"]}>
            <Loader className={styles["spinner"]} />
            <p>Carregando pedidos...</p>
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
              {displayedOrders.map((pedido) => {
                const statusConfig = getStatusConfig(pedido.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={pedido.id} className={styles["order-item"]}>
                    <div className={styles["order-info"]}>
                      <div className={styles["order-header-item"]}>
                        <Package size={20} />
                        <h3>Pedido #{pedido.id}</h3>
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
                  </div>
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
      </div>
    </div>
  );
}

export default TelaDashboard;