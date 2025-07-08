import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";


function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("doctor");
  const [adminSecret, setAdminSecret] = useState(""); // Для создания admin
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = { username, password, email, firstName, lastName, role };
    if (role === "admin") {
      payload.adminSecret = adminSecret;
    }

    try {
      await registerUser(payload);
      setSuccess("Регистрация успешна! Теперь войдите в систему.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "60px auto", textAlign: "center" }}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          required
        />
        <input
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          required
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="doctor">Врач</option>
          <option value="admin">Администратор</option>
        </select>
        {role === "admin" && (
          <input
            type="password"
            placeholder="Секретный код администратора"
            value={adminSecret}
            onChange={e => setAdminSecret(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
            required
          />
        )}
        <button style={{ width: "100%", marginBottom: 8 }} type="submit">
          Зарегистрироваться
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
    {/* Вот здесь добавляем ссылку */}
      <div style={{ marginTop: 16 }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
