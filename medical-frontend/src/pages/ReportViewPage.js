import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../api";

function ReportViewPage({ token, role }) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getReportById(token, id, role === "admin")
      .then(data => {
        setReport(typeof data === "string" ? JSON.parse(data) : data);
      })
      .catch(e => setError(e.message));
  }, [id, token, role]);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!report) return <div>Загрузка...</div>;

  // report — это массив пациентов в отчёте
  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Детали отчёта</h2>
      <ul>
        {report.map((patient, idx) => (
          <li key={idx} style={{ marginBottom: 18 }}>
            <div>
              <b>Код пациента:</b> {patient.code} &nbsp;
              <b>Возраст:</b> {patient.age}
            </div>
            <div>
              <b>Отклонения:</b>
              <ul>
                {Array.isArray(patient.outOfNorms) ? (
                  patient.outOfNorms.map((n, i) =>
                    typeof n === "string" ? (
                      <li key={i}>{n}</li>
                    ) : (
                      <li key={i}>
                        {n.analysis}: {n.value} {n.unit} ({n.status}, норма: {n.min}-{n.max})
                      </li>
                    )
                  )
                ) : (
                  <li>Нет данных</li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportViewPage;
