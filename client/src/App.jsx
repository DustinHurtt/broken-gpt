
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Conversation from './pages/Conversation'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { AllConversations } from './pages/AllConversations'



function App() {


  return (
    <div className='App'>

      <Navbar />

      <Routes>

        <Route path='/' element={<HomePage />} />
        <Route path='/new-conversation' element={<Conversation />} />
        <Route path='/all-conversations' element={<AllConversations />} />

      </Routes>


    </div>
  )
}

export default App
