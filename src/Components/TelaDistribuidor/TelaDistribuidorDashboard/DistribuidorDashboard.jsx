import React, { useState } from "react";
import styles from "./DistribuidorDashboard.module.css";
// Importações dos ícones que você precisará (ex: de 'lucide-react')
import {
  Package,
  CheckCircle,
  Clock,
  Plus,
  Settings,
  TrendingUp,
  Tag,
  CircleCheck,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePedidosDistribuidor } from "../../../hooks/usePedidosDistribuidor";
import { updateStatusPedido } from "../../../api/pedidosServices";
import formatCurrency from "../../../utils/formatCurrency";

function DistribuidorDashboard() {
  const navigate = useNavigate();
  const { pedidos, isLoading, error, indicadores } = usePedidosDistribuidor();
  const [processandoPedido, setProcessandoPedido] = useState(null);

  const handleAceitarPedido = async (pedidoId) => {
    try {
      setProcessandoPedido(pedidoId);
      await updateStatusPedido(pedidoId, 'Aceito', 'Pedido aceito pelo distribuidor');
      alert('Pedido aceito com sucesso!');
      window.location.reload(); // Recarrega para atualizar a lista
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
      alert('Erro ao aceitar pedido. Tente novamente.');
    } finally {
      setProcessandoPedido(null);
    }
  };

  const handleGerenciarEstoque = () => {
    navigate('/distribuidor/estoque');
  };
  return (
    <div className={styles["distribuidor-page"]}>
      {/* Cabeçalho principal */}
      <div className={styles["distribuidor-main-header"]}>
        <div className={styles["distribuidor-logo-section"]}>
          <Package size={24} className={styles["distribuidor-logo-icon"]} />
          <h1 className={styles["distribuidor-app-name"]}>Allmoove</h1>
        </div>
        <div className={styles["distribuidor-title-section"]}>
          <h2 className={styles["distribuidor-main-title"]}>Distribuidor</h2>
          <p className={styles["distribuidor-main-subtitle"]}>
            Central de distribuição de peças
          </p>
        </div>
      </div>

      {/* Seção de Cards Superiores (Novos Pedidos, Em Andamento, Concluídos, Estoque) */}
      <div className={styles["distribuidor-top-cards-grid"]}>
        {/* Card: Novos Pedidos */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Novos Pedidos
            </h3>
            <Plus size={16} className={styles["distribuidor-top-card-icon"]} />
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : indicadores.novosPedidos}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Aguardando aceite
          </p>
        </div>

        {/* Card: Em Andamento */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Em Andamento
            </h3>
            <Clock size={16} className={styles["distribuidor-top-card-icon"]} />
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : indicadores.emAndamento}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Aceitos ou em trânsito
          </p>
        </div>

        {/* Card: Concluídos */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>
              Concluídos
            </h3>
            <CircleCheck
              size={16}
              className={styles["distribuidor-top-card-icon-green"]}
            />{" "}
            {/* Ícone verde */}
          </div>
          <p className={styles["distribuidor-top-card-number"]}>
            {isLoading ? '...' : indicadores.concluidos}
          </p>
          <p className={styles["distribuidor-top-card-description"]}>
            Entregas finalizadas
          </p>
        </div>

        {/* Card: Estoque */}
        <div className={styles["distribuidor-top-card"]}>
          <div className={styles["distribuidor-top-card-header"]}>
            <h3 className={styles["distribuidor-top-card-title"]}>Estoque</h3>
            <Settings
              size={16}
              className={styles["distribuidor-top-card-icon"]}
            />
          </div>
          <button
            className={styles["distribuidor-stock-button"]}
            onClick={handleGerenciarEstoque}
          >
            <Package size={16} /> {/* O ícone Package é adicionado aqui */}
            Gerenciar
          </button>
          <p className={styles["distribuidor-stock-description"]}>
            Controle de inventário
          </p>
        </div>
      </div>

      {/* Seção de Faturamento e Peças por Segmento */}
      <div className={styles["distribuidor-middle-section-grid"]}>
        {/* Card: Faturamento */}
        <div className={styles["distribuidor-middle-card"]}>
          <div className={styles["distribuidor-middle-card-header"]}>
            <TrendingUp
              size={20}
              className={styles["distribuidor-middle-card-icon"]}
            />
            <h3 className={styles["distribuidor-middle-card-title"]}>
              Faturamento
            </h3>
          </div>
          <p className={styles["distribuidor-middle-card-subtitle"]}>
            Valores recebidos vs. a receber
          </p>

          <div className={styles["distribuidor-fat-item"]}>
            <p className={styles["distribuidor-fat-label"]}>Valor Recebido</p>
            <div className={styles["distribuidor-fat-progress-bar"]}>
              <div
                className={styles["distribuidor-fat-progress-fill-green"]}
                style={{ width: "20%" }}
              ></div>{" "}
              {/* Exemplo de preenchimento */}
            </div>
            <p className={styles["distribuidor-fat-value"]}>R$ 35.75</p>
          </div>

          <div className={styles["distribuidor-fat-item"]}>
            <p className={styles["distribuidor-fat-label"]}>A Receber</p>
            <div className={styles["distribuidor-fat-progress-bar"]}>
              <div
                className={styles["distribuidor-fat-progress-fill-orange"]}
                style={{ width: "80%" }}
              ></div>{" "}
              {/* Exemplo de preenchimento */}
            </div>
            <p className={styles["distribuidor-fat-value"]}>R$ 130.50</p>
          </div>

          <div className={styles["distribuidor-fat-total"]}>
            <p className={styles["distribuidor-fat-label"]}>Total</p>
            <p className={styles["distribuidor-fat-value-total"]}>R$ 166.25</p>
          </div>
        </div>

        {/* Card: Peças por Segmento */}
        <div className={styles["distribuidor-middle-card"]}>
          <div className={styles["distribuidor-middle-card-header"]}>
            <Tag
              size={20}
              className={styles["distribuidor-middle-card-icon"]}
            />
            <h3 className={styles["distribuidor-middle-card-title"]}>
              Peças por Segmento
            </h3>
          </div>
          <p className={styles["distribuidor-middle-card-subtitle"]}>
            Distribuição por categoria
          </p>

          <div className={styles["distribuidor-segment-item"]}>
            <p className={styles["distribuidor-segment-label"]}>Eletrônicos</p>
            <div className={styles["distribuidor-segment-progress-bar"]}>
              <div
                className={styles["distribuidor-segment-progress-fill"]}
                style={{ width: "25%" }}
              ></div>
            </div>
            <p className={styles["distribuidor-segment-value"]}>1 (25%)</p>
          </div>

          <div className={styles["distribuidor-segment-item"]}>
            <p className={styles["distribuidor-segment-label"]}>Automotivo</p>
            <div className={styles["distribuidor-segment-progress-bar"]}>
              <div
                className={styles["distribuidor-segment-progress-fill"]}
                style={{ width: "25%" }}
              ></div>
            </div>
            <p className={styles["distribuidor-segment-value"]}>1 (25%)</p>
          </div>

          <div className={styles["distribuidor-segment-item"]}>
            <p className={styles["distribuidor-segment-label"]}>Informática</p>
            <div className={styles["distribuidor-segment-progress-bar"]}>
              <div
                className={styles["distribuidor-segment-progress-fill"]}
                style={{ width: "25%" }}
              ></div>
            </div>
            <p className={styles["distribuidor-segment-value"]}>1 (25%)</p>
          </div>

          <div className={styles["distribuidor-segment-item"]}>
            <p className={styles["distribuidor-segment-label"]}>
              Eletrodomésticos
            </p>
            <div className={styles["distribuidor-segment-progress-bar"]}>
              <div
                className={styles["distribuidor-segment-progress-fill"]}
                style={{ width: "25%" }}
              ></div>
            </div>
            <p className={styles["distribuidor-segment-value"]}>1 (25%)</p>
          </div>
        </div>
      </div>

      {/* Seção Painel de Controle - Entregas de Peças */}
      <div className={styles["distribuidor-control-panel-section"]}>
        <h3 className={styles["distribuidor-control-panel-title"]}>
          Painel de Controle - Entregas de Peças
        </h3>
        <p className={styles["distribuidor-control-panel-subtitle"]}>
          Gerencie pedidos e gere códigos para entregadores
        </p>

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

        {/* Lista de Pedidos */}
        {!isLoading && !error && pedidos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Nenhum pedido encontrado.</p>
          </div>
        )}

        {!isLoading && !error && pedidos.map((pedido) => (
          <div key={pedido.id} className={styles["distribuidor-order-item"]}>
            <div className={styles["distribuidor-order-details"]}>
              <Package size={24} className={styles["distribuidor-order-icon"]} />
              <div className={styles["distribuidor-order-text"]}>
                <p className={styles["distribuidor-order-plate"]}>
                  Pedido #{pedido.id}
                </p>
                <p className={styles["distribuidor-order-model"]}>
                  {pedido.items?.length || 0} {pedido.items?.length === 1 ? 'item' : 'itens'}
                </p>
                <div className={styles["distribuidor-order-tags"]}>
                  <span className={
                    pedido.status === 'Aguardando Aceite'
                      ? styles["distribuidor-order-tag-novo"]
                      : styles["distribuidor-order-tag-eletronicos"]
                  }>
                    {pedido.status}
                  </span>
                  <span className={styles["distribuidor-order-tag-eletronicos"]}>
                    {pedido.tipoEntrega || 'Normal'}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["distribuidor-order-info"]}>
              <p className={styles["distribuidor-order-price"]}>
                {formatCurrency(pedido.totalPago || 0, 'BRL')}
              </p>
              <p className={styles["distribuidor-order-date"]}>
                {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
              </p>
              <div className={styles["distribuidor-order-actions"]}>
                {pedido.status === 'Aguardando Aceite' && (
                  <button
                    className={styles["distribuidor-order-button-accept"]}
                    onClick={() => handleAceitarPedido(pedido.id)}
                    disabled={processandoPedido === pedido.id}
                  >
                    {processandoPedido === pedido.id ? 'Aceitando...' : 'Aceitar Pedido'}
                  </button>
                )}
                <button className={styles["distribuidor-order-button-details"]}>
                  <Info size={16} /> Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DistribuidorDashboard;
