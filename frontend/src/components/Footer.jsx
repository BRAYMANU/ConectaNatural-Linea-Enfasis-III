import { Leaf, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-botanic-900 text-botanic-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-botanic-300" />
            <span className="font-bold text-white">ConectaNatural</span>
          </div>
          <p className="text-sm text-botanic-200 leading-relaxed">
            Plataforma informativa sobre medicina complementaria con respaldo cientifico.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Enlaces rapidos</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#hero" className="hover:text-white">Inicio</a></li>
            <li><a href="#beneficios" className="hover:text-white">Beneficios</a></li>
            <li><a href="#categorias" className="hover:text-white">Categorias</a></li>
            <li><a href="#sobre-nosotros" className="hover:text-white">Sobre nosotros</a></li>
          </ul>
        </div>

        <div>
          <div className="flex items-start gap-2 bg-botanic-800/60 border border-botanic-700 rounded-xl p-4">
            <ShieldAlert className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-botanic-100 leading-relaxed">
              <strong className="text-white">Importante:</strong> Esta informacion no reemplaza la
              asesoria medica profesional. Consulta siempre con un especialista antes de tomar decisiones
              sobre tu salud.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-botanic-800 py-4 text-center text-xs text-botanic-300">
        &copy; {new Date().getFullYear()} ConectaNatural. Proyecto academico de grado.
      </div>
    </footer>
  );
}
