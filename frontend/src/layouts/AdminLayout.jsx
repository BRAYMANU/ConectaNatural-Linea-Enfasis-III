import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, Package, Folder, Users, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'Inicio' },
  { to: '/admin/productos', icon: Package, label: 'Productos' },
  { to: '/admin/categorias', icon: Folder, label: 'Categorias' },
  { to: '/admin/administradores', icon: Users, label: 'Administradores' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 min-h-screen sticky top-0">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-botanic-800 text-lg px-6 py-5 border-b border-slate-100">
            <Leaf className="w-6 h-6 text-botanic-600" />
            <span>Conecta<span className="text-botanic-600">Natural</span></span>
          </Link>
          <div className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Panel admin
          </div>
          <nav className="flex-1 px-3 space-y-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-botanic-50 text-botanic-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="px-3 pb-4 mt-6 border-t border-slate-100 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Ir al dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-1"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesion
            </button>
          </div>
        </aside>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Topbar mobile */}
          <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3">
            <Link to="/admin" className="flex items-center gap-2 font-bold text-botanic-800">
              <Leaf className="w-5 h-5 text-botanic-600" />
              <span>ConectaNatural</span>
            </Link>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">{user?.nombre}</span>
              <button onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">{children}</main>

          {/* Nav horizontal mobile */}
          <nav className="lg:hidden grid grid-cols-4 gap-1 p-2 bg-white border-t border-slate-100 sticky bottom-0">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] ${
                      isActive ? 'text-botanic-800 bg-botanic-50' : 'text-slate-500'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
