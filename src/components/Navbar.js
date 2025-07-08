import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ padding: 16, background: "#f3f3f3", marginBottom: 24 }}>
      <Link to="/" style={{ marginRight: 20 }}>Главная</Link>
      <Link to="/upload" style={{ marginRight: 20 }}>Загрузить файл</Link>
      <Link to="/reports" style={{ marginRight: 20 }}>Мои отчёты</Link>
      <Link to="/norms" style={{ marginRight: 20 }}>Нормы</Link>
      <Link to="/profile" style={{ marginRight: 20 }}>Профиль</Link>
      {user ? (
        <span>
          {user.username} <button onClick={onLogout}>Выйти</button>
        </span>
      ) : (
        <Link to="/login">Войти</Link>
      )}
    </nav>
  );
}

export default Navbar;
