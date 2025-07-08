import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, getReports, getAllReports, getAllUsers, deleteReport } from "../api";

function ReportsPage({ token }) {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [usersMap, setUsersMap] = useState({}); // Для сопоставления id пользователя к имени
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получаем текущего пользователя
  useEffect(() => {
    setLoading(true);
    getMe(token)
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  // Получаем отчёты (и пользователей для админа)
  useEffect(() => {
    if (!user) return;

    const fetchReports = user.role === "admin" ? getAllReports(token) : getReports(token);

    if (user.role === "admin") {
      // Если админ, получаем также список пользователей
      Promise.all([fetchReports, getAllUsers(token)])
        .then(([reportsData, usersData]) => {
          setReports(reportsData);

          // Создаём словарь userId -> "Имя Фамилия"
          const map = {};
          usersData.forEach(u => {
            map[u.id] = `${u.first_name} ${u.last_name}`;
          });
          setUsersMap(map);
        })
        .catch(err => setError(err.message));
    } else {
      fetchReports.then(setReports).catch(err => setError(err.message));
    }
  }, [token, user]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>{user?.role === "admin" ? "Все отчёты" : "Мои отчёты"}</h2>
      {user?.role === "admin" && (
        <div style={{ marginBottom: 12 }}>
          <Link to="/admin/users" style={{ marginRight: 20 }}>
            Управление пользователями
          </Link>
          <Link to="/norms">Редактировать нормы</Link>
        </div>
      )}
      <ul>
        {reports.length === 0 && <li>Отчётов пока нет</li>}
        {reports.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
              <Link
                to={user?.role === "admin" ? `/admin/report/${r.id}` : `/report/${r.id}`}
                style={{ marginRight: 24 }}
              >
                {r.file_name}
              </Link>
            {user?.role === "admin" && (
              <span style={{ marginRight: 24, fontStyle: "italic" }}>
                Пользователь: {usersMap[r.user_id] || "Неизвестен"}
              </span>
            )}
            <span style={{ marginRight: 24 }}>
              {new Date(r.created_at).toLocaleString()}
            </span>
            {(user?.role === "admin" || user?.role === "doctor") && (
              <DeleteReportButton
                reportId={r.id}
                token={token}
                isAdmin={user?.role === "admin"}
                onDelete={() => setReports(reports.filter(rep => rep.id !== r.id))}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeleteReportButton({ reportId, token, isAdmin, onDelete }) {
  const handleDelete = async () => {
    if (window.confirm("Удалить отчёт?")) {
      try {
        await deleteReport(token, reportId, isAdmin);
        onDelete();
      } catch (error) {
        alert("Ошибка удаления отчёта");
      }
    }
  };
  return (
    <button onClick={handleDelete} style={{ color: "red" }}>
      Удалить
    </button>
  );
}

export default ReportsPage;
