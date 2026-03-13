import { useCallback } from 'react';
import './ThemeToggle.css';

/**
 * ThemeToggle — a button that cycles through light / dark / system themes.
 *
 * Props:
 *  - theme: 'light' | 'dark' (resolved theme)
 *  - preference: 'light' | 'dark' | 'system'
 *  - onToggle: () => void
 */
export function ThemeToggle({ theme, preference, onToggle }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  // Icon reflects current state
  let icon;
  let label;
  if (preference === 'system') {
    icon = '💻';
    label = 'Current theme: follow system. Click to switch to light mode.';
  } else if (preference === 'dark') {
    icon = '🌙';
    label = 'Current theme: dark mode. Click to switch to system mode.';
  } else {
    icon = '☀️';
    label = 'Current theme: light mode. Click to switch to dark mode.';
  }

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-label={label}
      title={label}
      type="button"
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {icon}
      </span>
      {preference === 'system' && (
        <span className="theme-toggle__badge" aria-hidden="true">
          auto
        </span>
      )}
    </button>
  );
}
