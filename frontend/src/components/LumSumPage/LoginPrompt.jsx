import React from 'react';
import { Lock, LogIn } from 'lucide-react'; // আইকনের জন্য lucide-react ব্যবহার করা হয়েছে
import {useNavigate} from 'react-router-dom';

const LoginPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-92 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 shadow-sm max-w-lg mx-auto my-8">
      {/* আইকন কন্টেইনার */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Lock className="w-8 h-8 text-blue-600" />
      </div>

      {/* প্রধান বার্তা */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        অনলাইন পরীক্ষায় অংশ নিতে আগে লগইন করুন
      </h2>
      
      <p className="text-gray-500 text-center mb-8 max-w-sm">
        পরীক্ষাটি শুরু করার জন্য আপনার অ্যাকাউন্ট ভেরিফিকেশন প্রয়োজন। দয়া করে নিচে ক্লিক করে লগইন সম্পন্ন করুন।
      </p>

      {/* লগইন বাটন */}
      <button
        onClick={() => {
          navigate('/login');
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
      >
        <LogIn className="w-5 h-5" />
        এখনই লগইন করুন
      </button>
    </div>
  );
};

export default LoginPrompt;
