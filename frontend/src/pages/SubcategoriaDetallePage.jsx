import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Leaf } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AdvertenciaMedica from '../components/AdvertenciaMedica.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { categoriaService } from '../services/categoriaService';
import { productoService } from '../services/productoService';

/**
 * Detalle de subcategoria (Nutricion, Terapias, Precauciones).
 * Muestra: nombre + resumen del admin + fuentes cientificas + productos asociados (si existen).
 */
export default function SubcategoriaDetallePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [det, prods] = await Promise.all([
          categoriaService.detalleSubcategoria(id),
          productoService.listarPorCategoria(id).catch(() => []),
        ]);
        setData(det);
        setProductos(prods || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Cargando...</p>
      </DashboardLayout>
    );
  }
  if (!data?.categoria) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Subcategoria no encontrada.</p>
      </DashboardLayout>
    );
  }

  const { categoria, contenido } = data;
  const padreLink = categoria.categoriaPadreNombre
    ? `/dashboard/categoria/${categoria.categoriaPadreNombre.toLowerCase().replace(/\s+/g, '-')}`
    : '/dashboard';

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to={padreLink}
          className="inline-flex items-center text-sm text-slate-500 hover:text-botanic-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Link>

        {categoria.categoriaPadreNombre && (
          <span className="inline-block text-xs font-semibold text-botanic-700 bg-botanic-100 px-3 py-1 rounded-full mb-3">
            {categoria.categoriaPadreNombre}
          </span>
        )}
        <h1 className="text-3xl font-bold text-botanic-900 mb-2">{categoria.nombre}</h1>
        <p className="text-slate-600 mb-4 max-w-3xl">{categoria.descripcion}</p>

        <div className="mb-6">
          <FavoriteButton
            type="subcategoria"
            id={categoria.id}
            nombre={categoria.nombre}
            descripcion={categoria.descripcion}
          />
        </div>

        <AdvertenciaMedica />

        {contenido ? (
          <div className="mt-8 space-y-6">
            <div className="card-surface">
              <div className="flex items-center gap-2 text-xs font-semibold text-botanic-700 uppercase tracking-wide mb-3">
                <BookOpen className="w-4 h-4" /> Resumen del administrador
              </div>
              <h2 className="text-xl font-bold text-botanic-900 mb-3">{contenido.titulo}</h2>
              <p className="text-slate-700 leading-relaxed mb-4">{contenido.resumen}</p>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                {contenido.cuerpo}
              </div>
            </div>

            <div className="card-surface">
              <h3 className="text-lg font-bold text-botanic-900 mb-4">Fuentes cientificas</h3>
              {contenido.fuentes?.length ? (
                <ul className="space-y-3">
                  {contenido.fuentes.map((f) => (
                    <li key={f.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                      <ExternalLink className="w-4 h-4 text-botanic-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-slate-800">{f.tituloArticulo}</div>
                        <div className="text-xs text-slate-500">
                          {[f.autores, f.revista, f.anioPublicacion].filter(Boolean).join(' - ')}
                        </div>
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-botanic-700 hover:underline break-all"
                          >
                            {f.url}
                          </a>
                        )}
                        {f.doi && (
                          <div className="text-xs text-slate-500 mt-0.5">DOI: {f.doi}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  Aun no hay fuentes cientificas cargadas para este contenido.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 card-surface text-center text-slate-500">
            <p>Esta subcategoria aun no tiene contenido educativo publicado.</p>
          </div>
        )}

        {/* Productos asociados a la subcategoria */}
        {productos.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-botanic-700" />
              <h2 className="text-xl font-bold text-botanic-900">Productos relacionados</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productos.map((p) => (
                <Link
                  key={p.id}
                  to={`/dashboard/producto/${p.id}`}
                  className="card-surface hover:shadow-md transition group"
                >
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-botanic-100 to-botanic-200 flex items-center justify-center mb-3 overflow-hidden">
                    {p.imagenUrl ? (
                      <img
                        src={p.imagenUrl}
                        alt={p.nombre}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Leaf className="w-12 h-12 text-botanic-600" strokeWidth={1.2} />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-botanic-900 mb-1">{p.nombre}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2">{p.descripcion}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
