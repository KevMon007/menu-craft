import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Si no hay una sesión válida, redirige al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si existe una sesión, permite el acceso al componente hijo (AdminLayout)
  return children;
};

export default PrivateRoute;
