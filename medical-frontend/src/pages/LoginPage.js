import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getMe } from "../api";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. Запрос на /login — получаем токен
      const data = await loginUser({ username, password });

      // 2. Получаем профиль, чтобы узнать роль
      const profile = await getMe(data.token);

      // 3. onLogin теперь принимает два аргумента: токен и роль!
      onLogin(data.token, profile.role);

      navigate("/");
    } catch (e) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "60px auto", textAlign: "center" }}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button style={{ width: "100%", marginBottom: 8 }} type="submit">
          Войти
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <div>
        Нет аккаунта?{" "}
        <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}

export default LoginPage;
