import React, { useEffect, useState } from "react";
import { getNorms, addNorm, updateNorm, deleteNorm } from "../api";

function NormsPage({ token, isAdmin }) {
  const [norms, setNorms] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", min_value: "", max_value: "", unit: "" });
  const [error, setError] = useState(null);
  const [addMode, setAddMode] = useState(false);

  // Загрузка норм
  useEffect(() => {
    getNorms(token)
      .then(setNorms)
      .catch(err => setError(err.message));
  }, [token]);

  // Открыть форму редактирования
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

  // Сохранить изменения
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

  // Удалить норму
  const handleDelete = (id) => {
    if (window.confirm("Удалить эту норму?")) {
      deleteNorm(token, id)
        .then(() => {
          setNorms(norms.filter(n => n.id !== id));
        })
        .catch(err => setError(err.message));
    }
  };

  // Начать добавление новой нормы
  const handleAddNew = () => {
    setAddMode(true);
    setEditId(null);
    setForm({ name: "", min_value: "", max_value: "", unit: "" });
    setError(null);
  };

  // Сохранить новую норму
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

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Нормы анализов</h2>
      {isAdmin && (
        <>
          <p>Для редактирования или удаления нормы используйте соответствующие кнопки.</p>
          <button onClick={handleAddNew} style={{ marginBottom: 10 }}>Добавить новую норму</button>
        </>
      )}
      <table border={1} cellPadding={6} style={{ width: "100%" }}>
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
          {/* Добавление новой нормы */}
          {addMode && (
            <tr>
              <td>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </td>
              <td>
                <input
                  value={form.min_value}
                  type="number"
                  onChange={e => setForm(f => ({ ...f, min_value: e.target.value }))}
                />
              </td>
              <td>
                <input
                  value={form.max_value}
                  type="number"
                  onChange={e => setForm(f => ({ ...f, max_value: e.target.value }))}
                />
              </td>
              <td>
                <input
                  value={form.unit}
                  onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                />
              </td>
              <td>
                <button onClick={handleAddSave}>Сохранить</button>
                <button onClick={() => setAddMode(false)}>Отмена</button>
              </td>
            </tr>
          )}
          {/* Список норм */}
          {norms.map(norm =>
            editId === norm.id ? (
              <tr key={norm.id}>
                <td><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></td>
                <td><input value={form.min_value} type="number" onChange={e => setForm(f => ({ ...f, min_value: e.target.value }))} /></td>
                <td><input value={form.max_value} type="number" onChange={e => setForm(f => ({ ...f, max_value: e.target.value }))} /></td>
                <td><input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} /></td>
                <td>
                  <button onClick={handleSave}>Сохранить</button>
                  <button onClick={() => setEditId(null)}>Отмена</button>
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
                    <button onClick={() => handleEdit(norm)}>Редактировать</button>
                    <button style={{ marginLeft: 8, color: "red" }} onClick={() => handleDelete(norm.id)}>
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default NormsPage;
