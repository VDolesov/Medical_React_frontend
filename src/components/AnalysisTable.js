import React from "react";

function AnalysisTable({ data }) {
  if (!data || !data.outOfNorms) return null;

  // Если все в норме (строка):
  if (data.outOfNorms.length === 1 && typeof data.outOfNorms[0] === "string") {
    return <div style={{ color: "green" }}>{data.outOfNorms[0]}</div>;
  }

  return (
    <table style={{ marginTop: 10, marginBottom: 20, width: "100%" }}>
      <thead>
        <tr>
          <th>Показатель</th>
          <th>Значение</th>
          <th>Мин</th>
          <th>Макс</th>
          <th>Ед.</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {data.outOfNorms.map((item, idx) => (
          <tr key={idx}>
            <td>{item.analysis}</td>
            <td>{item.value}</td>
            <td>{item.min}</td>
            <td>{item.max}</td>
            <td>{item.unit}</td>
            <td style={{ color: item.status === "выше нормы" ? "red" : "blue" }}>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AnalysisTable;
