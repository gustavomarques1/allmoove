import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './NaoAutorizado.module.css';

/**
 * Página exibida quando o usuário tenta acessar uma rota sem permissão
 */
const NaoAutorizado = () => {
  const navigate = useNavigate();
  const { getDashboardRoute, userRole, logout } = useAuth();

  const handleVoltar = () => {
    const dashboardRoute = getDashboardRoute();
    navigate(dashboardRoute);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🚫</div>
        <h1 className={styles.title}>Acesso Negado</h1>
        <p className={styles.message}>
          Você não tem permissão para acessar esta página.
        </p>
        <p className={styles.role}>
          Seu papel atual: <strong>{userRole || 'Não identificado'}</strong>
        </p>
        <div className={styles.actions}>
          <button onClick={handleVoltar} className={styles.primaryButton}>
            Voltar ao Dashboard
          </button>
          <button onClick={handleLogout} className={styles.secondaryButton}>
            Fazer Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaoAutorizado;
