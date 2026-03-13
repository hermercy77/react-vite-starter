import React from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import './Header.css';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">React Vite Starter</h1>
      </div>
      <div className="header-right">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
