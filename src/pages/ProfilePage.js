import React, { useEffect, useState } from "react";
import { getMe } from "../api";

const ROLE_LABELS = { doctor: "Врач", admin: "Администратор", patient: "Пациент" };

function ProfilePage({ token }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe(token).then(setUser);
  }, [token]);

  if (!user) {
    return <div className="page-narrow"><div className="text-muted">Загрузка…</div></div>;
  }

  return (
    <div className="page-narrow">
      <h1>Профиль</h1>
      <div className="card">
        <div className="profile-row">
          <span className="label">Логин</span>
          <span>{user.username}</span>
        </div>
        <div className="profile-row">
          <span className="label">Имя</span>
          <span>{user.first_name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Фамилия</span>
          <span>{user.last_name}</span>
        </div>
        <div className="profile-row">
          <span className="label">Роль</span>
          <span className="badge badge-brand">{ROLE_LABELS[user.role] || user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
