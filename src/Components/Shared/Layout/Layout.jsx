import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../Navbar/Navbar';
import styles from './Layout.module.css';

/**
 * Layout wrapper com Navbar
 * Envolve as páginas autenticadas com a barra de navegação
 *
 * @param {node} children - Conteúdo da página
 * @param {string} userType - Tipo de usuário: 'assistencia' | 'distribuidor' | 'entregador'
 */
function Layout({ children, userType }) {
  return (
    <div className={styles.layout}>
      <Navbar userType={userType} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userType: PropTypes.oneOf(['assistencia', 'distribuidor', 'entregador']).isRequired,
};

export default Layout;
