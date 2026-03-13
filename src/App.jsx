import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main">
        <h1>Hello, React + Vite!</h1>
      </main>
      <Footer />
    </div>
  );
}

export default App;
