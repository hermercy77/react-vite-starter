import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export function Header({ resolved, onToggleTheme }) {
  return (
    <header className="header">
      <h1 className="header__title">React Vite Starter</h1>
      <div className="header__actions">
        <ThemeToggle resolved={resolved} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
