import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../services/api';
import { User } from '../types/user';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Проверка, есть ли сохраненный пользователь в localStorage
    const storedUser = localStorage.getItem('jobTrackerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Регистрация нового пользователя
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.register({ name, email, password });
      
      // Сохраняем пользователя в localStorage и состояние
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        token: response.token
      };
      
      localStorage.setItem('jobTrackerUser', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };
  
  // Вход в систему
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      // Сохраняем пользователя в localStorage и состояние
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        token: response.token
      };
      
      localStorage.setItem('jobTrackerUser', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };
  
  // Выход из системы
  const logout = () => {
    authApi.logout()
      .then(() => {
        localStorage.removeItem('jobTrackerUser');
        setUser(null);
      })
      .catch(() => {
        localStorage.removeItem('jobTrackerUser');
        setUser(null);
      });
  };
  
  // Очистка ошибок
  const clearError = () => {
    setError(null);
  };

  // Установка пользователя (используется в ProfilePage)
  const setUserData = (userData: any) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('jobTrackerUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        loading, 
        error, 
        register, 
        login, 
        logout, 
        clearError,
        setUser: setUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 