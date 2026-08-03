import React from "react";

// Столбчатый график риска по пациентам отчёта. Чистый SVG:
// цвета берутся из CSS-переменных, поэтому график сам адаптируется к теме.
const LEVEL_COLOR = {
  LOW: "var(--success)",
  MEDIUM: "var(--warning)",
  HIGH: "var(--danger)",
};

const MAX_BARS = 50;

function RiskBarChart({ points }) {
  const all = [...(points || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  if (all.length === 0) return null;

  const trimmed = all.length > MAX_BARS;
  const data = trimmed
    ? [...all]
        .sort((a, b) => (b.riskScore ?? -1) - (a.riskScore ?? -1))
        .slice(0, MAX_BARS)
        .sort((a, b) => a.sortOrder - b.sortOrder)
    : all;

  const barW = 30;
  const gap = 26;
  const padLeft = 44;
  const padRight = 16;
  const padTop = 18;
  const chartH = 190;
  const labelH = 52;
  const width = padLeft + data.length * (barW + gap) + padRight;
  const height = padTop + chartH + labelH;

  const y = (score) => padTop + chartH - (score / 100) * chartH;
  const rotateLabels = data.length > 8;

  // Пороговые зоны уровней риска: 0–35 низкий, 36–70 средний, 71–100 высокий
  const zones = [
    { from: 0, to: 35, color: "var(--success)" },
    { from: 35, to: 70, color: "var(--warning)" },
    { from: 70, to: 100, color: "var(--danger)" },
  ];
  const gridLines = [0, 35, 70, 100];

  return (
    <>
      {trimmed && (
        <p className="text-muted" style={{ marginTop: 0 }}>
          Показаны {MAX_BARS} пациентов с наибольшим индексом из {all.length}.
        </p>
      )}
      <div className="risk-chart-scroll">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label="График индекса лабораторных отклонений по пациентам"
      >
        {zones.map((z) => (
          <rect
            key={z.from}
            x={padLeft}
            y={y(z.to)}
            width={width - padLeft - padRight}
            height={y(z.from) - y(z.to)}
            fill={z.color}
            opacity="0.06"
          />
        ))}

        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={padLeft}
              x2={width - padRight}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--border)"
              strokeDasharray={v === 0 ? "" : "4 4"}
            />
            <text
              x={padLeft - 8}
              y={y(v) + 4}
              textAnchor="end"
              fontSize="11"
              fill="var(--text-muted)"
            >
              {v}
            </text>
          </g>
        ))}

        {data.map((p, i) => {
          const x = padLeft + gap / 2 + i * (barW + gap);
          const hasScore = p.riskScore !== null && p.riskScore !== undefined;
          const barY = hasScore ? y(p.riskScore) : y(0) - 4;
          const barH = hasScore ? y(0) - y(p.riskScore) : 4;
          const color = hasScore
            ? LEVEL_COLOR[p.riskLevel] || "var(--text-muted)"
            : "var(--border)";
          const labelX = x + barW / 2;
          const labelY = padTop + chartH + 18;
          return (
            <g key={`${p.sortOrder}-${p.patientCode}`}>
              <title>
                {p.patientCode}: {hasScore ? `${p.riskScore}/100` : "нет данных"}
              </title>
              <rect x={x} y={barY} width={barW} height={Math.max(barH, 2)} rx="6" fill={color} />
              {hasScore && (
                <text
                  x={labelX}
                  y={barY - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="var(--text)"
                >
                  {p.riskScore}
                </text>
              )}
              <text
                x={labelX}
                y={labelY}
                textAnchor={rotateLabels ? "end" : "middle"}
                fontSize="11"
                fill="var(--text-muted)"
                transform={rotateLabels ? `rotate(-38 ${labelX} ${labelY})` : undefined}
              >
                {String(p.patientCode).length > 10
                  ? String(p.patientCode).slice(0, 9) + "…"
                  : p.patientCode}
              </text>
            </g>
          );
        })}
      </svg>
      </div>
    </>
  );
}

export default RiskBarChart;
