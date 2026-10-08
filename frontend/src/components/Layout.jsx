import React, { useState ,useContext, useEffect} from 'react';
import brandlogo from '../assets/vite.svg';
import { Link, Outlet } from 'react-router-dom';
import { NotebookTextIcon} from 'lucide-react'; // Optional: install lucide-react for sharp icons
import { AuthContext } from './AuthContext';
import Loader from './Loader';

export default function Layout() {
    const [isOpen, setIsOpen] = useState(false);
  
    // কনটেক্সট থেকে ইউজার ডেটা এবং লোডিং স্টেট নিয়ে আসা
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <Loader/>
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
             <Link to="/" className="text-md font-bold text-gray-800 ml-3">
              Trainer Selection Exam
            </Link>
           
           
          </div>

          {/* Desktop Navigation Links */}
          <div className=" flex items-center md:space-x-8">
            <div className="hidden md:flex items-center space-x-6">
              {!user && (
              <>
                <Link to="/signup" className="text-gray-600 hover:text-blue-600 font-medium">
                  Registration
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Log In
                </Link>
               
              </>
            )}
            
              <Link to="/instructions" className="text-gray-600 hover:text-blue-600 font-medium">
              Instructions
            </Link>

            <Link to="/exam" className="text-gray-600 hover:text-blue-600 font-medium">
              Exam Panel
            </Link>
            <Link to="/helpdesk2" className="text-gray-600 hover:text-blue-600 font-medium">Helpdesk</Link>
             <Link to="/admin" className=" text-orange-600 hover:text-green-600 font-medium">Admin</Link>
            </div>
           
            <div>
            {user && (
  <Link to="/profile" className='text-gray-600 hover:text-indigo-600 font-medium flex items-center'>
    <div className="flex items-center md:space-x-2 md:bg-slate-100 space-x-3 md:py-1.5 md:px-3 rounded-full hover:bg-indigo-50 transition-colors">
      <svg className="h-7 w-7 text-red-600 " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm font-semibold text-gray-700 hidden md:block">{user?.name || "Not Logged In"}</span>
    </div>
  </Link>
)}
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
          {!user && (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
                Registration
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
                Log In
              </Link>
              
            </>
          )}
            <Link to="/instructions" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Instructions
          </Link>

          <Link to="/exam" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Exam Panel
          </Link>

            
          <Link to="/helpdesk2" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">
            Help Desk
          </Link>
          <Link to="/admin" onClick={() => setIsOpen(false)} className="text-orange-600 hover:text-green-600 text-lg font-medium border-b border-gray-100 pb-2">
            Admin
          </Link>
            
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
