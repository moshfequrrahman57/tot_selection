import React, { useState } from 'react';
import brandlogo from '../assets/vite.svg';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={brandlogo} alt="Logo" className="h-10 w-10" />
            <a href="#" className="text-xl font-bold text-gray-800 ml-3">
              ToT Selection Exam
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Registration</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Log In</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Instructions</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Exam Panel</a>
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
          <a href="#" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">Registration</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">Log In</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">Instructions</a>
          <a href="#" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-blue-600 text-lg font-medium border-b border-gray-100 pb-2">Exam Panel</a>
        </div>
      </div>
    </nav>
  );
}
