import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Navbar publico de la landing. Scroll a secciones + CTAs a /login y /register.
 */
export default function PublicNavbar() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2 font-bold text-botanic-800 text-lg"
          aria-label="Ir al inicio"
        >
          <Leaf className="w-6 h-6 text-botanic-600" />
          <span>Conecta<span className="text-botanic-600">Natural</span></span>
        </button>

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <li>
            <button onClick={() => scrollTo('beneficios')} className="hover:text-botanic-700">
              Beneficios
            </button>
          </li>
          <li>
            <button onClick={() => scrollTo('categorias')} className="hover:text-botanic-700">
              Categorias
            </button>
          </li>
          <li>
            <button onClick={() => scrollTo('sobre-nosotros')} className="hover:text-botanic-700">
              Sobre nosotros
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-botanic-700 px-4 py-2 rounded-lg hover:bg-botanic-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-botanic-700 text-white px-4 py-2 rounded-lg hover:bg-botanic-800"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
}
