import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;  // Для обратной совместимости
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;  // Для обратной совместимости
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      setError('Authentication service is not available');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, name: string) => {
    if (!auth) {
      const error = new Error('Authentication service is not available');
      console.error('Firebase auth is not initialized');
      setError(error.message);
      throw error;
    }

    if (!email || !password || !name) {
      const error = new Error('All fields are required');
      setError(error.message);
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password should be at least 6 characters long');
      setError(error.message);
      throw error;
    }

    try {
      setError(null);
      setLoading(true);
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await updateProfile(user, { 
          displayName: name.trim(),
          photoURL: null // Устанавливаем значение по умолчанию
        });
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
        // Логируем ошибку, но продолжаем, так как основная регистрация прошла успешно
      }
      
      setCurrentUser(user);
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err instanceof Error) {
        const errorCode = (err as any).code; // Firebase ошибки имеют code
        switch(errorCode) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please try logging in.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters long.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection.');
            break;
          case 'auth/too-many-requests':
            setError('Too many attempts. Please try again later.');
            break;
          default:
            setError('An error occurred during registration. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) {
      const error = new Error('Authentication service is not available');
      console.error('Firebase auth is not initialized');
      setError(error.message);
      throw error;
    }

    if (!email || !password) {
      const error = new Error('Email and password are required');
      setError(error.message);
      throw error;
    }

    try {
      setError(null);
      setLoading(true);
      
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(user);
    } catch (err) {
      console.error('Login error:', err);
      
      if (err instanceof Error) {
        const errorCode = (err as any).code;
        switch(errorCode) {
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection.');
            break;
          case 'auth/too-many-requests':
            setError('Too many attempts. Please try again later.');
            break;
          case 'auth/invalid-api-key':
            setError('Authentication service is not properly configured. Please contact support.');
            break;
          default:
            setError('An error occurred during login. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    user: currentUser, // Для обратной совместимости
    isAuthenticated: !!currentUser,
    loading,
    error,
    register,
    login,
    logout,
    clearError,
    setUser: setCurrentUser // Для обратной совместимости
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 