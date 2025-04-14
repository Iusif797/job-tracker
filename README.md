# Job Application Tracker

Приложение для отслеживания заявок на вакансии с поддержкой различных платформ поиска работы.

## Возможности

- 📝 Отслеживание статуса заявок
- 🔍 Поддержка различных платформ (LinkedIn, HeadHunter, Glassdoor и др.)
- 📊 Статистика и аналитика
- 🌙 Темная/светлая тема
- 🌐 Мультиязычность (RU/EN)
- 📱 Адаптивный дизайн
- 💾 Локальное хранение данных
- 🔄 Синхронизация с облаком (Firebase)

## Технологии

- React
- TypeScript
- Firebase (Auth & Firestore)
- Styled Components
- Framer Motion
- i18next
- Chart.js
- IndexedDB

## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/job-application-tracker.git
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корневой директории и добавьте необходимые переменные окружения:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Запустите приложение:

```bash
npm start
```

## Деплой

Приложение настроено для деплоя на Vercel. Для деплоя:

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Деплой произойдет автоматически при пуше в main ветку

## Лицензия

MIT
