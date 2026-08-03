import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAnalyticsSummary, getAnalyticsPatients, generateAnalytics } from "../api";
import RiskBarChart from "../components/RiskBarChart";

const LEVEL_LABEL = { LOW: "слабые отклонения", MEDIUM: "умеренные", HIGH: "выраженные" };
const LEVEL_BADGE = { LOW: "badge-low", MEDIUM: "badge-mid", HIGH: "badge-high" };
const TREND_META = {
  IMPROVING: { icon: "↘", text: "улучшение", cls: "trend-good" },
  WORSENING: { icon: "↗", text: "ухудшение", cls: "trend-bad" },
  STABLE: { icon: "→", text: "стабильно", cls: "trend-flat" },
};

function riskBadge(level, score) {
  if (score === null || score === undefined) {
    return <span className="badge badge-muted">нет данных</span>;
  }
  return (
    <span className={`badge ${LEVEL_BADGE[level] || "badge-muted"}`}>
      индекс {score}/100 · {LEVEL_LABEL[level] || level}
    </span>
  );
}

function AnalyticsPage({ token, role }) {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, p] = await Promise.all([
        getAnalyticsSummary(token, id),
        getAnalyticsPatients(token, id),
      ]);
      setSummary(s);
      setPatients(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    load();
  }, [load]);

  const canGenerate = ["admin", "doctor"].includes(String(role || "").toLowerCase());

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      await generateAnalytics(token, id);
      await load();
    } catch (e) {
      setGenError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="page"><div className="text-muted">Загрузка аналитики…</div></div>;
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Индекс лабораторных отклонений</h1>
          <Link to={`/report/${id}`} className="btn btn-ghost">← К отчёту</Link>
        </div>
        <div className="alert alert-error">
          {error}. Убедитесь, что сервер аналитики запущен и отчёт вам доступен.
        </div>
      </div>
    );
  }

  const generated = summary?.generatedCount ?? 0;
  const total = summary?.linkedPatientCount ?? 0;
  const distTotal =
    (summary?.countLow ?? 0) + (summary?.countMedium ?? 0) + (summary?.countHigh ?? 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Индекс лабораторных отклонений</h1>
        <div className="quick-actions">
          <Link to={`/report/${id}`} className="btn btn-ghost">← К отчёту</Link>
          {canGenerate && (
            <button onClick={handleGenerate} disabled={generating}>
              {generating ? "Считаем…" : generated > 0 ? "Пересчитать" : "Сгенерировать"}
            </button>
          )}
        </div>
      </div>

      {genError && <div className="alert alert-error" style={{ marginBottom: 16 }}>{genError}</div>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value">{total}</div>
          <div className="stat-label">пациентов в отчёте</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{generated}</div>
          <div className="stat-label">с рассчитанным индексом</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">
            {summary?.averageRisk !== null && summary?.averageRisk !== undefined
              ? `${summary.averageRisk}/100`
              : "—"}
          </div>
          <div className="stat-label">средний индекс отклонений</div>
        </div>
        <div className="card stat-card">
          <div className="dist-bar" aria-hidden={distTotal === 0}>
            {distTotal > 0 ? (
              <>
                {summary.countLow > 0 && (
                  <span className="dist-low" style={{ flex: summary.countLow }} title={`Низкий: ${summary.countLow}`} />
                )}
                {summary.countMedium > 0 && (
                  <span className="dist-mid" style={{ flex: summary.countMedium }} title={`Средний: ${summary.countMedium}`} />
                )}
                {summary.countHigh > 0 && (
                  <span className="dist-high" style={{ flex: summary.countHigh }} title={`Высокий: ${summary.countHigh}`} />
                )}
              </>
            ) : (
              <span className="dist-empty" />
            )}
          </div>
          <div className="stat-label">
            низкий {summary?.countLow ?? 0} · средний {summary?.countMedium ?? 0} · высокий {summary?.countHigh ?? 0}
          </div>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-head">
          <h2>Индекс по пациентам</h2>
          <div className="chart-legend">
            <span><i className="dot dot-low" /> 0–35 слабые</span>
            <span><i className="dot dot-mid" /> 36–70 умеренные</span>
            <span><i className="dot dot-high" /> 71–100 выраженные</span>
          </div>
        </div>
        {generated > 0 && summary?.scores?.length > 0 ? (
          <RiskBarChart points={summary.scores} />
        ) : (
          <div className="empty">
            Аналитика ещё не рассчитана.
            {canGenerate ? " Нажмите «Сгенерировать», чтобы построить график." : ""}
          </div>
        )}
      </div>

      {patients.length > 0 && (
        <>
          <h2 className="patients-title">Пациенты</h2>
          <div className="patient-list">
            {patients.map((p) => {
              const trend = TREND_META[p.features?.trend];
              const factors = Array.isArray(p.features?.topFactors) ? p.features.topFactors : [];
              return (
                <div className="card" key={p.reportPatientId}>
                  <div className="patient-head">
                    <span className="badge badge-brand">Код: {p.patientCode}</span>
                    {p.age !== null && p.age !== undefined && (
                      <span className="badge badge-muted">Возраст: {p.age}</span>
                    )}
                    {riskBadge(p.riskLevel, p.riskScore)}
                    {trend && (
                      <span className={`badge badge-muted ${trend.cls}`}>
                        {trend.icon} {trend.text}
                      </span>
                    )}
                  </div>
                  {factors.length > 0 && (
                    <div className="factor-row">
                      <span className="text-muted factor-caption">Ключевые факторы:</span>
                      {factors.map((f) => (
                        <span className="badge badge-muted" key={f}>{f}</span>
                      ))}
                    </div>
                  )}
                  {p.explanationText && (
                    <details className="explanation">
                      <summary>Объяснение оценки</summary>
                      <p>{p.explanationText}</p>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
