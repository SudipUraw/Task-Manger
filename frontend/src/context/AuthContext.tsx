import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('task_manager_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('task_manager_token');
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Check auth status on load
  useEffect(() => {
    const fetchProfile = async () => {
      const savedToken = localStorage.getItem('task_manager_token');
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/profile');
        setUser({
          _id: data._id,
          name: data.name,
          email: data.email,
        });
        localStorage.setItem('task_manager_user', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('task_manager_token');
        localStorage.removeItem('task_manager_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };
    
    setToken(data.token);
    setUser(userData);
    localStorage.setItem('task_manager_token', data.token);
    localStorage.setItem('task_manager_user', JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    const userData = { _id: data._id, name: data.name, email: data.email };

    setToken(data.token);
    setUser(userData);
    localStorage.setItem('task_manager_token', data.token);
    localStorage.setItem('task_manager_user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
