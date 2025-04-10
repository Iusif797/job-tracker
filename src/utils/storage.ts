import { Application } from '../types';
import { openDB } from 'idb';

const STORAGE_KEY = 'job-applications-data';
const SETTINGS_KEY = 'job-applications-settings';
const DB_NAME = 'job-applications-db';
const DB_VERSION = 1;
const APPS_STORE = 'applications';
const SETTINGS_STORE = 'settings';

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
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
  language: 'ru',
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

// Инициализация IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(APPS_STORE)) {
        db.createObjectStore(APPS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
      }
    }
  });
};

// Сохранение в IndexedDB с резервным копированием в localStorage
export const saveApplications = async (applications: Application[]): Promise<void> => {
  try {
    // Сохраняем в IndexedDB
    const db = await initDB();
    const tx = db.transaction(APPS_STORE, 'readwrite');
    const store = tx.objectStore(APPS_STORE);
    
    // Сначала очистим хранилище
    await store.clear();
    
    // Затем добавим все приложения
    for (const app of applications) {
      await store.add(app);
    }
    
    await tx.done;
    
    // Резервное копирование в localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    
    console.log('Данные успешно сохранены в IndexedDB и localStorage');
  } catch (error) {
    console.error('Ошибка при сохранении данных в IndexedDB:', error);
    
    // Если IndexedDB не работает, пробуем сохранить только в localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      console.log('Данные сохранены только в localStorage');
    } catch (localError) {
      console.error('Не удалось сохранить данные даже в localStorage:', localError);
    }
  }
};

// Загрузка из IndexedDB с резервным использованием localStorage
export const loadApplications = async (): Promise<Application[]> => {
  try {
    // Пробуем загрузить из IndexedDB
    const db = await initDB();
    const allApps = await db.getAll(APPS_STORE);
    
    if (allApps && allApps.length > 0) {
      console.log('Данные успешно загружены из IndexedDB');
      return allApps;
    }
    
    // Если данных в IndexedDB нет, пробуем localStorage
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const apps = JSON.parse(localData) as Application[];
      
      // Синхронизируем с IndexedDB
      await saveApplications(apps);
      
      console.log('Данные загружены из localStorage и синхронизированы с IndexedDB');
      return apps;
    }
    
    return [];
  } catch (error) {
    console.error('Ошибка при загрузке данных из IndexedDB:', error);
    
    // Если IndexedDB не работает, пробуем загрузить из localStorage
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (localError) {
      console.error('Не удалось загрузить данные даже из localStorage:', localError);
      return [];
    }
  }
};

// Аналогичные функции для настроек
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(SETTINGS_STORE, 'readwrite');
    const store = tx.objectStore(SETTINGS_STORE);
    
    await store.put({ id: 'app-settings', ...settings });
    await tx.done;
    
    // Резервное копирование в localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Ошибка при сохранении настроек в IndexedDB:', error);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (localError) {
      console.error('Не удалось сохранить настройки даже в localStorage:', localError);
    }
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const db = await initDB();
    const settings = await db.get(SETTINGS_STORE, 'app-settings');
    
    if (settings) {
      return settings;
    }
    
    // Если настроек в IndexedDB нет, пробуем localStorage
    const localData = localStorage.getItem(SETTINGS_KEY);
    if (localData) {
      const settings = { ...defaultSettings, ...JSON.parse(localData) };
      
      // Синхронизируем с IndexedDB
      await saveSettings(settings);
      
      return settings;
    }
    
    return defaultSettings;
  } catch (error) {
    console.error('Ошибка при загрузке настроек из IndexedDB:', error);
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (localError) {
      console.error('Не удалось загрузить настройки даже из localStorage:', localError);
      return defaultSettings;
    }
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    const db = await initDB();
    await db.clear(APPS_STORE);
    await db.clear(SETTINGS_STORE);
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Ошибка при очистке данных:', error);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch (localError) {
      console.error('Не удалось очистить данные даже из localStorage:', localError);
    }
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