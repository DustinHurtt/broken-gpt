
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Conversation from './pages/Conversation'
import HomePage from './pages/HomePage'


function App() {


  return (
    <div className='App'>

      <Routes>

        <Route path='/' element={<HomePage />} />
        <Route path='/new-conversation' element={<Conversation />} />

      </Routes>


    </div>
  )
}

export default App
