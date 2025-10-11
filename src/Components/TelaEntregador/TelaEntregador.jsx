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
 */
function TelaEntregador() {
  const { userName, userId } = useAuth();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Buscar entregas do backend quando endpoint estiver disponível
    // GET /api/pedidos/entregador/{idEntregador}

    // Mock de dados para desenvolvimento
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
      },
      {
        id: 2,
        codigo: 'M8234X2',
        assistencia: 'TechFix Assistência',
        distribuidor: 'Distribuidora XYZ',
        endereco: 'Av. Principal, 456 - Bairro Norte',
        status: 'EM_TRANSITO',
        dataColeta: '2025-10-11T10:30:00',
        dataEntrega: null
      }
    ];

    setTimeout(() => {
      setEntregas(mockEntregas);
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

  if (loading) {
    return (
      <div className={styles.loading}>
        <Truck size={48} />
        <p>Carregando entregas...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Truck size={32} className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Dashboard do Entregador</h1>
            <p className={styles.subtitle}>Bem-vindo, {userName || 'Entregador'}!</p>
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

      <div className={styles.infoBox}>
        <p>
          <strong>Nota:</strong> Esta é uma versão inicial do dashboard do entregador.
          As funcionalidades de atualização de status serão implementadas assim que
          os endpoints do backend estiverem disponíveis.
        </p>
      </div>
    </div>
  );
}

export default TelaEntregador;  