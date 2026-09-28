import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Boton corazon. Cambia de relleno cuando el item esta en favoritos.
 * Props: type ('producto' | 'subcategoria'), id, nombre, descripcion?, imagenUrl?, size? ('sm'|'md'|'lg')
 */
export default function FavoriteButton({ type, id, nombre, descripcion, imagenUrl, size = 'md', label = true }) {
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const fav = isFavorite(type, id);

  const dim = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size];

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({ type, id, nombre, descripcion, imagenUrl });
    if (fav) {
      toast.info(`Quitado de favoritos: ${nombre}`);
    } else {
      toast.success(`Agregado a favoritos: ${nombre}`);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
        fav
          ? 'bg-rose-50 border-rose-200 text-rose-600'
          : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'
      }`}
      aria-pressed={fav}
      aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart className={dim} fill={fav ? 'currentColor' : 'none'} />
      {label && <span className="text-sm font-medium">{fav ? 'En favoritos' : 'Agregar a favoritos'}</span>}
    </motion.button>
  );
}
