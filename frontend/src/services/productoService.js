import api from './api';

export const productoService = {
  listar: () => api.get('/productos').then((r) => r.data),
  listarPorCategoria: (categoriaId) =>
    api.get(`/productos/categoria/${categoriaId}`).then((r) => r.data),
  listarPorSlugCategoria: (slug) =>
    api.get(`/productos/categoria/slug/${slug}`).then((r) => r.data),
  detalle: (id) => api.get(`/productos/${id}/detalle`).then((r) => r.data),
};
