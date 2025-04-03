import { Application } from '../types';

const STORAGE_KEY = 'job-applications-data';
const SETTINGS_KEY = 'job-applications-settings';

interface AppSettings {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'kanban';
  notificationsEnabled: boolean;
  autoSaveInterval: number; // в минутах
  statisticsVisibility: {
    platforms: boolean;
    timeline: boolean;
    statuses: boolean;
    salary: boolean;
  };
}

export const defaultSettings: AppSettings = {
  theme: 'light',
  defaultView: 'list',
  notificationsEnabled: true,
  autoSaveInterval: 5,
  statisticsVisibility: {
    platforms: true,
    timeline: true,
    statuses: true,
    salary: true,
  },
};

export const saveApplications = (applications: Application[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    console.log('Данные успешно сохранены в localStorage');
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  }
};

export const loadApplications = (): Application[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return [];
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Ошибка при сохранении настроек:', error);
  }
};

export const loadSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error('Ошибка при загрузке настроек:', error);
    return defaultSettings;
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Ошибка при очистке данных:', error);
  }
};

export const exportData = (): string => {
  const applications = loadApplications();
  const settings = loadSettings();
  
  return JSON.stringify({
    applications,
    settings,
    exportDate: new Date().toISOString(),
  });
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.applications && Array.isArray(data.applications)) {
      saveApplications(data.applications);
    }
    
    if (data.settings) {
      saveSettings({ ...defaultSettings, ...data.settings });
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при импорте данных:', error);
    return false;
  }
}; 