import React from "react";
import styles from "./TelaDashboard.module.css";
import { Package, CheckCircle, Clock } from "lucide-react";

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
        <h2 className={styles["dashboard-subtitle"]}>Assistência Técnica</h2>
        <p className={styles["dashboard-description"]}>
          Painel de controle técnico
        </p>
      </div>

      {/* Linha divisória */}
      <div className={styles["divider"]}></div>

      {/* Cards */}
      <div className={styles["cards-section"]}>
        <div className={styles["cards-grid"]}>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Meus Pedidos</h3>
              <Package size={16} />
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Total de pedidos realizados
            </p>
          </div>

          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Pedidos Encerrados</h3>
              <CheckCircle size={16} />
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Pedidos entregues com sucesso
            </p>
          </div>

          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h3>Pedidos em Andamento</h3>
              <Clock size={16} />
            </div>
            <p className={styles["card-number"]}>0</p>
            <p className={styles["card-description"]}>
              Aceitos ou em trânsito
            </p>
          </div>
        </div>

        {/* Botão */}
        <div className={styles["button-wrapper"]}>
          <button className={styles["new-request-button"]}>
            + Solicitar Nova Peça
          </button>
        </div>
      </div>

      <div className={styles["orders-section"]}>
        <div className={styles["orders-header"]}>
        <h1>Meus Pedidos de Peças</h1>
        <p>Histórico e status dos seus pedidos de peças</p>
        </div>

        <div className={styles["orders-mid"]}>
        <Package className={styles["orders-icon"]}/>
        <p>Nenhum pedido de peça encontrado</p>
        </div>

         {/* Botão */}
        <div className={styles["button-orders"]}>
          <button className={styles["new-request-button-down"]}>
            + Fazer Primeiro Pedido
          </button>
        </div>
      </div>


    </div>
    
  );
}

export default TelaDashboard;
