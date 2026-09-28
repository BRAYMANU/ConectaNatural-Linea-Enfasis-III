import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Lock, Mail, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.nombre, form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.details?.join(', ')) ||
        'Error al registrarse';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-botanic-50 to-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
      >
        <Link to="/" className="flex items-center gap-2 mb-6 text-botanic-800 font-bold text-lg">
          <Leaf className="w-6 h-6 text-botanic-600" />
          <span>ConectaNatural</span>
        </Link>

        <h1 className="text-2xl font-bold text-botanic-900 mb-1">Crear cuenta</h1>
        <p className="text-sm text-slate-500 mb-6">
          Registrate para acceder al contenido verificado.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="nombre"
                type="text"
                required
                minLength={2}
                value={form.nombre}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-botanic-500 focus:ring-2 focus:ring-botanic-500/20 outline-none"
                placeholder="Tu nombre"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-botanic-500 focus:ring-2 focus:ring-botanic-500/20 outline-none"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contrasena</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-botanic-500 focus:ring-2 focus:ring-botanic-500/20 outline-none"
                placeholder="Minimo 6 caracteres"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creando cuenta...' : (
              <>
                <UserPlus className="w-4 h-4 mr-2" /> Registrarse
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-slate-600 text-center mt-6">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="text-botanic-700 font-semibold hover:underline">
            Inicia sesion
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
