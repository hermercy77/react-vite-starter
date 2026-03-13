import { Clock } from './components/Clock';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Vite Starter</h1>
      </header>
      <main className="app-main">
        <Clock hourCycle="h24" showSeconds={true} showDate={true} />
      </main>
    </div>
  );
}

export default App;
