import { ShieldAlert } from 'lucide-react';

/**
 * Componente que aparece en cada detalle de contenido.
 * Requerimiento de la tesis: promover un uso responsable.
 */
export default function AdvertenciaMedica() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4 flex items-start gap-3">
      <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-900 mb-0.5">Advertencia importante</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Consulta siempre con un profesional antes de tomar decisiones. Esta informacion es
          educativa y no reemplaza la asesoria medica.
        </p>
      </div>
    </div>
  );
}
