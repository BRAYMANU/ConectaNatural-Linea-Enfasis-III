import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sprout, Brain, AlertTriangle, ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { categoriaService } from '../services/categoriaService';
import { useAuth } from '../context/AuthContext';

const ICONOS = {
  'productos-naturales': Leaf,
  'nutricion': Sprout,
  'terapias': Brain,
  'precauciones': AlertTriangle,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriaService
      .listarRaices()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-botanic-900 mb-1">
          Hola, {user?.nombre}
        </h1>
        <p className="text-slate-600 mb-8">
          Elige una categoria para explorar contenido verificado cientificamente.
        </p>

        {loading ? (
          <p className="text-slate-400">Cargando categorias...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categorias.map((cat) => {
              const Icon = ICONOS[cat.slug] || Leaf;
              return (
                <Link
                  key={cat.id}
                  to={`/dashboard/categoria/${cat.slug}`}
                  className="card-surface hover:shadow-md transition group"
                >
                  <Icon className="w-10 h-10 text-botanic-600 mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-botanic-900 mb-1">{cat.nombre}</h3>
                  <p className="text-slate-600 text-sm mb-4">{cat.descripcion}</p>

                  <span className="inline-flex items-center text-sm font-medium text-botanic-700 group-hover:translate-x-1 transition">
                    Explorar <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
