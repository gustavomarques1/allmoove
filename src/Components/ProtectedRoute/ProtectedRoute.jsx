import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * Componente para proteger rotas que requerem autenticação e/ou papéis específicos
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Componente a ser renderizado se autorizado
 * @param {string[]} [props.allowedRoles] - Array de papéis permitidos (opcional)
 * @param {string} [props.redirectTo] - Rota para redirecionar se não autorizado
 */
const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/' }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se allowedRoles foi especificado, verificar se o usuário tem um dos papéis
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // Usuário não tem permissão, redirecionar para página não autorizada
      return <Navigate to="/nao-autorizado" replace />;
    }
  }

  // Usuário autenticado e autorizado
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string
};

export default ProtectedRoute;
