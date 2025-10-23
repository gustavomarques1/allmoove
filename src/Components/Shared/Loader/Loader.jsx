import PropTypes from 'prop-types';
import styles from './Loader.module.css';

/**
 * Loader Component - Spinner personalizado com cores AllMoove
 *
 * @param {string} size - Tamanho: 'sm', 'md', 'lg', 'xl'
 * @param {string} variant - Variante de cor: 'primary' (laranja), 'secondary' (azul), 'white'
 * @param {boolean} center - Centraliza o loader na tela
 * @param {string} text - Texto opcional abaixo do loader
 */
function Loader({
  size = 'md',
  variant = 'primary',
  center = false,
  text = ''
}) {
  const containerClass = center
    ? `${styles.loaderContainer} ${styles.center}`
    : styles.loaderContainer;

  return (
    <div className={containerClass}>
      <div
        className={`${styles.loader} ${styles[size]} ${styles[variant]}`}
        role="status"
        aria-label={text || 'Carregando...'}
      >
        <span className={styles.srOnly}>Carregando...</span>
      </div>
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'white']),
  center: PropTypes.bool,
  text: PropTypes.string,
};

export default Loader;
