import './ThemeToggle.css';

export function ThemeToggle({ resolved, onToggle }) {
  const isDark = resolved === 'dark';
  const icon = isDark ? '☀️' : '🌙';
  const ariaLabel = isDark ? '切换到浅色模式' : '切换到深色模式';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
