import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="app__main">
        <div className="app__content">
          <h2 className="app__heading">Welcome</h2>
          <p className="app__text">
            This is a React + Vite starter with dark mode support.
          </p>
          <p className="app__text app__text--secondary">
            Click the{' '}
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>{' '}
            button in the header to toggle between light and dark themes.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
