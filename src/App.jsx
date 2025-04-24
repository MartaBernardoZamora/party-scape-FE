import './App.css'
import AppRouter from './routes/AppRouter'
import { WebSocketProvider } from './contexts/WebSocketContext'

function App() {
  return (
    <WebSocketProvider>
      <AppRouter/>
    </WebSocketProvider>
  )
}

export default App
