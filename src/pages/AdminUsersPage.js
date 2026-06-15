import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, deleteUser } from "../api";

const ROLE_LABELS = { doctor: "Врач", admin: "Админ", patient: "Пациент" };

function AdminUsersPage({ token }) {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "doctor"
  });
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError("Ошибка загрузки пользователей"));
  }, [token, showForm]);

  const setField = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(token, form);
      setShowForm(false);
      setForm({ username: "", password: "", email: "", firstName: "", lastName: "", role: "doctor" });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      await deleteUser(token, id);
      setUsers(u => u.filter(x => x.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Пользователи</h1>
        <button onClick={() => setShowForm(f => !f)} className={showForm ? "btn-ghost" : ""}>
          {showForm ? "Отмена" : "+ Создать пользователя"}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 14 }}>{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: 18 }}>
          <form onSubmit={handleCreate} className="form-stack">
            <div className="auth-row">
              <div>
                <label>Логин</label>
                <input required value={form.username} onChange={setField("username")} />
              </div>
              <div>
                <label>Пароль</label>
                <input required type="password" value={form.password} onChange={setField("password")} />
              </div>
            </div>
            <div>
              <label>Email</label>
              <input required type="email" value={form.email} onChange={setField("email")} />
            </div>
            <div className="auth-row">
              <div>
                <label>Имя</label>
                <input required value={form.firstName} onChange={setField("firstName")} />
              </div>
              <div>
                <label>Фамилия</label>
                <input required value={form.lastName} onChange={setField("lastName")} />
              </div>
            </div>
            <div>
              <label>Роль</label>
              <select value={form.role} onChange={setField("role")}>
                <option value="doctor">Врач</option>
                <option value="admin">Админ</option>
              </select>
            </div>
            <button type="submit">Создать</button>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Логин</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><b>{u.username}</b></td>
                <td>{u.first_name} {u.last_name}</td>
                <td className="text-muted">{u.email}</td>
                <td><span className="badge badge-muted">{ROLE_LABELS[u.role] || u.role}</span></td>
                <td>
                  <button onClick={() => handleDelete(u.id)} className="btn-danger btn-sm">Удалить</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted" style={{ textAlign: "center", padding: 24 }}>
                  Пользователей нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;
