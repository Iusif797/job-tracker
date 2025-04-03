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

const AppContent: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { theme, autoSaveInterval } = useSettings();
  
  // Загрузка данных при запуске
  useEffect(() => {
    const loadedApplications = loadApplications();
    setApplications(loadedApplications);
  }, []);
  
  // Автосохранение данных
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveApplications(applications);
    }, autoSaveInterval * 60 * 1000); // Конвертация минут в миллисекунды
    
    return () => clearInterval(saveInterval);
  }, [applications, autoSaveInterval]);
  
  // Сохранение при изменении данных
  useEffect(() => {
    if (applications.length > 0) {
      saveApplications(applications);
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
  
  const toggleTheme = () => {
    // Управление темой происходит через контекст настроек
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleCloseStats = () => {
    setShowStats(false);
  };
  
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle theme={currentTheme} />
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
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
