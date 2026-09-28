import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Folder, Users, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

const secciones = [
  {
    to: '/admin/productos',
    icon: Package,
    color: 'bg-emerald-100 text-emerald-700',
    titulo: 'Productos',
    descripcion: 'Crea, edita y elimina productos naturales asociados a categorias.',
    statKey: 'productos',
  },
  {
    to: '/admin/categorias',
    icon: Folder,
    color: 'bg-amber-100 text-amber-700',
    titulo: 'Categorias',
    descripcion: 'Gestiona las 4 categorias principales y sus subcategorias.',
    statKey: 'categorias',
  },
  {
    to: '/admin/administradores',
    icon: Users,
    color: 'bg-sky-100 text-sky-700',
    titulo: 'Administradores',
    descripcion: 'Registra nuevos administradores y gestiona usuarios.',
    statKey: 'usuarios',
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      adminService.productos.listar().catch(() => []),
      adminService.categorias.listarRaices().catch(() => []),
      adminService.usuarios.listar().catch(() => []),
      adminService.contenidos.listar().catch(() => []),
    ]).then(([prods, cats, users, conts]) => {
      const subcount = cats.reduce((acc, c) => acc + (c.subcategorias?.length || 0), 0);
      setStats({
        productos: prods.length,
        categorias: cats.length + subcount,
        usuarios: users.length,
        contenidos: conts.length,
      });
    });
  }, []);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-botanic-900 mb-1">Panel de administracion</h1>
        <p className="text-slate-600 mb-8">
          Bienvenido, {user?.nombre}. Desde aqui gestionas todo el contenido de ConectaNatural.
        </p>

        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <ResumenCard label="Productos" value={stats.productos ?? '-'} icon={Package} />
          <ResumenCard label="Categorias" value={stats.categorias ?? '-'} icon={Folder} />
          <ResumenCard label="Contenidos" value={stats.contenidos ?? '-'} icon={BookOpen} />
          <ResumenCard label="Usuarios" value={stats.usuarios ?? '-'} icon={Users} />
        </div>

        {/* Secciones */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {secciones.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className="card-surface hover:shadow-md transition group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-botanic-900 mb-1">{s.titulo}</h3>
                    <p className="text-slate-600 text-sm mb-3">{s.descripcion}</p>
                    <span className="inline-flex items-center text-sm font-medium text-botanic-700 group-hover:translate-x-1 transition">
                      Gestionar <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Atajo a la app publica */}
          <Link
            to="/dashboard"
            className="card-surface hover:shadow-md transition group flex items-start gap-4 bg-gradient-to-br from-botanic-50 to-white"
          >
            <div className="w-12 h-12 rounded-xl bg-botanic-100 text-botanic-700 flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-botanic-900 mb-1">Ver como usuario</h3>
              <p className="text-slate-600 text-sm mb-3">
                Abre la vista publica del catalogo para revisar como queda tu contenido.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-botanic-700 group-hover:translate-x-1 transition">
                Ir al dashboard <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </Link>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

function ResumenCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-bold text-botanic-900">{value}</div>
      </div>
    </div>
  );
}
