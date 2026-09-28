import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Leaf, Folder, Trash2 } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function FavoritosPage() {
  const { favorites, remove, count } = useFavorites();

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-botanic-900">Mis favoritos</h1>
        </div>
        <p className="text-slate-600 mb-8">
          {count === 0
            ? 'Cuando marques productos o subcategorias con el corazon apareceran aqui.'
            : `${count} ${count === 1 ? 'elemento guardado' : 'elementos guardados'}.`}
        </p>

        {count === 0 ? (
          <div className="card-surface text-center py-16 text-slate-500">
            Aun no tienes favoritos.{' '}
            <Link to="/dashboard" className="text-botanic-700 font-medium hover:underline">
              Explora el catalogo
            </Link>
            .
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {favorites.map((f) => {
                const linkTo =
                  f.type === 'producto'
                    ? `/dashboard/producto/${f.id}`
                    : `/dashboard/subcategoria/${f.id}`;
                const Icon = f.type === 'producto' ? Leaf : Folder;
                return (
                  <motion.div
                    key={`${f.type}-${f.id}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="card-surface hover:shadow-md transition group relative"
                  >
                    <button
                      onClick={() => remove(f.type, f.id)}
                      className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Quitar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link to={linkTo} className="block">
                      <div className="w-full h-32 rounded-xl bg-gradient-to-br from-botanic-100 to-botanic-200 flex items-center justify-center mb-4 overflow-hidden">
                        {f.imagenUrl ? (
                          <img src={f.imagenUrl} alt={f.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <Icon className="w-12 h-12 text-botanic-600" strokeWidth={1.2} />
                        )}
                      </div>
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-botanic-700 bg-botanic-100 px-2 py-0.5 rounded-full mb-2">
                        {f.type === 'producto' ? 'Producto' : 'Subcategoria'}
                      </span>
                      <h3 className="text-base font-semibold text-botanic-900 mb-1">{f.nombre}</h3>
                      {f.descripcion && (
                        <p className="text-slate-600 text-xs line-clamp-2">{f.descripcion}</p>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
