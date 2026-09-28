import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Header reutilizable para paginas admin: breadcrumb opcional + titulo + acciones.
 */
export default function AdminPageHeader({ title, subtitle, backTo, actions }) {
  return (
    <div className="mb-8">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center text-sm text-slate-500 hover:text-botanic-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-botanic-900">{title}</h1>
          {subtitle && <p className="text-slate-600 mt-1 text-sm sm:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
