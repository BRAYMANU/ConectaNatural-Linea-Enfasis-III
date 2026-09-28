import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrapper de rutas privadas. Redirige a /login si no hay sesion.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-botanic-700">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
