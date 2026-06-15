import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, getReports, getAllReports, getAllUsers, deleteReport } from "../api";
import ReportCard from "../components/ReportCard";

function ReportsPage({ token }) {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (!user) return;

    const fetchReports = user.role === "admin" ? getAllReports(token) : getReports(token);

    if (user.role === "admin") {
      Promise.all([fetchReports, getAllUsers(token)])
        .then(([reportsData, usersData]) => {
          setReports(reportsData);
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

  if (loading) {
    return <div className="page"><div className="text-muted">Загрузка…</div></div>;
  }
  if (error) {
    return <div className="page"><div className="alert alert-error">{error}</div></div>;
  }

  const isAdmin = user?.role === "admin";
  const canDelete = isAdmin || user?.role === "doctor";

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить отчёт?")) return;
    try {
      await deleteReport(token, id, isAdmin);
      setReports(reports.filter(rep => rep.id !== id));
    } catch (e) {
      alert("Ошибка удаления отчёта");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isAdmin ? "Все отчёты" : "Мои отчёты"}</h1>
        {isAdmin && (
          <div className="quick-actions">
            <Link to="/admin/users" className="btn btn-ghost">Пользователи</Link>
            <Link to="/norms" className="btn btn-ghost">Нормы</Link>
          </div>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="card empty">Отчётов пока нет</div>
      ) : (
        <div className="report-list">
          {reports.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              linkTo={isAdmin ? `/admin/report/${r.id}` : `/report/${r.id}`}
              uploaderName={isAdmin ? (usersMap[r.user_id] || "Неизвестен") : null}
              canDelete={canDelete}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
