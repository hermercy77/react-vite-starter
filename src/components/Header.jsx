import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">React Vite Starter</h1>
        <nav className="header__actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>
      </div>
    </header>
  );
}
