import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + Vite Starter 🚀</h1>
        <p>欢迎使用 React + Vite 模板项目</p>
        <div className="card">
          <button onClick={() => setCount(c => c + 1)}>
            点击次数：{count}
          </button>
        </div>
        <p className="tips">
          编辑 <code>src/App.jsx</code> 开始开发吧！
        </p>
      </header>
    </div>
  )
}

export default App
