import api from './api';

export const categoriaService = {
  listarRaices: () => api.get('/categorias/raices').then((r) => r.data),
  listarSubcategorias: (padreId) =>
    api.get(`/categorias/${padreId}/subcategorias`).then((r) => r.data),
  obtenerPorId: (id) => api.get(`/categorias/${id}`).then((r) => r.data),
  obtenerPorSlug: (slug) => api.get(`/categorias/slug/${slug}`).then((r) => r.data),
  detalleSubcategoria: (id) => api.get(`/categorias/${id}/detalle`).then((r) => r.data),
};
