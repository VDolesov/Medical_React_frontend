import React, { useEffect, useState } from "react";

// Тема хранится в localStorage и выставляется на <html data-theme="...">.
// Начальное значение подхватывается в index.js до первого рендера.
function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;
