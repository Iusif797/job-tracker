import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './Auth/AuthPage';
import Dashboard from './Dashboard/Dashboard';
import { Application } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { applicationApi } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import Settings from './Settings/Settings';

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{element}</> : <Navigate to="/auth" />;
};

const AppContent: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme } = useSettings();

  useEffect(() => {
    const loadApplications = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const data = await applicationApi.getAll();
        setApplications(data);
      } catch (err) {
        console.error('Error loading applications:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [currentUser]);

  const handleAddApplication = async (applicationData: Omit<Application, 'id'> | Application) => {
    try {
      const newApp = 'id' in applicationData ? applicationData : {
        ...applicationData,
        id: uuidv4(),
        folder: 'responses'
      } as Application;

      if (currentUser) {
        const createdApp = await applicationApi.create(newApp);
        setApplications(prev => [...prev, createdApp]);
      } else {
        setApplications(prev => [...prev, newApp]);
      }
    } catch (err) {
      console.error('Error adding application:', err);
      setError('Не удалось добавить заявку. Пожалуйста, попробуйте позже.');
    }
  };

  const handleUpdateApplication = async (updatedData: Application) => {
    try {
      if (currentUser) {
        await applicationApi.update(updatedData.id, updatedData);
      }
      setApplications(prev => prev.map(app => app.id === updatedData.id ? updatedData : app));
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Не удалось обновить заявку. Пожалуйста, попробуйте позже.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      if (currentUser) {
        await applicationApi.delete(id);
      }
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Не удалось удалить заявку. Пожалуйста, попробуйте позже.');
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  const DashboardWithProps = () => (
    <Dashboard
      applications={applications}
      onUpdate={handleUpdateApplication}
      onDelete={handleDeleteApplication}
      onSettings={handleSettings}
      onAddApplication={handleAddApplication}
      onEditApplication={(id) => {
        const app = applications.find(a => a.id === id);
        if (app) {
          handleUpdateApplication(app);
        }
      }}
    />
  );

  const SettingsWithProps = () => (
    <Settings onBack={() => navigate('/')} />
  );

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute element={<DashboardWithProps />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<SettingsWithProps />} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppContent; 