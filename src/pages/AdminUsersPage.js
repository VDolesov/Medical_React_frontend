import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, deleteUser } from "../api";

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

  // Загрузка списка пользователей
  useEffect(() => {
    getAllUsers(token)
      .then(setUsers)
      .catch(() => setError("Ошибка загрузки пользователей"));
  }, [token, showForm]);

  // Создание пользователя
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

  // Удаление пользователя
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
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Пользователи</h2>
      <button onClick={() => setShowForm(f => !f)}>
        {showForm ? "Отмена" : "Создать пользователя"}
      </button>
      {showForm && (
        <form onSubmit={handleCreate} style={{ marginTop: 16 }}>
          <input required placeholder="Логин" value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          <input required placeholder="Пароль" type="password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          <input required placeholder="Email" type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <input required placeholder="Имя" value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
          <input required placeholder="Фамилия" value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            <option value="doctor">Врач</option>
            <option value="admin">Админ</option>
          </select>
          <button type="submit" style={{ marginLeft: 16 }}>Создать</button>
        </form>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul style={{ marginTop: 32 }}>
        {users.map(u => (
          <li key={u.id}>
            <b>{u.username}</b> ({u.first_name} {u.last_name}, {u.role}, {u.email}){" "}
            <button onClick={() => handleDelete(u.id)} style={{ color: "red" }}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsersPage;
