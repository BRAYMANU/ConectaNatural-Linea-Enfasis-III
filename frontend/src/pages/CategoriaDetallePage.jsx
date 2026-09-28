import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, Folder } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { categoriaService } from '../services/categoriaService';
import { productoService } from '../services/productoService';

/**
 * Vista de una categoria principal.
 * Muestra (cuando existen):
 *  - Lista de subcategorias.
 *  - Lista de productos asociados directamente a la categoria.
 */
export default function CategoriaDetallePage() {
  const { slug } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [cat, prods] = await Promise.all([
          categoriaService.obtenerPorSlug(slug),
          productoService.listarPorSlugCategoria(slug).catch(() => []),
        ]);
        setCategoria(cat);
        setProductos(prods || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Cargando...</p>
      </DashboardLayout>
    );
  }

  if (!categoria) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Categoria no encontrada.</p>
      </DashboardLayout>
    );
  }

  const subcategorias = categoria.subcategorias || [];
  const haySub = subcategorias.length > 0;
  const hayProd = productos.length > 0;
  const vacio = !haySub && !hayProd;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-slate-500 hover:text-botanic-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold text-botanic-900 mb-2">{categoria.nombre}</h1>
        <p className="text-slate-600 mb-8 max-w-3xl">{categoria.descripcion}</p>

        {/* Subcategorias */}
        {haySub && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-5 h-5 text-botanic-700" />
              <h2 className="text-xl font-bold text-botanic-900">Subcategorias</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {subcategorias.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/dashboard/subcategoria/${sub.id}`}
                  className="card-surface hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-botanic-900 mb-1">{sub.nombre}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{sub.descripcion}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Productos */}
        {hayProd && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-botanic-700" />
              <h2 className="text-xl font-bold text-botanic-900">Productos</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productos.map((p) => (
                <Link
                  key={p.id}
                  to={`/dashboard/producto/${p.id}`}
                  className="card-surface hover:shadow-md transition group"
                >
                  <div className="w-full h-40 rounded-xl bg-gradient-to-br from-botanic-100 to-botanic-200 flex items-center justify-center mb-4 overflow-hidden">
                    {p.imagenUrl ? (
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Leaf className="w-16 h-16 text-botanic-600" strokeWidth={1.2} />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-botanic-900 mb-1">{p.nombre}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{p.descripcion}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {vacio && (
          <p className="text-slate-400">
            Aun no hay subcategorias ni productos en esta categoria. El administrador los agregara pronto.
          </p>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
