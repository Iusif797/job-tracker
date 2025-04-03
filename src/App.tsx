import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './theme/theme';
import GlobalStyle from './theme/globalStyle';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import ApplicationForm from './components/ApplicationForm/ApplicationForm';
import JobStats from './components/JobStats/JobStats';
import Settings from './components/Settings/Settings';
import { Application } from './types';
import { v4 as uuidv4 } from 'uuid';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { saveApplications, loadApplications } from './utils/storage';
import styled from 'styled-components';

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

const AppContent: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, autoSaveInterval, toggleTheme } = useSettings();
  
  // Загрузка данных при запуске
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedApplications = await loadApplications();
        setApplications(loadedApplications);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Автосохранение данных
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (applications.length > 0) {
        saveApplications(applications)
          .catch(error => console.error('Ошибка при автосохранении:', error));
      }
    }, autoSaveInterval * 60 * 1000); // Конвертация минут в миллисекунды
    
    return () => clearInterval(saveInterval);
  }, [applications, autoSaveInterval]);
  
  // Сохранение при изменении данных
  useEffect(() => {
    if (applications.length > 0) {
      saveApplications(applications)
        .catch(error => console.error('Ошибка при сохранении данных:', error));
    }
  }, [applications]);
  
  const handleAddApplication = (application: Omit<Application, 'id'>) => {
    const newApplication: Application = {
      ...application,
      id: uuidv4()
    };
    
    setApplications([...applications, newApplication]);
    setShowForm(false);
  };
  
  const handleUpdateApplication = (updatedApplication: Application) => {
    setApplications(applications.map(app => 
      app.id === updatedApplication.id ? updatedApplication : app
    ));
  };
  
  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleCloseStats = () => {
    setShowStats(false);
  };
  
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  if (isLoading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <GlobalStyle theme={currentTheme} />
        <LoadingScreen>
          <h2>Загрузка данных...</h2>
        </LoadingScreen>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle theme={currentTheme} />
      <AppWrapper>
        <Header 
          onAddClick={() => setShowForm(true)}
          onStatsClick={() => {
            setShowStats(true);
            setShowSettings(false);
          }}
          onThemeToggle={toggleTheme}
          isDarkMode={theme === 'dark'}
        />
        
        {showForm && (
          <ApplicationForm 
            onSubmit={handleAddApplication}
            onCancel={() => setShowForm(false)}
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
          />
        )}
        
        <Footer>
          Разработано Iusif Mamedov &copy; {new Date().getFullYear()}
        </Footer>
      </AppWrapper>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
