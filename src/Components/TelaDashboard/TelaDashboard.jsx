import React from "react";
import styles from "./TelaDashboard.module.css";
import { Package, CheckCircle, Clock } from "lucide-react"; // Removi os ícones não utilizados
import { Link } from "react-router-dom";

// 1. Importe o novo componente que você criou
import BuscaSegmentada from "../TelaDashboard/BuscaSegmentada/BuscaSegmentada"; // Ajuste o caminho se necessário

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
          
          <div className={styles["header-actions-group"]}>
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