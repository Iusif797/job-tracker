import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import GlobalStyle from './theme/globalStyle';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import ApplicationForm from './components/ApplicationForm/ApplicationForm';
import JobStats from './components/JobStats/JobStats';
import Settings from './components/Settings/Settings';
import AuthPage from './components/Auth/AuthPage';
import { Application } from './types';
import { v4 as uuidv4 } from 'uuid';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { saveApplications, loadApplications } from './utils/storage';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { applicationApi } from './services/api';

const Footer = styled.footer`
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
`;

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, autoSaveInterval, toggleTheme } = useSettings();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  
  // Загрузка данных при запуске
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (isAuthenticated && user) {
          // Если пользователь авторизован, загружаем данные с сервера
          try {
            const serverApplications = await applicationApi.getAll();
            setApplications(serverApplications);
          } catch (error) {
            console.error('Ошибка при загрузке данных с сервера:', error);
            
            // Если не удалось загрузить с сервера, пробуем локальное хранилище
            const localApplications = await loadApplications();
            setApplications(localApplications);
          }
        } else {
          // Если пользователь не авторизован, используем локальное хранилище
          const localApplications = await loadApplications();
          setApplications(localApplications);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, user]);
  
  // Автосохранение данных
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (applications.length > 0) {
        if (isAuthenticated && user) {
          // Если пользователь авторизован, данные будут сохраняться при каждом изменении
          // через соответствующие функции (см. ниже)
        } else {
          // Если пользователь не авторизован, сохраняем в локальное хранилище
          saveApplications(applications)
            .catch(error => console.error('Ошибка при автосохранении:', error));
        }
      }
    }, autoSaveInterval * 60 * 1000); // Конвертация минут в миллисекунды
    
    return () => clearInterval(saveInterval);
  }, [applications, autoSaveInterval, isAuthenticated, user]);
  
  // Сохранение при изменении данных
  useEffect(() => {
    const saveData = async () => {
      if (applications.length > 0) {
        if (isAuthenticated && user) {
          // Данные уже сохраняются в серверных функциях
        } else {
          // Если пользователь не авторизован, сохраняем в локальное хранилище
          await saveApplications(applications)
            .catch(error => console.error('Ошибка при сохранении данных:', error));
        }
      }
    };
    
    saveData();
  }, [applications, isAuthenticated, user]);
  
  const handleAddApplication = async (applicationData: Omit<Application, 'id'> | Application) => {
    try {
      setIsLoading(true);

      // Создаем новую заявку с необходимыми полями
      let newApp: Application;
      
      if ('id' in applicationData) {
        // Если id уже есть в данных
        newApp = { ...applicationData };
      } else {
        // Если id нужно создать
        newApp = { 
          ...applicationData, 
          id: uuidv4() 
        } as Application;
      }
      
      // Убедимся, что папка "Отклики" установлена
      if (!newApp.folder) {
        newApp.folder = 'responses';
      }

      // Добавляем в локальное состояние
      setApplications(prev => [...prev, newApp]);

      // Отправляем на сервер
      if (isAuthenticated && user) {
        await applicationApi.create(newApp);
      }
      
      console.log('Отклик успешно добавлен:', newApp);
    } catch (error) {
      console.error('Ошибка при добавлении заявки:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateApplication = async (updatedData: Application | Omit<Application, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Проверяем, содержит ли объект поле id (это полный тип Application)
      if ('id' in updatedData) {
        const updatedApplication = updatedData as Application;
        
        // Убедимся, что у заявки есть поле folder
        if (updatedApplication.folder === undefined) {
          updatedApplication.folder = 'responses';
        }
        
        console.log('Обновляем заявку:', updatedApplication);
        
        if (isAuthenticated && user) {
          // Если пользователь авторизован, обновляем на сервере
          const savedApplication = await applicationApi.update(
            updatedApplication.id, 
            updatedApplication
          );
          
          console.log('Заявка обновлена на сервере:', savedApplication);
          
          // Обновляем локальное состояние после получения ответа от сервера
          setApplications(prevApps => 
            prevApps.map(app => app.id === savedApplication.id ? savedApplication : app)
          );
        } else {
          // Если пользователь не авторизован, обновляем локально
          console.log('Обновление заявки локально (пользователь не авторизован)');
          
          setApplications(prevApps => 
            prevApps.map(app => app.id === updatedApplication.id ? updatedApplication : app)
          );
        }
      } else {
        // Если id отсутствует, это новая заявка - используем handleAddApplication
        console.log('ID не найден, создаем новую заявку');
        await handleAddApplication(updatedData);
      }
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteApplication = async (id: string) => {
    try {
      if (isAuthenticated && user) {
        // Если пользователь авторизован, удаляем на сервере
        await applicationApi.delete(id);
      }
      
      // В любом случае удаляем из локального состояния
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
    }
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleCloseStats = () => {
    setShowStats(false);
  };
  
  // Обработка нажатия кнопки редактирования
  const handleEditApplication = (id: string) => {
    const applicationToEdit = applications.find(app => app.id === id);
    if (applicationToEdit) {
      setCurrentApplication(applicationToEdit);
      setShowForm(true);
    }
  };
  
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  if (isLoading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <GlobalStyle theme={currentTheme} />
        <LoadingScreen>
          <h2>{t('common.loading')}</h2>
        </LoadingScreen>
      </ThemeProvider>
    );
  }
  
  // Основной контент приложения
  const MainContent = () => (
    <AppWrapper>
      <Header 
        onAddClick={() => {
          setCurrentApplication(null); // Сбрасываем текущую заявку при добавлении новой
          setShowForm(true);
        }}
        onStatsClick={() => {
          setShowStats(true);
          setShowSettings(false);
        }}
        onThemeToggle={toggleTheme}
        isDarkMode={theme === 'dark'}
      />
      
      {showForm && (
        <ApplicationForm 
          initialData={currentApplication || undefined}
          onSubmit={currentApplication ? handleUpdateApplication : handleAddApplication}
          onCancel={() => {
            setShowForm(false);
            setCurrentApplication(null);
          }}
        />
      )}
      
      {showStats && (
        <JobStats 
          applications={applications}
          onClose={handleCloseStats}
        />
      )}
      
      {showSettings && (
        <Settings onBack={handleBackFromSettings} />
      )}
      
      {!showStats && !showSettings && (
        <Dashboard 
          applications={applications}
          onUpdate={handleUpdateApplication}
          onDelete={handleDeleteApplication}
          onSettings={() => {
            setShowSettings(true);
            setShowStats(false);
          }}
          onAddApplication={handleAddApplication}
          onEditApplication={handleEditApplication}
        />
      )}
      
      <Footer>
        {t('footer.developedBy')} Iusif Mamedov &copy; {new Date().getFullYear()}
      </Footer>
    </AppWrapper>
  );
  
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle theme={currentTheme} />
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute element={<MainContent />} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  </AuthProvider>
);

export default App;
