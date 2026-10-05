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


    // 3. Kick the user out to the login page
    // Using { replace: true } prevents them from clicking the browser's "Back" button to return
      window.location.href = '/login'; 
  };


if(loading) return <p> Loading profile.....</p>

    return(
       <>
  <div className="w-full max-w-xl mx-auto my-10 p-5 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
    
    <div className="flex items-center justify-between border-b pb-4 mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">User Profile</h2>
      <button 
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg text-sm sm:text-base transition-colors duration-200"
      >
        Log Out
      </button>
    </div>
    
    <div className="space-y-3 text-left">
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">Name:</span> {user?.name}
      </p>
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">Phone No:</span> {user?.phone}
      </p>
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">Division:</span> {user?.division}
      </p>
      {/* 🟢 Fixed repeated "Phone No" labels below */}
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">District:</span> {user?.district}
      </p>
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">Upazila:</span> {user?.upazila}
      </p>
      <p className="text-gray-700 text-base sm:text-lg">
        <span className="font-semibold text-gray-900 block sm:inline">Institute:</span> {user?.institute}
      </p>
    </div>

  </div>


        </>
    )
}