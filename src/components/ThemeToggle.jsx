import { useCallback } from 'react';
import './ThemeToggle.css';

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const icon = isDark ? '☀️' : '🌙';
  const ariaLabel = isDark ? '切换到浅色模式' : '切换到深色模式';

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
