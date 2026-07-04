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
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Код персонала обязателен и для врача, и для администратора:
    // регистрацию медперсонала контролирует администратор, выдающий код.
    const payload = { username, password, email, firstName, lastName, role, adminSecret };

    try {
      await registerUser(payload);
      setSuccess("Регистрация успешна! Сейчас перенаправим на вход.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="auth-head">
          <span className="brand-mark auth-mark">✚</span>
          <h1 className="auth-title">Регистрация</h1>
          <p className="text-muted auth-sub">Аккаунт врача или администратора</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="reg-username">Логин</label>
            <input id="reg-username" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="reg-password">Пароль</label>
            <input id="reg-password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-row">
            <div>
              <label htmlFor="reg-first">Имя</label>
              <input id="reg-first" type="text" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="reg-last">Фамилия</label>
              <input id="reg-last" type="text" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label htmlFor="reg-role">Роль</label>
            <select id="reg-role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="doctor">Врач</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div>
            <label htmlFor="reg-secret">Код регистрации персонала</label>
            <input id="reg-secret" type="password" value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)} required
              placeholder="Выдаёт администратор клиники" />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" disabled={loading} className="auth-submit">
            {loading ? "Создаём…" : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-foot text-muted">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
