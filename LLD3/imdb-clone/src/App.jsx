import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRouter from './routes/AppRouter'
import { WatchlistProvider } from './context/WatchlistContext'

function App() {
  return (
    <BrowserRouter>
      <WatchlistProvider>
        <AppRouter/>
      </WatchlistProvider>
    </BrowserRouter>
  )
}

export default App
