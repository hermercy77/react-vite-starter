import React from 'react';
import Header from './components/Header.jsx';
import { useTheme } from './hooks/useTheme.js';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main">
        <h2>Welcome to React Vite Starter</h2>
        <p>Click the theme toggle button in the header to switch between light and dark mode.</p>
      </main>
    </div>
  );
}

export default App;
