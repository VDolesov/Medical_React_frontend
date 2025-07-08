import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getReportById } from "../api";

function AdminReportViewPage({ token }) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getReportById(token, id, true)
      .then(setReport)
      .catch(() => setError("Не удалось загрузить отчёт"));
  }, [id, token]);

  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>Ошибка</h2>
        <div style={{ color: "red" }}>{error}</div>
        <Link to="/admin/reports">Назад к списку</Link>
      </div>
    );
  }

  if (!report) {
    return <div style={{ maxWidth: 600, margin: "40px auto" }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Подробный отчёт #{id}</h2>
      <Link to="/admin/reports" style={{ display: "block", marginBottom: 18 }}>← К списку отчётов</Link>
      {Array.isArray(report) && report.length > 0 ? (
        report.map((patient, idx) => (
          <div key={idx} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 14 }}>
            <strong>Код пациента:</strong> {patient.code}<br />
            <strong>Возраст:</strong> {patient.age}<br />
            <strong>Отклонения:</strong>
            <ul>
              {Array.isArray(patient.outOfNorms)
                ? patient.outOfNorms.map((item, i) =>
                  typeof item === "string"
                    ? <li key={i}>{item}</li>
                    : <li key={i}>{item.analysis}: {item.value} {item.unit} (<b>{item.status}</b>, норма: {item.min}–{item.max})</li>
                )
                : <li>Нет данных</li>
              }
            </ul>
          </div>
        ))
      ) : (
        <div>Нет данных</div>
      )}
    </div>
  );
}

export default AdminReportViewPage;
