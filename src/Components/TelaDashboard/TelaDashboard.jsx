import React, { useState } from "react";
import styles from "./TelaDashboard.module.css";
import { Package, CheckCircle, Clock, AlertCircle, Loader, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

// Importe o hook personalizado
import { usePedidos } from "../../hooks/usePedidos";
import BuscaSegmentada from "../TelaDashboard/BuscaSegmentada/BuscaSegmentada";

function TelaDashboard() {
  // Usa o hook para buscar pedidos e indicadores
  const { pedidos, isLoading, error, indicadores, recarregar } = usePedidos();

  // Estado para controlar expansão da lista de pedidos
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Limita para 2 pedidos inicialmente
  const displayedOrders = showAllOrders ? pedidos : pedidos.slice(0, 2);

  return (
    <div className={styles["dashboard-page"]}>
      {/* Cabeçalho */}
      <div className={styles["dashboard-header-section"]}>
        <div className={styles["dashboard-header"]}>
          <div className={styles["dashboard-icon"]}>
            <Package size={20} />
          </div>
          <h1 className={styles["dashboard_title"]}>AllMoove</h1>
        </div>
        
        <div className={styles["dashboard-subtitle-and-button"]}>
          <h2 className={styles["dashboard-subtitle"]}>Assistência Técnica</h2>
          
          <div className={styles["header-actions-group"]}>
            <button
              onClick={recarregar}
              disabled={isLoading}
              className={styles["refresh-button-header"]}
              title="Atualizar pedidos"
            >
              <RefreshCw size={16} className={isLoading ? styles["spinning"] : ""} />
              Atualizar
            </button>
            <Link to="/assistencia/loja" className={styles["new-request-link-header"]}>
              <button className={styles["new-request-button-header"]}>
                Buscar Produtos
              </button>
            </Link>
          </div>
        </div>

        <p className={styles["dashboard-description"]}>
          Página principal
        </p>
      </div>

      {/* Linha divisória */}
      <div className={styles["divider"]}></div>

      {/* 2. Adicione o componente BuscaSegmentada aqui */}
      <BuscaSegmentada />

      {/* Cards de Resumo */}
      <div className={styles["cards-section"]}>
        {isLoading ? (
          <div className={styles["loading-container"]}>
            <Loader className={styles["spinner"]} />
            <p>Carregando dados...</p>
          </div>
        ) : error ? (
          <div className={styles["error-container"]}>
            <AlertCircle className={styles["error-icon"]} />
            <p>Erro ao carregar indicadores</p>
          </div>
        ) : (
          <div className={styles["cards-grid"]}>
            <div className={styles["card"]}>
              <div className={styles["card-header"]}>
                <h3>Meus Pedidos</h3>
                <Package className={styles["card-icon"]} />
              </div>
              <p className={styles["card-number"]}>{indicadores.totalPedidos}</p>
              <p className={styles["card-description"]}>
                Total de pedidos realizados
              </p>
            </div>
            <div className={styles["card"]}>
              <div className={styles["card-header"]}>
                <h3>Pedidos Encerrados</h3>
                <CheckCircle className={styles["card-icon"]}/>
              </div>
              <p className={styles["card-number"]}>{indicadores.pedidosEncerrados}</p>
              <p className={styles["card-description"]}>
                Pedidos entregues com sucesso
              </p>
            </div>
            <div className={styles["card"]}>
              <div className={styles["card-header"]}>
                <h3>Pedidos em Andamento</h3>
                <Clock className={styles["card-icon"]} />
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
            <div className={styles["orders-mid"]}>
              <Package className={styles["orders-icon"]} />
              <p>Nenhum pedido de peça encontrado</p>
            </div>
            <div className={styles["button-orders"]}>
              <Link to="/assistencia/loja">
                <button className={styles["new-request-button-down"]}>
                  + Fazer Primeiro Pedido
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles["orders-list"]}>
              {displayedOrders.map((pedido) => (
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
                    <span className={`${styles["status-badge"]} ${styles[`status-${pedido.status?.toLowerCase().replace(/\s/g, '-')}`]}`}>
                      {pedido.status || 'Pendente'}
                    </span>
                    <p className={styles["order-total"]}>
                      R$ {pedido.totalPago ? pedido.totalPago.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão para expandir/colapsar pedidos se houver mais de 2 */}
            {pedidos.length > 2 && (
              <div className={styles["expand-orders-container"]}>
                <button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className={styles["expand-orders-button"]}
                >
                  {showAllOrders ? (
                    <>
                      <ChevronUp size={18} />
                      <span>Mostrar menos pedidos</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      <span>Ver todos os pedidos ({pedidos.length})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div className={styles["button-orders"]}>
              <Link to="/assistencia/loja">
                <button className={styles["new-request-button-down"]}>
                  + Fazer Novo Pedido
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TelaDashboard;