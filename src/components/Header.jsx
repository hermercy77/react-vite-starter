import { ThemeToggle } from './ThemeToggle.jsx';
import './Header.css';

/**
 * Header — sticky top bar with app title and theme toggle.
 *
 * Props:
 *  - theme: 'light' | 'dark'
 *  - preference: 'light' | 'dark' | 'system'
 *  - onToggleTheme: () => void
 */
export function Header({ theme, preference, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">React Vite Starter</h1>
        <nav className="header__actions">
          <ThemeToggle
            theme={theme}
            preference={preference}
            onToggle={onToggleTheme}
          />
        </nav>
      </div>
    </header>
  );
}
