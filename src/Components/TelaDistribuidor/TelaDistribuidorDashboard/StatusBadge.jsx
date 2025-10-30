/**
 * STATUS BADGE COMPONENT
 * Componente reutilizável para exibir badges de status de pedidos
 * AllMoove - Dashboard Distribuidor
 */

import PropTypes from 'prop-types';
import { getStatusConfig, normalizeStatus, getStatusIcon } from '../../../utils/statusUtils';
import styles from './StatusColors.module.css';

/**
 * Badge de status com cores e ícones dinâmicos
 */
const StatusBadge = ({
  status,
  variant = 'default',
  size = 'md',
  showIcon = true,
  showDot = false,
  animated = false,
  className = ''
}) => {
  const config = getStatusConfig(status);
  const normalized = normalizeStatus(status);
  const statusKey = normalized.replace(/_/g, '-');

  // Define classes baseadas no variant
  const getVariantClass = () => {
    switch (variant) {
      case 'light':
        return styles[`status-${statusKey}-light`];
      case 'outline':
        return styles[`status-${statusKey}-outline`];
      default:
        return styles[`status-${statusKey}`];
    }
  };

  // Define classes de tamanho
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles['status-badge-sm'];
      case 'lg':
        return styles['status-badge-lg'];
      default:
        return '';
    }
  };

  // Define classes de animação
  const getAnimationClass = () => {
    if (!animated) return '';

    if (config.showGlow) {
      return styles['status-glow'];
    }

    if (config.showPulse) {
      return styles['status-dot-pulse'];
    }

    return styles['status-fade-in'];
  };

  const badgeClasses = [
    styles['status-badge'],
    getVariantClass(),
    getSizeClass(),
    getAnimationClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {showDot && (
        <span
          className={`${styles['status-dot']} ${styles[`dot-${statusKey}`]} ${
            config.showPulse ? styles['status-dot-pulse'] : ''
          }`}
        />
      )}
      {showIcon && (() => {
        const IconComponent = getStatusIcon(status);
        return <IconComponent size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />;
      })()}
      <span>{config.label}</span>
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'light', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
  showDot: PropTypes.bool,
  animated: PropTypes.bool,
  className: PropTypes.string
};

export default StatusBadge;