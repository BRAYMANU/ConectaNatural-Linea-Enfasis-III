import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpenCheck,
  HeartPulse,
  ShieldCheck,
  Leaf,
  Sprout,
  Brain,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar.jsx';
import Footer from '../components/Footer.jsx';

const beneficios = [
  {
    icon: BookOpenCheck,
    titulo: 'Informacion confiable',
    texto:
      'Cada contenido esta respaldado por estudios cientificos y fuentes academicas verificadas.',
  },
  {
    icon: HeartPulse,
    titulo: 'Bienestar integral',
    texto:
      'Enfoque en nutricion, terapias complementarias y salud mental como un todo conectado.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Uso responsable',
    texto:
      'Advertencias claras y contraindicaciones para que tomes decisiones seguras sobre tu salud.',
  },
];

const categorias = [
  { icon: Leaf, titulo: 'Productos Naturales', texto: 'Hierbas, suplementos y remedios con evidencia.' },
  { icon: Sprout, titulo: 'Nutricion y Bienestar', texto: 'Alimentacion, vitaminas y habitos saludables.' },
  { icon: Brain, titulo: 'Terapias', texto: 'Meditacion, yoga, acupuntura, fitoterapia y mas.' },
  { icon: AlertTriangle, titulo: 'Precauciones', texto: 'Contraindicaciones e interacciones que debes conocer.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar />

      {/* HERO */}
      <section
        id="hero"
        className="pt-32 pb-20 bg-gradient-to-br from-botanic-50 via-white to-botanic-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block bg-botanic-100 text-botanic-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Medicina complementaria con respaldo cientifico
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-botanic-900 leading-tight mb-6">
              Explora la medicina natural con <span className="text-botanic-600">respaldo cientifico</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Accede a contenido curado y validado por estudios academicos sobre productos naturales,
              nutricion, terapias y bienestar integral. Decisiones informadas, salud responsable.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#categorias" className="btn-primary">
                Explorar contenido <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <Link to="/register" className="btn-outline">
                Registrarse
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-botanic-200 via-botanic-100 to-white flex items-center justify-center shadow-xl">
              <Leaf className="w-48 h-48 text-botanic-600" strokeWidth={1.2} />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-slate-100 hidden sm:block">
              <div className="text-xs text-slate-500">Fuentes revisadas</div>
              <div className="text-2xl font-bold text-botanic-700">+50 estudios</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-botanic-900 mb-3">
              Por que ConectaNatural
            </h2>
            <p className="text-slate-600">
              Una plataforma pensada para que accedas a informacion de salud de forma clara, segura
              y respaldada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="card-surface text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-botanic-100 flex items-center justify-center">
                  <b.icon className="w-7 h-7 text-botanic-700" />
                </div>
                <h3 className="text-xl font-semibold text-botanic-900 mb-2">{b.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="py-20 bg-gradient-to-b from-white to-botanic-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-botanic-900 mb-3">
              Que encontraras
            </h2>
            <p className="text-slate-600">
              Cuatro grandes areas de conocimiento con fuentes verificadas y advertencias claras.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categorias.map((c, i) => (
              <motion.div
                key={c.titulo}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="card-surface hover:shadow-md transition"
              >
                <c.icon className="w-10 h-10 text-botanic-600 mb-4" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-botanic-900 mb-2">{c.titulo}</h3>
                <p className="text-slate-600 text-sm">{c.texto}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/register" className="btn-primary">
              Crea tu cuenta para explorar
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="card-surface"
          >
            <h2 className="text-3xl font-bold text-botanic-900 mb-4">Sobre nosotros</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              En <strong className="text-botanic-700">ConectaNatural</strong>, creemos que el acceso
              a informacion clara y respaldada es fundamental para que las personas puedan tomar
              decisiones responsables sobre su bienestar. Nacemos como un proyecto academico que
              busca mitigar la desinformacion que circula en internet sobre medicina alternativa,
              nutricion y terapias complementarias.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Reunimos, organizamos y presentamos contenidos revisados a partir de articulos
              cientificos, revistas academicas y fuentes institucionales reconocidas. Nuestro enfoque
              combina rigor cientifico con un lenguaje accesible, de forma que cualquier usuario
              pueda consultar productos naturales, terapias, recomendaciones nutricionales y
              advertencias importantes sobre contraindicaciones.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Este proyecto se desarrolla en el marco del semillero de investigacion en ingenieria
              de sistemas, aplicando una arquitectura de servicios REST con Spring Boot y una
              interfaz moderna en React. Nuestro objetivo final es promover un uso responsable del
              conocimiento sanitario digital.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
