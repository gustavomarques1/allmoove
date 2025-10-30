/**
 * STATUS SHOWCASE COMPONENT
 * Componente de demonstração visual do sistema de cores de status
 * USE APENAS PARA TESTES/DESENVOLVIMENTO
 * AllMoove - Dashboard Distribuidor
 */

import StatusBadge from './StatusBadge';
import StatusTimeline from './StatusTimeline';
import StatusCounter from './StatusCounter';
import { STATUS_TYPES, getStatusConfig } from '../../../utils/statusUtils';
import styles from './StatusColors.module.css';

/**
 * Showcase visual de todos os componentes de status
 * Útil para testar e visualizar o sistema de cores
 */
const StatusShowcase = () => {
  const allStatuses = Object.values(STATUS_TYPES);

  return (
    <div style={{ padding: '40px', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#111827' }}>
          Sistema de Cores de Status - AllMoove
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '40px' }}>
          Demonstração visual completa de todos os componentes e variantes
        </p>

        {/* SEÇÃO 1: Badges Padrão */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            1. Badges Padrão (Fundo Colorido)
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {allStatuses.map(status => (
              <StatusBadge key={status} status={status} variant="default" />
            ))}
          </div>
        </section>

        {/* SEÇÃO 2: Badges Light */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            2. Badges Light (Fundo Claro)
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {allStatuses.map(status => (
              <StatusBadge key={status} status={status} variant="light" />
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: Badges Outline */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            3. Badges Outline (Apenas Borda)
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {allStatuses.map(status => (
              <StatusBadge key={status} status={status} variant="outline" />
            ))}
          </div>
        </section>

        {/* SEÇÃO 4: Tamanhos */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            4. Tamanhos (Small, Medium, Large)
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={STATUS_TYPES.AGUARDANDO_ACEITE} size="sm" />
            <StatusBadge status={STATUS_TYPES.AGUARDANDO_ACEITE} size="md" />
            <StatusBadge status={STATUS_TYPES.AGUARDANDO_ACEITE} size="lg" />
          </div>
        </section>

        {/* SEÇÃO 5: Com Dot */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            5. Badges com Dot Indicador
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {allStatuses.map(status => (
              <StatusBadge key={status} status={status} showDot={true} />
            ))}
          </div>
        </section>

        {/* SEÇÃO 6: Animados */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            6. Badges Animados (Glow para urgentes, Pulse para ativos)
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {allStatuses.map(status => (
              <StatusBadge key={status} status={status} animated={true} />
            ))}
          </div>
        </section>

        {/* SEÇÃO 7: Dots Individuais */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            7. Status Dots (Indicadores)
          </h2>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            {allStatuses.map(status => {
              const config = getStatusConfig(status);
              const statusKey = status.replace(/_/g, '-');
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`${styles['status-dot']} ${styles[`dot-${statusKey}`]}`} />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 8: Dots com Pulse */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            8. Status Dots com Animação Pulse
          </h2>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            {allStatuses.map(status => {
              const config = getStatusConfig(status);
              const statusKey = status.replace(/_/g, '-');
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`${styles['status-dot']} ${styles[`dot-${statusKey}`]} ${styles['status-dot-pulse']}`}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 9: Contadores */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            9. Status Counters (Filtros com Contagem)
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <StatusCounter status={STATUS_TYPES.AGUARDANDO_ACEITE} count={12} />
            <StatusCounter status={STATUS_TYPES.ACEITO} count={8} />
            <StatusCounter status={STATUS_TYPES.EM_SEPARACAO} count={5} active={true} />
            <StatusCounter status={STATUS_TYPES.AGUARDANDO_RETIRADA} count={3} />
            <StatusCounter status={STATUS_TYPES.EM_TRANSITO} count={7} />
            <StatusCounter status={STATUS_TYPES.CONCLUIDO} count={45} />
          </div>
        </section>

        {/* SEÇÃO 10: Timeline */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            10. Timeline de Progresso
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {allStatuses.map(status => (
              <div key={status} style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', marginBottom: '12px', color: '#6b7280' }}>
                  Status atual: <strong>{getStatusConfig(status).label}</strong>
                </p>
                <StatusTimeline currentStatus={status} />
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 11: Cards com Destaque */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            11. Cards de Pedido com Destaque por Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allStatuses.map(status => {
              const config = getStatusConfig(status);
              const statusKey = status.replace(/_/g, '-');
              return (
                <div
                  key={status}
                  className={styles[`card-${statusKey}`]}
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', color: '#111827' }}>
                        Pedido #ABC-{Math.floor(Math.random() * 1000)}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        Cliente: Assistência Técnica XYZ
                      </p>
                    </div>
                    <StatusBadge status={status} variant="light" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 12: Paleta de Cores Completa */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            12. Paleta de Cores Completa
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allStatuses.map(status => {
              const config = getStatusConfig(status);
              return (
                <div
                  key={status}
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#111827' }}>
                    {config.label}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Primary</p>
                      <div
                        style={{
                          background: config.color.primary,
                          color: '#fff',
                          padding: '12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}
                      >
                        {config.color.primary}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Light</p>
                      <div
                        style={{
                          background: config.color.light,
                          color: config.color.dark,
                          padding: '12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center',
                          border: `1px solid ${config.color.border}`
                        }}
                      >
                        {config.color.light}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Dark</p>
                      <div
                        style={{
                          background: config.color.dark,
                          color: '#fff',
                          padding: '12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}
                      >
                        {config.color.dark}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Border</p>
                      <div
                        style={{
                          background: '#fff',
                          color: config.color.primary,
                          padding: '12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center',
                          border: `2px solid ${config.color.border}`
                        }}
                      >
                        {config.color.border}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SEÇÃO 13: Comparação de Contraste */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827' }}>
            13. Teste de Contraste e Legibilidade
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {allStatuses.map(status => {
              const config = getStatusConfig(status);
              return (
                <div
                  key={status}
                  style={{
                    background: config.color.primary,
                    color: '#fff',
                    padding: '24px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                    {config.label}
                  </h3>
                  <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    Texto branco sobre fundo colorido
                  </p>
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {config.color.primary}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <div
          style={{
            marginTop: '64px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
            Sistema de Cores AllMoove - Dashboard Distribuidor
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            6 status distintos • Totalmente acessível • Responsivo • Animações suaves
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Suporta High Contrast Mode</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Reduced Motion Compatible</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>•</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>WCAG AA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusShowcase;