import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Lock, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesion';
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

        <h1 className="text-2xl font-bold text-botanic-900 mb-1">Iniciar sesion</h1>
        <p className="text-sm text-slate-500 mb-6">
          Accede para explorar todo el contenido verificado.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 focus:border-botanic-500 focus:ring-2 focus:ring-botanic-500/20 outline-none"
                placeholder="Tu contrasena"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Ingresando...' : (
              <>
                <LogIn className="w-4 h-4 mr-2" /> Ingresar
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-slate-600 text-center mt-6">
          No tienes cuenta?{' '}
          <Link to="/register" className="text-botanic-700 font-semibold hover:underline">
            Registrate
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
