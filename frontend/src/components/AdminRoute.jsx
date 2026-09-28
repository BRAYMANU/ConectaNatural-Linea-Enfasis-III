import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Ruta protegida exclusiva para rol ADMIN.
 * Si no autenticado -> /login
 * Si autenticado pero no ADMIN -> /dashboard
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
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

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
