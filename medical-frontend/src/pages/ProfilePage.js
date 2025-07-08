import React, { useEffect, useState } from "react";
import { getMe } from "../api";

function ProfilePage({ token }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe(token).then(setUser);
  }, [token]);

  if (!user) return <div>Загрузка...</div>;

  return (
    <div style={{ maxWidth: 360, margin: "48px auto" }}>
      <h2>Профиль</h2>
      <div><b>Логин:</b> {user.username}</div>
      <div><b>Имя:</b> {user.first_name}</div>
      <div><b>Фамилия:</b> {user.last_name}</div>
      <div><b>Роль:</b> {user.role}</div>
    </div>
  );
}

export default ProfilePage;
