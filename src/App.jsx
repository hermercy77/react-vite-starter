import { useState } from 'react'
import Clock from './components/Clock'
import Footer from './components/Footer'
import './App.css'

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem('theme') ||
      localStorage.getItem('theme-preference') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  });

  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Apply theme to DOM and persist
  useState(() => {
    applyTheme(theme);
  });

  // Sync theme to DOM and localStorage whenever it changes
  const { useEffect } = require('react');

  return { theme, setTheme, applyTheme };
};

import { useEffect } from 'react'

function App() {
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem('theme') ||
      localStorage.getItem('theme-preference') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  });

  // Sync theme to DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Migrate old key if present
    if (localStorage.getItem('theme-preference')) {
      localStorage.removeItem('theme-preference');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      <main className="app-main">
        <Clock />
      </main>
      <Footer />
    </div>
  )
}

export default App
