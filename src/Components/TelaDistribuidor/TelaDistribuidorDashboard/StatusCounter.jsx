/**
 * STATUS COUNTER COMPONENT
 * Componente para exibir contadores de pedidos por status
 * AllMoove - Dashboard Distribuidor
 */

import PropTypes from 'prop-types';
import { getStatusConfig, normalizeStatus } from '../../../utils/statusUtils';
import styles from './StatusColors.module.css';

/**
 * Counter badge para mostrar quantidade de pedidos em um status
 */
const StatusCounter = ({ status, count, onClick, active = false }) => {
  const config = getStatusConfig(status);
  const normalized = normalizeStatus(status);
  const statusKey = normalized.replace(/_/g, '-');

  const counterClass = styles[`counter-${statusKey}`];

  return (
    <button
      className={`${styles['filter-btn']} ${active ? styles['active'] : ''} ${styles[`filter-btn-${statusKey}`]}`}
      onClick={onClick}
      disabled={count === 0}
      title={`${config.label}: ${count} pedido${count !== 1 ? 's' : ''}`}
    >
      {config.icon && config.icon({ size: 16 })}
      <span>{config.shortLabel}</span>
      <span className={counterClass}>{count}</span>
    </button>
  );
};

StatusCounter.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.bool
};

export default StatusCounter;