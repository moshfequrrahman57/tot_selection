import React, { useState } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
} from 'react-router-dom';

// আপনার কম্পোনেন্টগুলোর ইমপোর্ট (বাকিগুলো আপনার কোড অনুযায়ী নিশ্চিত করে নেবেন)
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

// অন্যান্য কম্পোনেন্ট যেমন Layout, LoginPage, ExamPage ইত্যাদি এখানে ইমপোর্ট করা থাকবে...

// ১. রাউটার অবজেক্ট তৈরি (createBrowserRouter ব্যবহার করে)
const router = createBrowserRouter([
  {
    // Parent route using the layout container
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/instructions" replace />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignUpPage />
      },
      {
        path: "/exam",
        element: <ExamPage /> // এই কম্পোনেন্টের ভেতরে এখন আপনি useBlocker ব্যবহার করতে পারবেন
      },
      {
        path: "/instructions",
        element: <InstructionsPage />
      },
      {
        path: "/profilepage",
        element: <ProfileSummary />
      },
      {
        path: "/homepage",
        element: <HomePage />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/pdf",
        element: <Pdf_Download />
      },
      {
        path: "/helpdesk",
        element: <Helpdesk />
      },
      {
        path: "/helpdesk2",
        element: <Helpdesk2 />
      },
      {
        path: "*",
        element: <Navigate to="/instructions" replace />
      }
    ]
  }
]);

function App() {
  // কাউন্টার স্টেট যদি আপনার অ্যাপের অন্য কোথাও প্রয়োজন হয়
  const [count, setCount] = useState(0);

  // ২. RouterProvider দিয়ে রাউটারটি রিটার্ন করা
  return <RouterProvider router={router} />;
}

export default App;
