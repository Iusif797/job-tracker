import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultSettings, loadSettings, saveSettings } from '../utils/storage';

interface SettingsContextType {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'kanban';
  notificationsEnabled: boolean;
  autoSaveInterval: number;
  statisticsVisibility: {
    platforms: boolean;
    timeline: boolean;
    statuses: boolean;
    salary: boolean;
  };
  toggleTheme: () => void;
  setDefaultView: (view: 'list' | 'kanban') => void;
  toggleNotifications: () => void;
  setAutoSaveInterval: (minutes: number) => void;
  toggleStatVisibility: (stat: keyof typeof defaultSettings.statisticsVisibility) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings должен использоваться внутри SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загрузка настроек при монтировании
  useEffect(() => {
    const initSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initSettings();
  }, []);

  // Сохранение настроек при изменении
  useEffect(() => {
    if (isInitialized) {
      saveSettings(settings).catch(error => {
        console.error('Ошибка при сохранении настроек:', error);
      });
    }
  }, [settings, isInitialized]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const setDefaultView = (view: 'list' | 'kanban') => {
    setSettings(prev => ({
      ...prev,
      defaultView: view
    }));
  };

  const toggleNotifications = () => {
    setSettings(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };

  const setAutoSaveInterval = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      autoSaveInterval: minutes
    }));
  };

  const toggleStatVisibility = (stat: keyof typeof defaultSettings.statisticsVisibility) => {
    setSettings(prev => ({
      ...prev,
      statisticsVisibility: {
        ...prev.statisticsVisibility,
        [stat]: !prev.statisticsVisibility[stat]
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Отображаем ничего до завершения инициализации контекста
  if (!isInitialized) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        toggleTheme,
        setDefaultView,
        toggleNotifications,
        setAutoSaveInterval,
        toggleStatVisibility,
        resetSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 