import React from "react";
import { Link } from "react-router-dom";

function ReportCard({ report, onDelete }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <Link to={`/report/${report.id}`}><b>{report.file_name}</b></Link>
        <div style={{ fontSize: 12, color: "#555" }}>{new Date(report.created_at).toLocaleString()}</div>
      </div>
      <button style={{ color: "red" }} onClick={() => onDelete(report.id)}>Удалить</button>
    </div>
  );
}

export default ReportCard;
