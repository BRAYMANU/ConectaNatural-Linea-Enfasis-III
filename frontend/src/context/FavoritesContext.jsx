import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

const storageKey = (userId) => `cn_favorites_${userId || 'anon'}`;

/**
 * Wishlist global del usuario logueado.
 * Persistencia: localStorage por usuario.
 * Estructura de un favorito:
 *   { type: 'producto' | 'subcategoria', id: number, nombre: string, descripcion?: string, imagenUrl?: string, addedAt: ISOString }
 */
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Cargar al montar / cambiar de usuario
  useEffect(() => {
    if (!user?.userId) {
      setFavorites([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(user.userId));
      setFavorites(raw ? JSON.parse(raw) : []);
    } catch {
      setFavorites([]);
    }
  }, [user?.userId]);

  // Persistir cuando cambien
  useEffect(() => {
    if (!user?.userId) return;
    localStorage.setItem(storageKey(user.userId), JSON.stringify(favorites));
  }, [favorites, user?.userId]);

  const isFavorite = useCallback(
    (type, id) => favorites.some((f) => f.type === type && f.id === id),
    [favorites]
  );

  const toggle = useCallback((item) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === item.type && f.id === item.id);
      if (exists) {
        return prev.filter((f) => !(f.type === item.type && f.id === item.id));
      }
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const remove = useCallback((type, id) => {
    setFavorites((prev) => prev.filter((f) => !(f.type === type && f.id === id)));
  }, []);

  const clear = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggle, remove, clear, count: favorites.length }),
    [favorites, isFavorite, toggle, remove, clear]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return ctx;
}
