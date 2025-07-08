import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage({ onLogout }) {
  return (
    <div>
      <h1>Главная страница</h1>
      <nav>
        <Link to="/upload">Загрузить анализы</Link> |{" "}
        <Link to="/report">Отчёты</Link>
      </nav>
      <br />
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
}
