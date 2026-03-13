import { useTheme } from './hooks/useTheme.js';
import { Header } from './components/Header.jsx';
import './App.css';

function App() {
  const { theme, preference, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header
        theme={theme}
        preference={preference}
        onToggleTheme={toggleTheme}
      />
      <main className="app__main">
        <section className="app__hero">
          <h2 className="app__hero-title">Welcome</h2>
          <p className="app__hero-description">
            This is a React + Vite starter with a complete dark mode theming
            system. Click the theme toggle button in the header to switch
            between <strong>light</strong>, <strong>dark</strong>, and{' '}
            <strong>system</strong> modes.
          </p>
          <div className="app__theme-info">
            <span className="app__theme-badge">
              Preference: <code>{preference}</code>
            </span>
            <span className="app__theme-badge">
              Applied: <code>{theme}</code>
            </span>
          </div>
        </section>

        <section className="app__demo-cards">
          <div className="app__card">
            <h3>Persistent</h3>
            <p>
              Your theme choice is saved to <code>localStorage</code> and
              restored on next visit — no flash of wrong theme.
            </p>
          </div>
          <div className="app__card">
            <h3>System Aware</h3>
            <p>
              In &ldquo;system&rdquo; mode the app follows your OS dark/light
              preference in real time.
            </p>
          </div>
          <div className="app__card">
            <h3>Accessible</h3>
            <p>
              Color contrast meets WCAG AA (≥ 4.5:1). The toggle has proper
              <code>aria-label</code> and keyboard support.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
