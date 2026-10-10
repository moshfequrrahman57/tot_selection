import React, { useState } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  Navigate
} from 'react-router-dom';

// Standard App Components & Layout
import './App.css';
import Layout from './components/Layout.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import ExamPage from './components/ExamPage.jsx';
import InstructionsPage from './components/InstructionPage.jsx';
import ProfileSummary from './components/ProfileSummary.jsx';
import HomePage from './components/HomePage.jsx';
import Profile from './components/Profile.jsx';
import Pdf_Download from './components/Pdf_Download.jsx';
import Helpdesk from './components/Helpdesk.jsx';
import Helpdesk2 from './components/Helpdesk2.jsx';

// Admin Components & Admin Layout
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminUsers from './components/admin/AdminUsers.jsx';
import UsersAnswers from './components/admin/UsersAnswers.jsx';
import AdminQuestions from './components/admin/AdminQuestions.jsx';
import AdminMarksheet from './components/admin/AdminMarksheet.jsx';
import SubmittedSuccessfully from './components/LumSumPage/SubmittedSuccessfully.jsx'

// createBrowserRouter Configuration with Separate Routers/Layouts
const router = createBrowserRouter([
  // 1. Admin Routes with AdminLayout
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "answers",
        element: <UsersAnswers />
      },
      {
        path: "questions",
        element: <AdminQuestions />
      },
      {
        path: "marksheet",
        element: <AdminMarksheet />
      },
      {
        path: "*",
        element: <Navigate to="/admin" replace />
      }
    ]
  },
  // 2. Main Application Routes with standard Layout
  {
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
        element: <ExamPage />
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
        path: "/submitted",
        element: <SubmittedSuccessfully/>
      },
      {
        path: "*",
        element: <Navigate to="/instructions" replace />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
