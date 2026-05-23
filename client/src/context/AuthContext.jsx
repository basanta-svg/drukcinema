import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const t = localStorage.getItem('dc_token');
    const u = localStorage.getItem('dc_user');
    if (t && u) {
      setToken(t);
      try { setUser(JSON.parse(u)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const persist = (token, user) => {
    localStorage.setItem('dc_token', token);
    localStorage.setItem('dc_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    persist(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dc_token');
    localStorage.removeItem('dc_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!token,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
