import React, { useEffect, useState } from "react";
import { getAllReports, deleteReport } from "../api";
import ReportCard from "../components/ReportCard";

function AdminReportsPage({ token }) {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllReports(token)
      .then(setReports)
      .catch(() => setError("Ошибка загрузки отчётов"));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить отчёт?")) return;
    try {
      await deleteReport(token, id, true);
      setReports(reports => reports.filter(r => r.id !== id));
    } catch (error) {
      console.error("Ошибка удаления отчёта:", error);
    }
  };

  return (
    <div className="page">
      <h1>Все отчёты пользователей</h1>
      {error && <div className="alert alert-error" style={{ marginBottom: 14 }}>{error}</div>}

      {reports.length === 0 ? (
        <div className="card empty">Отчётов нет</div>
      ) : (
        <div className="report-list">
          {reports.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              linkTo={`/admin/report/${r.id}`}
              uploaderName={`ID пользователя: ${r.user_id}`}
              canDelete={true}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReportsPage;
