import { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import Home from './pages/Home';
import TestPage from './pages/TestPage';
import { getCurrentRoute } from './utils/navigate';
import './App.css';

function App() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handleRouteChange = () => setRoute(getCurrentRoute());
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const renderPage = () => {
    switch (route) {
      case '/test':
        return <TestPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">React Vite Starter</h1>
        <ThemeToggle resolvedTheme={resolvedTheme} onToggle={toggleTheme} />
      </header>
      {renderPage()}
    </div>
  );
}

export default App;
