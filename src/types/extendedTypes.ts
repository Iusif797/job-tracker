import { Application, Folder } from './index';

// Расширяю тип Application с определённым полем folder
export interface ApplicationWithFolder extends Application {
  folder: string;
}

// Дополнительный экспорт для переиспользования
export type { Application, Folder };

// Функция для конвертации
export function hasFolder(app: Application): app is ApplicationWithFolder {
  return app.folder !== undefined;
}

// Хелпер для добавления папки к приложению
export function addFolder(app: Application, folderId: string): ApplicationWithFolder {
  return {
    ...app,
    folder: folderId
  };
}

// Хелпер для удаления папки из приложения
export function removeFolder(app: Application): Application {
  // Создаем новый объект без поля folder
  const { folder, ...rest } = app as ApplicationWithFolder;
  return rest;
} 