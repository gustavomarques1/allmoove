import PropTypes from 'prop-types';
import './Logo.css';

function Logo({ size = 24, className = '' }) {
  // Proporção original da logo: 1090.69 / 254.4 ≈ 4.29
  const aspectRatio = 4.29;

  return (
    <img
      src="/logos/logoallmoove.svg"
      alt="AllMoove"
      style={{
        height: `${size}px`,
        width: `${size * aspectRatio}px`,
        objectFit: 'contain',
        imageRendering: 'auto',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
      className={`allmoove-logo ${className}`.trim()}
    />
  );
}

Logo.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export default Logo;
