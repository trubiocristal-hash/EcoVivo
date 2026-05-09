import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USER = {
  email: 'maria@ecovivo.mx',
  password: 'eco2026',
  name: 'María González',
  role: 'Voluntaria Verificada',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  stadium: 'Estadio Akron',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1200));
    if (
      email.trim().toLowerCase() === MOCK_USER.email &&
      password === MOCK_USER.password
    ) {
      setUser({ ...MOCK_USER, password: undefined });
      setLoading(false);
      return true;
    } else {
      setError('Correo o contraseña incorrectos. Intenta con maria@ecovivo.mx / eco2026');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
