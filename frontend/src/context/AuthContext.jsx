import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // We'll need to create a check-auth route in Express
        // Wait, authController currently has no checkAuth route exported in app
        // Or we can just try to fetch profile
        const { data } = await api.get('/profile');
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const loginAuth = async (credentials) => {
    const { data } = await api.post('/login', credentials);
    setUser(data.user);
  };

  const signupAuth = async (userData) => {
    await api.post('/signup', userData);
  };

  const logoutAuth = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login: loginAuth, signup: signupAuth, logout: logoutAuth, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
