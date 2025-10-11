import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'lucide-react';
import styles from './Button.module.css';

/**
 * Componente Button reutilizável do AllMoove Design System
 *
 * @param {string} variant - Estilo do botão: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - Tamanho do botão: 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Se true, botão ocupa 100% da largura
 * @param {boolean} disabled - Desabilita o botão
 * @param {boolean} loading - Mostra spinner de loading
 * @param {node} children - Conteúdo do botão
 * @param {function} onClick - Função de clique
 * @param {string} type - Tipo do botão: 'button' | 'submit' | 'reset'
 * @param {node} leftIcon - Ícone à esquerda do texto
 * @param {node} rightIcon - Ícone à direita do texto
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--fullWidth'],
    disabled && styles['button--disabled'],
    loading && styles['button--loading'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <Loader size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className={styles.spinner} />
      )}

      {!loading && leftIcon && (
        <span className={styles.icon}>{leftIcon}</span>
      )}

      <span className={styles.content}>{children}</span>

      {!loading && rightIcon && (
        <span className={styles.icon}>{rightIcon}</span>
      )}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
