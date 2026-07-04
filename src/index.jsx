import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Применяем сохранённую тему до первого рендера, чтобы не было «вспышки».
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.dataset.theme = savedTheme;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.dataset.theme = 'dark';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
