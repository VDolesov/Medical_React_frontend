import React from "react";

function AnalysisTable({ data }) {
  if (!data || !data.outOfNorms) return null;
  const items = data.outOfNorms;

  if (items.length === 1 && typeof items[0] === "string") {
    return <div className="alert alert-success">{items[0]}</div>;
  }

  return (
    <div className="table-wrap" style={{ marginTop: 8 }}>
      <table>
        <thead>
          <tr>
            <th>Показатель</th>
            <th>Значение</th>
            <th>Норма</th>
            <th>Ед.</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) =>
            typeof item === "string" ? (
              <tr key={idx}>
                <td colSpan={5} className="text-muted">{item}</td>
              </tr>
            ) : (
              <tr key={idx}>
                <td>{item.analysis}</td>
                <td><b>{item.value}</b></td>
                <td className="text-muted">{item.min}–{item.max}</td>
                <td>{item.unit}</td>
                <td>
                  <span className={"badge " + (item.status === "выше нормы" ? "badge-high" : "badge-low")}>
                    {item.status}
                  </span>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AnalysisTable;
