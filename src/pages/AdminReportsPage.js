import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllReports, deleteReport } from "../api";

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
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Все отчёты пользователей</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {reports.map(r => (
          <li key={r.id} style={{ marginBottom: 10 }}>
            <Link to={`/admin/report/${r.id}`}>{r.file_name}</Link>
            {" | "}
            <span>user_id: {r.user_id}</span>
            {" | "}
            <span>{new Date(r.created_at).toLocaleString()}</span>
            {" | "}
            <button onClick={() => handleDelete(r.id)} style={{ color: "red" }}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminReportsPage;
