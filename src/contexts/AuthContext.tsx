import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, login, logout, register, getCurrentUser } from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setLoading(true);
      const response = await login(email, password);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      setLoading(true);
      const response = await register(name, email, password);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 