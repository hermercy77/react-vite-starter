import { useState } from 'react'
import { Clock } from './components/Clock'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Vite Starter 🚀</h1>
        <p>欢迎使用 React + Vite 模板项目</p>
      </header>
      <main className="app-main">
        <Clock hourCycle="h24" showSeconds={true} showDate={true} />
      </main>
      <div className="card">
        <button onClick={() => setCount(c => c + 1)}>
          点击次数：{count}
        </button>
      </div>
    </div>
  )
}

export default App
