# Changelog - Исправление проблемы с авторизацией

## Версия 1.1.0 - Исправление API-запросов

### Исправленные проблемы
- ❌ Запросы шли на frontend-домен вместо backend
- ❌ Неправильная настройка CORS
- ❌ Отсутствие переменных окружения для API URL
- ❌ Прямые fetch-запросы вместо централизованных API-функций

### Изменения в файлах

#### Backend (`medical-backend/index.js`)
- ✅ Добавлена правильная настройка CORS для production доменов
- ✅ Разрешены запросы с `https://medicalreactfrontend-production.up.railway.app`

#### Frontend API (`medical-frontend/src/api.js`)
- ✅ Добавлена поддержка переменной окружения `REACT_APP_API_URL`
- ✅ Добавлены недостающие API-функции:
  - `addNorm()`, `updateNorm()`, `deleteNorm()` - для управления нормами
  - `createUser()`, `deleteUser()` - для управления пользователями

#### Страницы (`medical-frontend/src/pages/`)
- ✅ `LoginPage.js` - использует `loginUser()` и `getMe()`
- ✅ `RegisterPage.js` - использует `registerUser()`
- ✅ `ReportsPage.js` - использует `getMe()`, `getReports()`, `getAllReports()`, `getAllUsers()`, `deleteReport()`
- ✅ `ReportViewPage.js` - использует `getReportById()`
- ✅ `NormsPage.js` - использует `getNorms()`, `addNorm()`, `updateNorm()`, `deleteNorm()`
- ✅ `AdminReportViewPage.js` - использует `getReportById()`
- ✅ `AdminReportsPage.js` - использует `getAllReports()`, `deleteReport()`
- ✅ `AdminUsersPage.js` - использует `getAllUsers()`, `createUser()`, `deleteUser()`

#### Конфигурация
- ✅ `package.json` - удален неправильный proxy
- ✅ `env.example` - добавлен пример переменных окружения
- ✅ `test-api.js` - создан скрипт для тестирования API
- ✅ `DEPLOY.md` - обновлена инструкция по развертыванию

### Новые возможности
- 🔧 Централизованное управление API-запросами
- 🔧 Поддержка переменных окружения для разных сред
- 🔧 Улучшенная обработка ошибок
- 🔧 Тестирование API-соединения

### Инструкции по развертыванию
1. Добавить переменную окружения в Railway: `REACT_APP_API_URL=https://medicalprojects-production.up.railway.app`
2. Перезапустить frontend после добавления переменной
3. Проверить работу авторизации

### Локальная разработка
Создать файл `.env`:
```
REACT_APP_API_URL=http://localhost:5000
``` 