import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cn_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('cn_user');
      }
    }
    setLoading(false);
  }, []);

  const persist = (data) => {
    localStorage.setItem('cn_token', data.accessToken);
    localStorage.setItem(
      'cn_user',
      JSON.stringify({
        userId: data.userId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
      })
    );
    setUser({
      userId: data.userId,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol,
    });
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    persist(data);
    return data;
  };

  const register = async (nombre, email, password) => {
    const data = await authService.register(nombre, email, password);
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cn_token');
    localStorage.removeItem('cn_user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
