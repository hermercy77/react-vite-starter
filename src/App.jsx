import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="main">
        <h1>Welcome to React Vite Starter</h1>
        <p>Edit src/App.jsx and save to reload.</p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
