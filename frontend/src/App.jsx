import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar.jsx'
import ExamPage from './components/ExamPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import Layout from './components/Layout.jsx'
import InstructionsPage from './components/InstructionPage.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProfileSummary from './components/ProfileSummary.jsx'
import HomePage from './components/HomePage.jsx'
import Profile from './components/Profile.jsx'
import Pdf_Download from './components/Pdf_Download.jsx'
import Helpdesk from './components/Helpdesk.jsx'
import Helpdesk2 from './components/Helpdesk2.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
  
  <BrowserRouter>
      <Routes>
        
        {/* Parent route using the layout container */}
        <Route element={<Layout />}>
          {/* Redirect empty path straight to login */}
          <Route path="/" element={<Navigate to="/instructions" replace />} />
          
          {/* Child pages that share the header */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/exam" element={<ExamPage/>} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path='/profilepage' element={<ProfileSummary/>}/>
          <Route path='/homepage' element={<HomePage/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/pdf' element={<Pdf_Download/>}/>
          <Route path="*" element={<Navigate to="/instructions" replace />} />
          <Route path="/helpdesk" element={<Helpdesk/>} />
          <Route path="/helpdesk2" element={<Helpdesk2/>} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  
      
      
  )
}

export default App
