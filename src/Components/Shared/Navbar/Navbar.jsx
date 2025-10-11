import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Home, ShoppingBag, Package, Truck, User } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';

/**
 * Navbar global persistente do AllMoove
 *
 * @param {string} userType - Tipo de usuário: 'assistencia' | 'distribuidor' | 'entregador'
 */
function Navbar({ userType = 'assistencia' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Recupera email do localStorage
  const userEmail = localStorage.getItem('email') || 'Usuário';
  const userName = userEmail.split('@')[0]; // Pega parte antes do @

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Define navegação baseada no tipo de usuário
  const getNavLinks = () => {
    switch (userType) {
      case 'assistencia':
        return [
          { path: '/assistencia/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
          { path: '/assistencia/loja', label: 'Buscar Peças', icon: <ShoppingBag size={18} /> },
        ];
      case 'distribuidor':
        return [
          { path: '/distribuidor/dashboard', label: 'Dashboard', icon: <Package size={18} /> },
        ];
      case 'entregador':
        return [
          { path: '/entregador', label: 'Minhas Entregas', icon: <Truck size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo} onClick={() => navigate(navLinks[0]?.path)}>
          <span className={styles.logoText}>AllMoove</span>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles.navLinkActive : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <User size={18} className={styles.userIcon} />
            <span className={styles.userName}>{userName}</span>
          </div>

          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut size={18} />
            <span className={styles.logoutText}>Sair</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileUserInfo}>
            <User size={20} />
            <span>{userName}</span>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`${styles.mobileNavLink} ${isActive(link.path) ? styles.mobileNavLinkActive : ''}`}
              onClick={() => {
                navigate(link.path);
                setIsMenuOpen(false);
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

          <button
            className={styles.mobileLogoutButton}
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  userType: PropTypes.oneOf(['assistencia', 'distribuidor', 'entregador']).isRequired,
};

export default Navbar;
