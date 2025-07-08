// Скрипт для тестирования API-соединения
const API_URL = process.env.REACT_APP_API_URL || 'https://medicalprojects-production.up.railway.app';

async function testAPI() {
  console.log('Тестирование API:', API_URL);
  
  try {
    // Тест 1: Проверка доступности
    const response = await fetch(`${API_URL}/api-docs`);
    console.log('✅ API доступен, статус:', response.status);
    
    // Тест 2: Проверка CORS
    const corsResponse = await fetch(`${API_URL}/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://medicalreactfrontend-production.up.railway.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS настроен, статус:', corsResponse.status);
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error.message);
  }
}

testAPI(); 