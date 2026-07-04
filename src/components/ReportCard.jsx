import React from "react";
import { Link } from "react-router-dom";

function ReportCard({ report, linkTo, uploaderName, canDelete, onDelete }) {
  return (
    <div className="report-card">
      <div className="report-icon">📄</div>
      <div className="report-body">
        <Link to={linkTo} className="report-name">{report.file_name}</Link>
        <div className="report-meta">
          <span>{new Date(report.created_at).toLocaleString()}</span>
          {uploaderName && <span className="badge badge-muted">{uploaderName}</span>}
        </div>
      </div>
      {canDelete && (
        <button className="btn-danger report-del" onClick={onDelete}>
          Удалить
        </button>
      )}
    </div>
  );
}

export default ReportCard;
