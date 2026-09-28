import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, Leaf } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import AdvertenciaMedica from '../components/AdvertenciaMedica.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import { productoService } from '../services/productoService';

export default function ProductoDetallePage() {
  const { id } = useParams();
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productoService
      .detalle(id)
      .then(setDetalle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Cargando...</p>
      </DashboardLayout>
    );
  }

  if (!detalle?.producto) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Producto no encontrado.</p>
      </DashboardLayout>
    );
  }

  const { producto, contenido } = detalle;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          to="/dashboard/categoria/productos-naturales"
          className="inline-flex items-center text-sm text-slate-500 hover:text-botanic-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a productos
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-botanic-100 to-botanic-200 flex items-center justify-center overflow-hidden">
              {producto.imagenUrl ? (
                <img src={producto.imagenUrl} alt={producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <Leaf className="w-24 h-24 text-botanic-600" strokeWidth={1.2} />
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <span className="inline-block text-xs font-semibold text-botanic-700 bg-botanic-100 px-3 py-1 rounded-full mb-3">
              {producto.categoriaNombre}
            </span>
            <h1 className="text-3xl font-bold text-botanic-900 mb-3">{producto.nombre}</h1>
            <p className="text-slate-600 leading-relaxed mb-4">{producto.descripcion}</p>
            <FavoriteButton
              type="producto"
              id={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              imagenUrl={producto.imagenUrl}
            />
          </div>
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
            <p>Este producto aun no tiene contenido educativo publicado.</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
