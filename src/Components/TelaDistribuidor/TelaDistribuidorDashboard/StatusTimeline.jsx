/**
 * STATUS TIMELINE COMPONENT
 * Componente visual de timeline para mostrar progresso do pedido
 * AllMoove - Dashboard Distribuidor
 */

import PropTypes from 'prop-types';
import { STATUS_TYPES, getStatusConfig, normalizeStatus } from '../../../utils/statusUtils';
import styles from './StatusColors.module.css';

/**
 * Timeline visual mostrando o progresso do pedido através dos status
 */
const StatusTimeline = ({ currentStatus, compact = false, showLabels = true }) => {
  const normalizedCurrent = normalizeStatus(currentStatus);

  // Sequência de status na ordem correta
  const statusSequence = [
    STATUS_TYPES.AGUARDANDO_ACEITE,
    STATUS_TYPES.ACEITO,
    STATUS_TYPES.EM_SEPARACAO,
    STATUS_TYPES.AGUARDANDO_RETIRADA,
    STATUS_TYPES.EM_TRANSITO,
    STATUS_TYPES.CONCLUIDO
  ];

  // Encontra o índice do status atual
  const currentIndex = statusSequence.indexOf(normalizedCurrent);

  // Determina o estado de cada step
  const getStepState = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className={styles['status-timeline']}>
      {statusSequence.map((status, index) => {
        const config = getStatusConfig(status);
        const state = getStepState(index);
        const statusKey = status.replace(/_/g, '-');

        return (
          <div
            key={status}
            className={`${styles['timeline-step']} ${styles[state]}`}
            style={{
              color: state !== 'pending' ? config.color.primary : '#9ca3af'
            }}
          >
            <div
              className={styles['timeline-dot']}
              style={{
                background: state !== 'pending' ? config.color.primary : '#e5e7eb',
                borderColor: state === 'active' ? config.color.primary : '#fff'
              }}
            >
              {state === 'completed' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    fontSize: '12px',
                    lineHeight: 1
                  }}
                >
                  ✓
                </div>
              )}
            </div>

            {showLabels && !compact && (
              <div className={styles['timeline-label']}>
                {config.shortLabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

StatusTimeline.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  showLabels: PropTypes.bool
};

export default StatusTimeline;