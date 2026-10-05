import React, { useState ,useContext} from 'react';
import brandlogo from '../assets/vite.svg';
import { Link, Outlet } from 'react-router-dom';
import {HomeIcon, NotebookTextIcon} from 'lucide-react'; // Optional: install lucide-react for sharp icons
import { AuthContext } from './AuthContext';

export default function Layout() {
    const [isOpen, setIsOpen] = useState(false);
    // কনটেক্সট থেকে ইউজার ডেটা এবং লোডিং স্টেট নিয়ে আসা
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <span className="loading loading-bars  loading-lg md:loading-xl"></span>
  )

    
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      
      {/* 🏗️ Common Header */}
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NotebookTextIcon className="h-5 w-5 text-indigo-600" />
            <Link to="/" className="text-xl font-bold text-gray-800 ml-3">
              Trainer Selection Exam
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/signup" className="text-gray-600 hover:text-blue-600 font-medium">
              Registration
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
              Log In
            </Link>
            <Link to="/instructions" className="text-gray-600 hover:text-blue-600 font-medium">
              Instructions
            </Link>
            <Link to="/exam" className="text-gray-600 hover:text-blue-600 font-medium">
              Exam Panel
            </Link>
            <Link to="/profile" className='text-gray-600 hover:text-blue-600 font-medium'>
            {user ? (<h4>{user.name}</h4>):(<h4>Not Log In</h4>)}
            </Link>
            <Link to="/pdf" className="text-gray-600 hover:text-blue-600 font-medium">
              Pdf
            </Link>
            <Link to="instructions#helpdesk" className="text-gray-600 hover:text-blue-600 font-medium">Helpdesk</Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg  className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop (Darkens screen when menu is open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-60 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right Side Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${ isOpen ? 'translate-x-0' : 'translate-x-full' }`}>
        {/* Close Button Inside Sidebar */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col px-6 space-y-4">
          <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Registration
          </Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Log In
          </Link>
          <Link to="/instructions" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Instructions
          </Link>
          <Link to="/exam" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Exam Panel
          </Link>
           <Link to="/profile" className='text-gray-600 hover:text-blue-600 font-medium'>
            {user ? (<h4>{user.name}</h4>):(<h4>Not Log In</h4>)}
            </Link>
            <Link to="/pdf" className="text-gray-600 hover:text-blue-600 font-medium">
              Pdf
            </Link>
            <Link to="instructions#helpdesk" className="text-gray-600 hover:text-blue-600 font-medium">Helpdesk</Link>
            
        </div>
      </div>
    </nav>

      {/* 📥 Content Area where child routes render */}
      <main className="flex flex-col items-center w-full pt-3 pb-3 min-h-screen bg-slate-300">
        <Outlet />
      </main>

    </div>
  );
}
