import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Truck, Package, MapPin, Clock, CheckCircle } from "lucide-react";
import styles from "./TelaEntregador.module.css";

/**
 * Dashboard do Entregador
 *
 * Funcionalidades principais:
 * - Visualizar entregas atribuídas
 * - Atualizar status de entregas
 * - Visualizar histórico de entregas
 * - Visualizar entregas disponíveis para aceitar
 */
function TelaEntregador() {
  const { userName, userId } = useAuth();
  const [entregas, setEntregas] = useState([]);
  const [entregasRecentes, setEntregasRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar entregas do backend quando endpoint estiver disponível
    // GET /api/pedidos/entregador/{idEntregador}
    // GET /api/entregas/disponiveis/{idEntregador}
    // GET /api/entregas/recentes/{idEntregador}

    // Mock de dados para desenvolvimento - Entregas atribuídas
    const mockEntregas = [
      {
        id: 1,
        codigo: 'M5018X7',
        assistencia: 'Assistência TecCell',
        distribuidor: 'Distribuidora ABC',
        endereco: 'Rua das Flores, 123 - Centro',
        status: 'PENDENTE',
        dataColeta: null,
        dataEntrega: null
      }
    ];

    // Mock de entregas recentes
    const mockRecentes = [
      {
        id: 101,
        destino: 'SmartFix Assistência',
        urgencia: 'Urgente',
        distancia: 7.2,
        valor: 88.00,
        dataEntrega: '2025-10-29T14:30:00'
      },
      {
        id: 102,
        destino: 'TecnoRepair Center',
        urgencia: 'Normal',
        distancia: 9.1,
        valor: 72.50,
        dataEntrega: '2025-10-29T11:15:00'
      },
      {
        id: 103,
        destino: 'Cell Express',
        urgencia: 'Expressa',
        distancia: 15.4,
        valor: 110.00,
        dataEntrega: '2025-10-28T16:45:00'
      }
    ];

    setTimeout(() => {
      setEntregas(mockEntregas);
      setEntregasRecentes(mockRecentes);
      setLoading(false);
    }, 500);
  }, [userId]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDENTE: { label: 'Pendente', color: '#FFA500', icon: Clock },
      EM_TRANSITO: { label: 'Em Trânsito', color: '#2196F3', icon: Truck },
      ENTREGUE: { label: 'Entregue', color: '#4CAF50', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDENTE;
    const Icon = config.icon;

    return (
      <span className={styles.statusBadge} style={{ backgroundColor: config.color }}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getUrgenciaBadge = (urgencia) => {
    const urgenciaConfig = {
      'Urgente': { color: '#FFA726', bg: '#FFF3E0' },
      'Normal': { color: '#5C6BC0', bg: '#E8EAF6' },
      'Expressa': { color: '#EF5350', bg: '#FFEBEE' }
    };

    const config = urgenciaConfig[urgencia] || urgenciaConfig.Normal;

    return (
      <span
        className={styles.urgenciaBadge}
        style={{
          color: config.color,
          backgroundColor: config.bg
        }}
      >
        {urgencia}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Truck size={48} />
        <p>Carregando entregas...</p>
      </div>
    );
  }

  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Truck size={32} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>
              {getSaudacao()}, <span className={styles.userName}>Entregador parceiro!</span>
            </h1>
            <p className={styles.subtitle}>
              Gerencie suas entregas e rotas de forma eficiente
            </p>
          </div>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <Clock size={24} />
          <div>
            <p className={styles.statValue}>
              {entregas.filter(e => e.status === 'PENDENTE').length}
            </p>
            <p className={styles.statLabel}>Pendentes</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <Truck size={24} />
          <div>
            <p className={styles.statValue}>
              {entregas.filter(e => e.status === 'EM_TRANSITO').length}
            </p>
            <p className={styles.statLabel}>Em Trânsito</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <CheckCircle size={24} />
          <div>
            <p className={styles.statValue}>
              {entregas.filter(e => e.status === 'ENTREGUE').length}
            </p>
            <p className={styles.statLabel}>Entregues Hoje</p>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Package size={24} />
          Minhas Entregas
        </h2>

        {entregas.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={64} />
            <p>Nenhuma entrega atribuída no momento</p>
          </div>
        ) : (
          <div className={styles.entregasList}>
            {entregas.map((entrega) => (
              <div key={entrega.id} className={styles.entregaCard}>
                <div className={styles.entregaHeader}>
                  <div>
                    <h3 className={styles.entregaCodigo}>Pedido #{entrega.codigo}</h3>
                    <p className={styles.entregaAssistencia}>{entrega.assistencia}</p>
                  </div>
                  {getStatusBadge(entrega.status)}
                </div>

                <div className={styles.entregaDetails}>
                  <div className={styles.entregaDetail}>
                    <MapPin size={18} />
                    <div>
                      <p className={styles.detailLabel}>Endereço de Entrega</p>
                      <p className={styles.detailValue}>{entrega.endereco}</p>
                    </div>
                  </div>

                  <div className={styles.entregaDetail}>
                    <Package size={18} />
                    <div>
                      <p className={styles.detailLabel}>Distribuidor</p>
                      <p className={styles.detailValue}>{entrega.distribuidor}</p>
                    </div>
                  </div>

                  {entrega.dataColeta && (
                    <div className={styles.entregaDetail}>
                      <Clock size={18} />
                      <div>
                        <p className={styles.detailLabel}>Coletado em</p>
                        <p className={styles.detailValue}>
                          {new Date(entrega.dataColeta).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.entregaActions}>
                  {entrega.status === 'PENDENTE' && (
                    <button className={styles.primaryButton}>
                      Iniciar Coleta
                    </button>
                  )}
                  {entrega.status === 'EM_TRANSITO' && (
                    <button className={styles.successButton}>
                      Confirmar Entrega
                    </button>
                  )}
                  <button className={styles.secondaryButton}>
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção: Entregas Recentes */}
      <section className={styles.section}>
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>Entregas Recentes</h2>
          <p className={styles.pageSubtitle}>Histórico de entregas concluídas</p>
        </div>

        <div className={styles.entregasDisponiveisList}>
          {entregasRecentes.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={64} />
              <p>Nenhuma entrega recente</p>
            </div>
          ) : (
            entregasRecentes.map((entrega) => (
              <div key={entrega.id} className={styles.entregaDisponivelCard}>
                <div className={styles.entregaIcon}>
                  <Package size={24} />
                </div>

                <div className={styles.entregaInfo}>
                  <h3 className={styles.entregaDestino}>{entrega.destino}</h3>
                  <div className={styles.entregaMeta}>
                    {getUrgenciaBadge(entrega.urgencia)}
                    <span className={styles.distancia}>{entrega.distancia} km</span>
                  </div>
                </div>

                <div className={styles.entregaValor}>
                  R$ {entrega.valor.toFixed(2).replace('.', ',')}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default TelaEntregador;  