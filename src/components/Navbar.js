import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const linkClass = ({ isActive }) => "nav-link" + (isActive ? " nav-link-active" : "");

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const close = () => setOpen(false);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">✚</span>
          <span className="brand-name">Мед-аналитика</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Меню">
          <span /><span /><span />
        </button>

        <nav className={"nav" + (open ? " nav-open" : "")}>
          <NavLink to="/" end className={linkClass} onClick={close}>Анализы</NavLink>
          <NavLink to="/upload" className={linkClass} onClick={close}>Загрузить</NavLink>
          <NavLink to="/norms" className={linkClass} onClick={close}>Нормы</NavLink>
          <NavLink to="/profile" className={linkClass} onClick={close}>Профиль</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/users" className={linkClass} onClick={close}>Пользователи</NavLink>
              <NavLink to="/admin/reports" className={linkClass} onClick={close}>Все отчёты</NavLink>
            </>
          )}
          <div className="nav-user">
            {user?.username && <span className="user-chip">{user.username}</span>}
            {isAdmin && <span className="badge badge-brand">админ</span>}
            <button className="btn-ghost logout-btn" onClick={() => { close(); onLogout(); }}>
              Выйти
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
