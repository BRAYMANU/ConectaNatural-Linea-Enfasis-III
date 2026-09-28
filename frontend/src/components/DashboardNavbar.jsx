import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, LogOut, User, ChevronDown, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { categoriaService } from '../services/categoriaService';
import { productoService } from '../services/productoService';

/**
 * Navbar del dashboard con mega-menu en hover.
 * Para "productos-naturales" muestra una grilla de productos.
 * Para las demas muestra subcategorias.
 */
export default function DashboardNavbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count: favCount } = useFavorites();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    categoriaService.listarRaices().then(setCategorias).catch(console.error);
    productoService
      .listarPorSlugCategoria('productos-naturales')
      .then(setProductos)
      .catch(() => setProductos([]));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const iraCategoria = (cat) => {
    setOpenMenu(null);
    navigate(`/dashboard/categoria/${cat.slug}`);
  };

  const iraSubcategoria = (sub) => {
    setOpenMenu(null);
    navigate(`/dashboard/subcategoria/${sub.id}`);
  };

  const iraProducto = (p) => {
    setOpenMenu(null);
    navigate(`/dashboard/producto/${p.id}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-botanic-800 text-lg">
          <Leaf className="w-6 h-6 text-botanic-600" />
          <span>
            Conecta<span className="text-botanic-600">Natural</span>
          </span>
        </Link>

        {/* Dropdowns de categorias (hover en desktop) */}
        <ul className="hidden md:flex items-center gap-1">
          {categorias.map((cat) => {
            const esProductos = cat.slug === 'productos-naturales';
            return (
              <li
                key={cat.id}
                className="relative"
                onMouseEnter={() => setOpenMenu(cat.id)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  onClick={() => iraCategoria(cat)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-botanic-50"
                >
                  {cat.nombre}
                  {(esProductos || cat.subcategorias?.length > 0) && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {openMenu === cat.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden ${
                        esProductos ? 'left-1/2 -translate-x-1/2 w-[640px]' : 'left-0 w-64'
                      }`}
                    >
                      {esProductos ? (
                        // MEGA MENU productos
                        <div className="p-4">
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                            Productos disponibles
                          </div>
                          {productos.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-400">
                              No hay productos publicados aun.
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                              {productos.slice(0, 9).map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => iraProducto(p)}
                                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-botanic-50 text-left transition"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-botanic-100 to-botanic-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {p.imagenUrl ? (
                                      <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                      <Leaf className="w-5 h-5 text-botanic-600" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-800 truncate">
                                      {p.nombre}
                                    </div>
                                    <div className="text-xs text-slate-500 line-clamp-1">
                                      {p.descripcion}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => iraCategoria(cat)}
                            className="mt-3 w-full text-center px-3 py-2 text-sm font-medium text-botanic-700 hover:bg-botanic-50 rounded-lg border-t border-slate-100"
                          >
                            Ver todos los productos &rarr;
                          </button>
                        </div>
                      ) : cat.subcategorias?.length > 0 ? (
                        // Lista simple de subcategorias
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                            {cat.nombre}
                          </div>
                          {cat.subcategorias.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => iraSubcategoria(sub)}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-botanic-50"
                            >
                              {sub.nombre}
                            </button>
                          ))}
                          <button
                            onClick={() => iraCategoria(cat)}
                            className="block w-full text-left px-4 py-2 text-sm text-botanic-700 font-medium border-t border-slate-100 hover:bg-botanic-50"
                          >
                            Ver todo &rarr;
                          </button>
                        </div>
                      ) : (
                        <div className="px-4 py-3 text-xs text-slate-400">
                          Aun sin subcategorias.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2">
          {/* Favoritos */}
          <Link
            to="/dashboard/favoritos"
            className="relative p-2 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
            title="Mis favoritos"
          >
            <Heart className="w-5 h-5" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favCount > 9 ? '9+' : favCount}
              </span>
            )}
          </Link>

          {/* Boton panel admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-botanic-600 text-white text-sm font-medium hover:bg-botanic-700 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Panel admin
            </Link>
          )}

          {/* Perfil */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-botanic-100 flex items-center justify-center text-botanic-700">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-slate-800 leading-tight">{user?.nombre}</div>
                <div className="text-xs text-slate-500">{user?.rol}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <AnimatePresence>
              {openProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-lg w-56 py-2 z-50"
                >
                  <div className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">
                    <div className="font-semibold">{user?.nombre}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <Link
                    to="/dashboard/favoritos"
                    onClick={() => setOpenProfile(false)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Heart className="w-4 h-4" /> Mis favoritos
                    {favCount > 0 && (
                      <span className="ml-auto text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                        {favCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpenProfile(false)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-botanic-700 hover:bg-botanic-50 sm:hidden"
                    >
                      <ShieldCheck className="w-4 h-4" /> Panel admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}
