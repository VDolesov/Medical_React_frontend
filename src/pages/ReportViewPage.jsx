import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getReportById } from "../api";
import AnalysisTable from "../components/AnalysisTable";

const PAGE_SIZE = 50;

function ReportViewPage({ token, role }) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);

  useEffect(() => {
    getReportById(token, id, role === "admin", page, PAGE_SIZE)
      .then(data => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (Array.isArray(parsed)) {
          setReport(parsed);
          setTotal(parsed.length);
        } else {
          setReport(parsed.patients || []);
          setTotal(typeof parsed.total === "number" ? parsed.total : null);
        }
      })
      .catch(e => setError(e.message));
  }, [id, token, role, page]);

  const pageCount = total === null ? 1 : Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (error) {
    return <div className="page"><div className="alert alert-error">{error}</div></div>;
  }
  if (!report) {
    return <div className="page"><div className="text-muted">Загрузка…</div></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Детали отчёта</h1>
        <Link to={`/report/${id}/analytics`} className="btn">Аналитика риска →</Link>
      </div>
      {total !== null && (
        <p className="text-muted">
          Пациентов в отчёте: {total}
          {pageCount > 1 ? ` · страница ${page} из ${pageCount}` : ""}
        </p>
      )}
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
      {pageCount > 1 && (
        <div className="quick-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
            ← Назад
          </button>
          <button className="btn btn-ghost" onClick={() => setPage(p => p + 1)} disabled={page >= pageCount}>
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportViewPage;
