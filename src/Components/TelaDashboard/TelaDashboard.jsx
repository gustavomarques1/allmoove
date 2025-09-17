import React from "react";
import styles from "./TelaDashboard.module.css";
import { Package, CheckCircle, Clock, Monitor, Smartphone, Car } from "lucide-react";
import { Link } from "react-router-dom";

function TelaDashboard() {
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
          
          {/* Grupo que alinha o botão e os ícones à direita */}
          <div className={styles["header-actions-group"]}>
            
            {/* Botão na "linha de cima" do grupo */}
            <Link to="/assistencia/parts-request" className={styles["new-request-link-header"]}>
              <button className={styles["new-request-button-header"]}>
                + Solicitar Nova Peça
              </button>
            </Link>

            {/* Sub-grupo para os ícones na "linha de baixo" */}
            <div className={styles["icons-submenu"]}>
              <Monitor className={styles["category-icon"]} size={22} />
              <Smartphone className={styles["category-icon"]} size={22} />
              <Car className={styles["category-icon"]} size={22} />
            </div>

          </div>
        </div>

        <p className={styles["dashboard-description"]}>
          Painel de controle técnico
        </p>
      </div>

      {/* A seção de ícones separada foi removida daqui */}

      {/* Linha divisória */}
      <div className={styles["divider"]}></div>

      {/* O resto do arquivo permanece o mesmo... */}
      {/* Cards de Resumo */}
      <div className={styles["cards-section"]}>
        <div className={styles["cards-grid"]}>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Meus Pedidos</h3>
              <Package className={styles["card-icon"]} />
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Total de pedidos realizados
            </p>
          </div>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Pedidos Encerrados</h3>
              <CheckCircle className={styles["card-icon"]}/>
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Pedidos entregues com sucesso
            </p>
          </div>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Pedidos em Andamento</h3>
              <Clock className={styles["card-icon"]} />
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Aceitos ou em trânsito
            </p>
          </div>
        </div>
      </div>
      {/* Seção Meus Pedidos */}
      <div className={styles["orders-section"]}>
        <div className={styles["orders-header"]}>
          <h1>Meus Pedidos de Peças</h1>
          <p>Histórico e status dos seus pedidos de peças</p>
        </div>
        <div className={styles["orders-mid"]}>
          <Package className={styles["orders-icon"]} />
          <p>Nenhum pedido de peça encontrado</p>
        </div>
        <div className={styles["button-orders"]}>
          <Link to="/assistencia/parts-request">
            <button className={styles["new-request-button-down"]}>
              + Fazer Primeiro Pedido
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TelaDashboard;