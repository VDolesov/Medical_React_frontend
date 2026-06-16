# Medical Frontend

React-приложение для медицинской системы анализа.

## Настройка переменных окружения

### Для Production (Railway)

В Railway Dashboard добавьте переменную окружения:

```
VITE_API_URL=https://medicalprojects-production.up.railway.app
```

### Для локальной разработки

Создайте файл `.env` в корне проекта:

```
VITE_API_URL=http://localhost:8080
```

## Запуск (разработка)

```bash
npm install
npm run dev
```

Сборка на Vite. `npm start` отдаёт уже собранную версию из папки `build` (`serve -s build`).

## Сборка для production

```bash
npm run build
```

## Проблемы с авторизацией

Если возникают проблемы с авторизацией:

1. Убедитесь, что переменная `VITE_API_URL` настроена правильно
2. Проверьте, что backend доступен по указанному URL
3. Убедитесь, что CORS настроен правильно в backend

## Структура проекта

- `src/api.js` - API-функции для работы с backend
- `src/pages/` - страницы приложения
- `src/components/` - переиспользуемые компоненты
