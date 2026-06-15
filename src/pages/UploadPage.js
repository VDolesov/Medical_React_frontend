import React, { useState } from "react";
import { uploadFile } from "../api";
import { useNavigate } from "react-router-dom";

function UploadPage({ token }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { reportId } = await uploadFile(token, file);
      navigate(`/report/${reportId}`);
    } catch {
      setError("Ошибка загрузки файла");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Загрузить анализы</h1>
      <div className="card">
        <p className="text-muted" style={{ marginTop: 0 }}>
          Поддерживаются файлы .xlsx, .xls, .csv
        </p>
        <form onSubmit={handleSubmit} className="form-stack">
          <div>
            <label htmlFor="upload-file">Файл с результатами</label>
            <input
              id="upload-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Загрузка…" : "Загрузить"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
