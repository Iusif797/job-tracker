import { Application } from './index';

// Расширение интерфейса Application в глобальной области видимости
declare global {
  interface ApplicationWithFolder extends Application {
    folder?: string;
  }
}

// Пустой экспорт необходим для преобразования этого файла в модуль
export {} 