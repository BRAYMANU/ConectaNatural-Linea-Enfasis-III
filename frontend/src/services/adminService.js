import api from './api';

/**
 * Servicio unificado para operaciones de administracion (CRUD).
 * Todas las rutas requieren JWT con rol ADMIN.
 */
export const adminService = {
  // ========== CATEGORIAS / SUBCATEGORIAS ==========
  categorias: {
    listarRaices: () => api.get('/categorias/raices').then((r) => r.data),
    listarSubcategorias: (padreId) =>
      api.get(`/categorias/${padreId}/subcategorias`).then((r) => r.data),
    obtener: (id) => api.get(`/categorias/${id}`).then((r) => r.data),
    crear: (payload) => api.post('/categorias', payload).then((r) => r.data),
    actualizar: (id, payload) => api.put(`/categorias/${id}`, payload).then((r) => r.data),
    eliminar: (id) => api.delete(`/categorias/${id}`),
  },

  // ========== PRODUCTOS ==========
  productos: {
    listar: () => api.get('/productos').then((r) => r.data),
    listarPorCategoria: (categoriaId) =>
      api.get(`/productos/categoria/${categoriaId}`).then((r) => r.data),
    crear: (payload) => api.post('/productos', payload).then((r) => r.data),
    actualizar: (id, payload) => api.put(`/productos/${id}`, payload).then((r) => r.data),
    eliminar: (id) => api.delete(`/productos/${id}`),
  },

  // ========== CONTENIDOS EDUCATIVOS ==========
  contenidos: {
    listar: () => api.get('/contenidos').then((r) => r.data),
    obtener: (id) => api.get(`/contenidos/${id}`).then((r) => r.data),
    crear: (payload) => api.post('/contenidos', payload).then((r) => r.data),
    actualizar: (id, payload) => api.put(`/contenidos/${id}`, payload).then((r) => r.data),
    eliminar: (id) => api.delete(`/contenidos/${id}`),
  },

  // ========== FUENTES CIENTIFICAS ==========
  fuentes: {
    listarPorContenido: (contenidoId) =>
      api.get(`/fuentes/contenido/${contenidoId}`).then((r) => r.data),
    crear: (payload) => api.post('/fuentes', payload).then((r) => r.data),
    actualizar: (id, payload) => api.put(`/fuentes/${id}`, payload).then((r) => r.data),
    eliminar: (id) => api.delete(`/fuentes/${id}`),
  },

  // ========== USUARIOS ==========
  usuarios: {
    listar: () => api.get('/admin/usuarios').then((r) => r.data),
    obtener: (id) => api.get(`/admin/usuarios/${id}`).then((r) => r.data),
    crear: (payload) => api.post('/admin/usuarios', payload).then((r) => r.data),
    cambiarEstado: (id, activo) =>
      api.patch(`/admin/usuarios/${id}/estado?activo=${activo}`).then((r) => r.data),
    eliminar: (id) => api.delete(`/admin/usuarios/${id}`),
  },
};
