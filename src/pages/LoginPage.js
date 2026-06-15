import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getMe } from "../api";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser({ username, password });
      const profile = await getMe(data.token);
      onLogin(data.token, profile.role);
      navigate("/");
    } catch (e) {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-head">
          <span className="brand-mark auth-mark">✚</span>
          <h1 className="auth-title">Мед-аналитика</h1>
          <p className="text-muted auth-sub">Войдите, чтобы продолжить</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="login-username">Логин</label>
            <input
              id="login-username"
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Вход…" : "Войти"}
          </button>
        </form>

        <div className="auth-foot text-muted">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
