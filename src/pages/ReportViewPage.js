import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportById } from "../api";
import AnalysisTable from "../components/AnalysisTable";

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

  if (error) {
    return <div className="page"><div className="alert alert-error">{error}</div></div>;
  }
  if (!report) {
    return <div className="page"><div className="text-muted">Загрузка…</div></div>;
  }

  return (
    <div className="page">
      <h1>Детали отчёта</h1>
      {report.length === 0 ? (
        <div className="card empty">В отчёте нет данных</div>
      ) : (
        <div className="patient-list">
          {report.map((patient, idx) => (
            <div className="card patient-card" key={idx}>
              <div className="patient-head">
                <span className="badge badge-brand">Код: {patient.code}</span>
                <span className="badge badge-muted">Возраст: {patient.age}</span>
              </div>
              <AnalysisTable data={patient} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportViewPage;
