import api from './api';

/**
 * Servicio de subida de archivos.
 * El backend devuelve { url, filename, size }. Guardamos `url` en imagenUrl del producto.
 */
export const uploadService = {
  imagen: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/uploads/imagen', fd, {
      // Axios setea el boundary automaticamente cuando data es FormData;
      // pasar 'multipart/form-data' es seguro.
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
