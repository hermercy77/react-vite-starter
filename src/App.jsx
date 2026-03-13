import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import './App.css';

function App() {
  const { preference, resolved, source, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header resolved={resolved} onToggleTheme={toggleTheme} />
      <main className="app__content">
        <h2 className="app__heading">Hello, World!</h2>
        <p className="app__description">
          A React + Vite starter with a complete dark mode theming system.
          Click the toggle button in the header to switch themes.
        </p>
        <div className="app__theme-info">
          <p>
            Preference: <code>{preference}</code> · Resolved:{' '}
            <code>{resolved}</code> · Source: <code>{source}</code>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
