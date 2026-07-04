import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { getMe } from "./api";

// Ленивая загрузка страниц: каждая уходит в отдельный чанк.
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NormsPage = lazy(() => import("./pages/NormsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const ReportViewPage = lazy(() => import("./pages/ReportViewPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminReportsPage = lazy(() => import("./pages/AdminReportsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));

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
      <Suspense fallback={<div className="page text-muted">Загрузка…</div>}>
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
              <Route path="/report/:id/analytics" element={<AnalyticsPage token={token} role={user?.role} />} />

              {/* Для администратора — свои страницы */}
              {user?.role === "admin" && (
                <>
                  <Route path="/admin/users" element={<AdminUsersPage token={token} />} />
                  <Route path="/admin/reports" element={<AdminReportsPage token={token} />} />
                  <Route path="/admin/report/:id" element={<ReportViewPage token={token} role="admin" />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
