import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuizSuccessShort() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4 max-w-sm mx-auto bg-white border border-emerald-100 rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className=" flex items-center justify-center h-8 w-8 rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-800">Quiz submitted successfully!</p>
      </div>

    </div>
  );
}
