import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function App() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">React Vite Starter</h1>
        <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
      </header>
      <main className="app__main">
        <p>Welcome! Click the theme toggle to switch between light and dark mode.</p>
        <button
          className="app__test-btn"
          onClick={() => alert('测试成功！🎉')}
        >
          点击测试
        </button>
      </main>
    </div>
  );
}

export default App;
