const API_BASE = import.meta.env.VITE_API_URL || "https://reportmed-api.onrender.com";

// Функция регистрации
export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
  return data;
}

// Функция логина
export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка входа");
  return data; // {token, user}
}

// Получить себя (авторизованного пользователя)
export async function getMe(token) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка авторизации");
  return await res.json();
}

// Загрузить файл (анализы)
export async function uploadFile(token, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка загрузки файла");
  return data; // {reportId, report}
}

// Получить отчеты (для врача)
export async function getReports(token) {
  const res = await fetch(`${API_BASE}/reports`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка получения отчетов");
  return await res.json();
}

// Получить все отчеты (для admin)
export async function getAllReports(token) {
  const res = await fetch(`${API_BASE}/admin/reports`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка получения отчетов");
  return await res.json();
}

// Получить список всех пользователей (для admin)
export async function getAllUsers(token) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка получения пользователей");
  return await res.json();
}

// Удалить отчет
export async function deleteReport(token, reportId, isAdmin = false) {
  const url = isAdmin ? `/admin/report/${reportId}` : `/report/${reportId}`;
  const res = await fetch(`${API_BASE}${url}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка удаления отчета");
  return data;
}

// Получить подробный отчет
export async function getReportById(token, reportId, isAdmin = false, page = 1, limit = 50) {
  const url = isAdmin
    ? `/admin/report/${reportId}`
    : `/report/${reportId}?page=${page}&limit=${limit}`;
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка получения отчета");
  return await res.json();
}

// Получить нормы анализов
export async function getNorms(token) {
  const res = await fetch(`${API_BASE}/norms`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Ошибка получения норм");
  return await res.json();
}

// Добавить новую норму (admin)
export async function addNorm(token, normData) {
  const res = await fetch(`${API_BASE}/admin/norms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(normData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка добавления нормы");
  return data;
}

// Обновить норму (admin)
export async function updateNorm(token, normId, normData) {
  const res = await fetch(`${API_BASE}/admin/norms/${normId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(normData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка обновления нормы");
  return data;
}

// Удалить норму (admin)
export async function deleteNorm(token, normId) {
  const res = await fetch(`${API_BASE}/admin/norms/${normId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка удаления нормы");
  return data;
}

// Создать пользователя (admin)
export async function createUser(token, userData) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка создания пользователя");
  return data;
}

// Удалить пользователя (admin)
export async function deleteUser(token, userId) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка удаления пользователя");
  return data;
}

// ===== Аналитика риска (Spring-бэкенд) =====

// Сводка по отчёту: средний риск, распределение, точки для графика
export async function getAnalyticsSummary(token, reportId) {
  const res = await fetch(`${API_BASE}/analytics/report/${reportId}/summary`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Аналитика по отчёту недоступна");
  return await res.json();
}

// Список пациентов отчёта с риск-оценкой, факторами и объяснением
export async function getAnalyticsPatients(token, reportId) {
  const res = await fetch(`${API_BASE}/analytics/report/${reportId}/patients`, {
    headers: { Authorization: "Bearer " + token }
  });
  if (!res.ok) throw new Error("Аналитика по отчёту недоступна");
  return await res.json();
}

// Перегенерировать аналитику отчёта (доступно врачу и администратору)
export async function generateAnalytics(token, reportId) {
  const res = await fetch(`${API_BASE}/analytics/report/${reportId}/generate`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Не удалось сгенерировать аналитику");
  return data;
}
