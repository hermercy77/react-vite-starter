import { useTheme } from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const { preference, resolved, source, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app__header">
        <h1>React Vite Starter</h1>
        <ThemeToggle resolved={resolved} onToggle={toggleTheme} />
      </header>
      <main className="app__main">
        <p>Welcome to the React Vite Starter template.</p>
      </main>
      {import.meta.env.DEV && (
        <div className="app__theme-info">
          <p>
            Preference: <code>{preference}</code> · Resolved:{' '}
            <code>{resolved}</code> · Source: <code>{source}</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
