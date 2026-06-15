import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NormsPage from "./pages/NormsPage";
import ReportsPage from "./pages/ReportsPage";
import ReportViewPage from "./pages/ReportViewPage";
import UploadPage from "./pages/UploadPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import Navbar from "./components/Navbar";
import { getMe } from "./api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Загружаем профиль пользователя при наличии токена
  useEffect(() => {
    if (token) {
      getMe(token)
        .then(setUser)
        .catch(() => {
          // Если токен недействителен, очищаем его
          setToken(null);
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLogin = (tok, role) => {
    setToken(tok);
    localStorage.setItem("token", tok);
    setUser({ role }); // Сохраняем роль сразу после логина
  };
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      {token && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Для doctor и admin доступны стандартные страницы */}
            <Route path="/" element={<ReportsPage token={token} />} />
            <Route path="/upload" element={<UploadPage token={token} />} />
            <Route path="/norms" element={<NormsPage token={token} isAdmin={user?.role === "admin"} />} />
            <Route path="/profile" element={<ProfilePage token={token} />} />
            <Route path="/report/:id" element={<ReportViewPage token={token} />} />

            {/* Для администратора — свои страницы */}
            {user?.role === "admin" && (
              <>
                <Route path="/admin/users" element={<AdminUsersPage token={token} />} />
                <Route path="/admin/reports" element={<AdminReportsPage token={token} />} />
                {/* Можно добавить просмотр любого отчёта: */}
                <Route path="/admin/report/:id" element={<ReportViewPage token={token} role="admin" />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
