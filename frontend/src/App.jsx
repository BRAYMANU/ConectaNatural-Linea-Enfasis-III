import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CategoriaDetallePage from './pages/CategoriaDetallePage.jsx';
import SubcategoriaDetallePage from './pages/SubcategoriaDetallePage.jsx';
import ProductoDetallePage from './pages/ProductoDetallePage.jsx';
import FavoritosPage from './pages/FavoritosPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminProductosPage from './pages/admin/AdminProductosPage.jsx';
import AdminCategoriasPage from './pages/admin/AdminCategoriasPage.jsx';
import AdminContenidosPage from './pages/admin/AdminContenidosPage.jsx';
import AdminFuentesPage from './pages/admin/AdminFuentesPage.jsx';
import AdminAdministradoresPage from './pages/admin/AdminAdministradoresPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Publicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard de usuario autenticado */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/categoria/:slug"
        element={
          <ProtectedRoute>
            <CategoriaDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/subcategoria/:id"
        element={
          <ProtectedRoute>
            <SubcategoriaDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/producto/:id"
        element={
          <ProtectedRoute>
            <ProductoDetallePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/favoritos"
        element={
          <ProtectedRoute>
            <FavoritosPage />
          </ProtectedRoute>
        }
      />

      {/* Panel admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <AdminRoute>
            <AdminProductosPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/productos/:productoId/contenidos"
        element={
          <AdminRoute>
            <AdminContenidosPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <AdminRoute>
            <AdminCategoriasPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categorias/:categoriaId/contenidos"
        element={
          <AdminRoute>
            <AdminContenidosPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/contenidos/:contenidoId/fuentes"
        element={
          <AdminRoute>
            <AdminFuentesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/administradores"
        element={
          <AdminRoute>
            <AdminAdministradoresPage />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
