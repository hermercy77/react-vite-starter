import './ThemeToggle.css';

/**
 * A button that toggles between light and dark themes.
 *
 * Props:
 *  - resolvedTheme: 'light' | 'dark'
 *  - onToggle: () => void
 */
export function ThemeToggle({ resolvedTheme, onToggle }) {
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
