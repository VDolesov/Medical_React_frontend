import React, { useState } from "react";
import { uploadFile } from "../api";
import { useNavigate } from "react-router-dom";

function UploadPage({ token }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const { reportId } = await uploadFile(token, file);
      navigate(`/report/${reportId}`);
    } catch {
      setError("Ошибка загрузки файла");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "48px auto" }}>
      <h2>Загрузить файл анализов</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={e => setFile(e.target.files[0])}
          required
          style={{ marginBottom: 16 }}
        />
        <button type="submit">Загрузить</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default UploadPage;
