import React, { useContext } from "react";
import { AuthContext } from "./AuthContext"; // If using the Context API we built earlier
import { useNavigate } from 'react-router-dom';



export default function Profile(){
const {user,loading,setUser}=useContext(AuthContext);
const navigate=useNavigate();

const handleLogout = () => {
    // 1. Wipe the JWT token completely from the browser
    localStorage.removeItem('token');
    localStorage.removeItem('isQuizVerified');

    // 2. Clear the global React Auth state so the UI updates instantly
    if (setUser) {
      setUser(null);
    }

    // 3. Kick the user out to the login page
    // Using { replace: true } prevents them from clicking the browser's "Back" button to return
    navigate('/login', { replace: true });
  };


if(loading) return <p> Loading profile.....</p>

    return(
        <>
       <div className="w-screen mx-auto my-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
      
      <div className=" flex  items-center justify-between">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
        <button 
        onClick={handleLogout}
        className=" bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
      >
        Log Out
      </button>
      </div>
      
      <div className="space-y-3 text-left mb-6">
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Name:</span> {user?.name}</p>
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Phone No:</span> {user?.phone} </p>
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Division:</span> {user?.division} </p>
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Phone No:</span> {user?.district} </p>
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Phone No:</span> {user?.upazila} </p>
        <p className="text-gray-700 text-lg"><span className="font-semibold text-gray-900">Phone No:</span> {user?.institute} </p>
        
      </div>

      
    </div>
        </>
    )
}