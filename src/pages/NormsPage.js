import React, { useEffect, useState } from "react";
import { getNorms, addNorm, updateNorm, deleteNorm } from "../api";

function NormsPage({ token, isAdmin }) {
  const [norms, setNorms] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", min_value: "", max_value: "", unit: "" });
  const [error, setError] = useState(null);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    getNorms(token)
      .then(setNorms)
      .catch(err => setError(err.message));
  }, [token]);

  const handleEdit = (norm) => {
    setEditId(norm.id);
    setForm({
      name: norm.name,
      min_value: norm.min_value,
      max_value: norm.max_value,
      unit: norm.unit
    });
    setAddMode(false);
    setError(null);
  };

  const handleSave = () => {
    updateNorm(token, editId, form)
      .then(() => {
        setEditId(null);
        setForm({ name: "", min_value: "", max_value: "", unit: "" });
        setError(null);
        return getNorms(token);
      })
      .then(setNorms)
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить эту норму?")) {
      deleteNorm(token, id)
        .then(() => {
          setNorms(norms.filter(n => n.id !== id));
        })
        .catch(err => setError(err.message));
    }
  };

  const handleAddNew = () => {
    setAddMode(true);
    setEditId(null);
    setForm({ name: "", min_value: "", max_value: "", unit: "" });
    setError(null);
  };

  const handleAddSave = () => {
    addNorm(token, form)
      .then(() => {
        setAddMode(false);
        setForm({ name: "", min_value: "", max_value: "", unit: "" });
        setError(null);
        return getNorms(token);
      })
      .then(setNorms)
      .catch(err => setError(err.message));
  };

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Нормы анализов</h1>
        {isAdmin && (
          <button onClick={handleAddNew} className="btn-sm">+ Добавить норму</button>
        )}
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Мин</th>
              <th>Макс</th>
              <th>Ед. изм.</th>
              {isAdmin && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {addMode && (
              <tr>
                <td><input value={form.name} onChange={setField("name")} placeholder="Название" /></td>
                <td><input value={form.min_value} type="number" onChange={setField("min_value")} /></td>
                <td><input value={form.max_value} type="number" onChange={setField("max_value")} /></td>
                <td><input value={form.unit} onChange={setField("unit")} placeholder="ед." /></td>
                <td>
                  <div className="row-actions">
                    <button onClick={handleAddSave} className="btn-sm">Сохранить</button>
                    <button onClick={() => setAddMode(false)} className="btn-ghost btn-sm">Отмена</button>
                  </div>
                </td>
              </tr>
            )}
            {norms.map(norm =>
              editId === norm.id ? (
                <tr key={norm.id}>
                  <td><input value={form.name} onChange={setField("name")} /></td>
                  <td><input value={form.min_value} type="number" onChange={setField("min_value")} /></td>
                  <td><input value={form.max_value} type="number" onChange={setField("max_value")} /></td>
                  <td><input value={form.unit} onChange={setField("unit")} /></td>
                  <td>
                    <div className="row-actions">
                      <button onClick={handleSave} className="btn-sm">Сохранить</button>
                      <button onClick={() => setEditId(null)} className="btn-ghost btn-sm">Отмена</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={norm.id}>
                  <td>{norm.name}</td>
                  <td>{norm.min_value}</td>
                  <td>{norm.max_value}</td>
                  <td>{norm.unit}</td>
                  {isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button onClick={() => handleEdit(norm)} className="btn-ghost btn-sm">Изменить</button>
                        <button onClick={() => handleDelete(norm.id)} className="btn-danger btn-sm">Удалить</button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
            {norms.length === 0 && !addMode && (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-muted" style={{ textAlign: "center", padding: 24 }}>
                  Норм пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NormsPage;
