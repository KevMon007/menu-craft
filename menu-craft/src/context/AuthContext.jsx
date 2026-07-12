import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaurar sesión al cargar la app
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token, asumimos sesión activa.
      // Idealmente el backend validará este token en cada petición HTTP.
      setUser({ loggedIn: true });
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ loggedIn: true });
  };

  const logout = () => {
    // Cierre de sesión manual: elimina el token
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
