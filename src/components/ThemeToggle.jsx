import React from 'react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const label = isDark ? '切换至浅色模式' : '切换至深色模式';

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
      title={label}
      type="button"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
