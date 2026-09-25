import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar.jsx'
import ExamPage from './components/ExamPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import Layout from './components/Layout.jsx'
import InstructionsPage from './components/InstructionPage.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'



function App() {
  const [count, setCount] = useState(0)

  return (
  
  <BrowserRouter>
      <Routes>
        
        {/* Parent route using the layout container */}
        <Route element={<Layout />}>
          {/* Redirect empty path straight to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Child pages that share the header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/exam" element={<ExamPage/>} />
          <Route path="/instructions" element={<InstructionsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  
      
      
  )
}

export default App
