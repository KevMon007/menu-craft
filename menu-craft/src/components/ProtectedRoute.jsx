import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Si no está autenticado, redirigir al Login de forma segura
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el módulo administrativo solicitado
  return <Outlet />;
};

export default ProtectedRoute;
