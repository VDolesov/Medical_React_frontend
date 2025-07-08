# Инструкция по развертыванию на Railway

## Что было исправлено

✅ **Проблема с API-запросами**: Все прямые fetch-запросы заменены на централизованные API-функции
✅ **Настройка CORS**: Backend настроен для работы с frontend-доменом
✅ **Переменные окружения**: Добавлена поддержка REACT_APP_API_URL
✅ **Обновлены все страницы**: LoginPage, RegisterPage, ReportsPage, NormsPage, AdminPages и др.

## Backend

1. Подключите репозиторий к Railway
2. Убедитесь, что все переменные окружения настроены
3. Backend будет доступен по адресу: `https://medicalprojects-production.up.railway.app`

## Frontend

1. Подключите репозиторий к Railway
2. **ВАЖНО**: Добавьте переменную окружения в Railway Dashboard:

```
REACT_APP_API_URL=https://medicalprojects-production.up.railway.app
```

3. Frontend будет доступен по адресу: `https://medicalreactfrontend-production.up.railway.app`

## Проверка работы

1. Откройте frontend в браузере
2. Попробуйте войти с существующими учетными данными
3. Проверьте, что запросы идут на правильный backend-домен

## Отладка

Если авторизация не работает:

1. Откройте Developer Tools (F12)
2. Перейдите на вкладку Network
3. Попробуйте войти и проверьте:
   - URL запроса (должен быть на backend-домен)
   - Статус ответа (должен быть 200)
   - CORS-ошибки в консоли

## Локальная разработка

Для локальной разработки создайте файл `.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

## Тестирование API

Запустите тест API-соединения:

```bash
npm run test-api
```

## Структура изменений

- `src/api.js` - все API-функции централизованы
- `src/pages/*.js` - все страницы используют API-функции
- `package.json` - удален неправильный proxy
- `env.example` - пример переменных окружения 