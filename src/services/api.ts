import { User, LoginCredentials, RegisterData } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Функция для выполнения запросов к API
const apiRequest = async (endpoint: string, method = 'GET', data: any = null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  // Получение токена из localStorage
  const storedUser = localStorage.getItem('jobTrackerUser');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`API запрос: ${method} ${API_URL}${endpoint}`, data);
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Сначала проверяем тип контента
    const contentType = response.headers.get('content-type');
    
    // Если ответ не в формате JSON
    if (!contentType || !contentType.includes('application/json')) {
      if (response.status === 401) {
        localStorage.removeItem('jobTrackerUser');
        window.location.href = '/login';
      }
      
      // Получаем текст ошибки
      const errorText = await response.text();
      console.error(`Получен не JSON ответ от сервера: ${errorText}`);
      throw new Error('Сервер вернул некорректный формат данных');
    }
    
    // Парсим JSON
    const responseData = await response.json();
    
    // Обработка ошибок
    if (!response.ok) {
      // Если статус 401, значит токен недействителен или истек
      if (response.status === 401) {
        localStorage.removeItem('jobTrackerUser');
        window.location.href = '/login';
      }

      throw new Error(responseData.message || 'Произошла ошибка при обращении к API');
    }

    return responseData;
  } catch (error) {
    console.error('API запрос завершился с ошибкой:', error);
    throw error;
  }
};

// API для работы с аутентификацией
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const data = await apiRequest('/users/login', 'POST', credentials);
      // Не сохраняем здесь token отдельно - он сохраняется в AuthContext вместе с данными пользователя
      return data;
    } catch (error: any) {
      console.error('Ошибка входа:', error);
      throw new Error(error.message || 'Ошибка входа');
    }
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    try {
      const result = await apiRequest('/users/register', 'POST', data);
      // Не сохраняем здесь token отдельно - он сохраняется в AuthContext вместе с данными пользователя
      return result;
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      throw new Error(error.message || 'Ошибка регистрации');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiRequest('/users/profile', 'GET');
    } catch (error: any) {
      console.error('Ошибка получения данных пользователя:', error);
      throw new Error(error.message || 'Не удалось получить данные пользователя');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest('/users/logout', 'POST');
      localStorage.removeItem('jobTrackerUser');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      localStorage.removeItem('jobTrackerUser');
    }
  },
};

// API для работы с пользователями
export const userApi = {
  // Обновление профиля пользователя
  updateProfile: async (data: { name?: string; password?: string }): Promise<User> => {
    try {
      return await apiRequest('/users/profile', 'PUT', data);
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось обновить профиль');
    }
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    try {
      await apiRequest('/users/password', 'PUT', data);
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось изменить пароль');
    }
  },
};

// API для работы с заявками
export const applicationApi = {
  // Получение всех заявок пользователя
  getAll: async () => {
    try {
      return await apiRequest('/applications');
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось получить список заявок');
    }
  },

  // Получение заявки по ID
  getById: async (id: string) => {
    try {
      return await apiRequest(`/applications/${id}`);
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось получить заявку');
    }
  },

  // Создание новой заявки
  create: async (application: any) => {
    try {
      return await apiRequest('/applications', 'POST', application);
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось создать заявку');
    }
  },

  // Обновление заявки
  update: async (id: string, data: any) => {
    try {
      console.log(`Запрос на обновление заявки с ID: ${id}`, data);
      
      // Убедимся, что поле folder присутствует
      if (!data.folder && data.folder !== undefined) {
        data.folder = 'responses';
      }
      
      const updatedApplication = await apiRequest(`/applications/${id}`, 'PUT', data);
      console.log('Заявка успешно обновлена:', updatedApplication);
      return updatedApplication;
    } catch (error: any) {
      console.error('Ошибка при обновлении заявки:', error);
      throw new Error(error.message || 'Не удалось обновить заявку');
    }
  },

  // Удаление заявки
  delete: async (id: string) => {
    try {
      await apiRequest(`/applications/${id}`, 'DELETE');
    } catch (error: any) {
      throw new Error(error.message || 'Не удалось удалить заявку');
    }
  }
}; 