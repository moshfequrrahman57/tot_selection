import React from 'react';
import { useState, useRef, useEffect } from 'react';

const QuizSubmitButton = ({ onValidateAndSubmit, isSubmitted, totalAnswered, isActive }) => {
  
  const [timeSpent, setTimeSpent] = useState(0); 
  const timerRef = useRef(null);
  const isSubmittingRef = useRef(false);

  // 🎯 প্যারেন্ট ফাংশনটিকে রেফ-এ রাখা হলো ক্লোজার সমস্যা এড়াতে
  const onSubmitRef = useRef(onValidateAndSubmit);
  useEffect(() => {
    onSubmitRef.current = onValidateAndSubmit;
  }, [onValidateAndSubmit]);

  // ইভেন্ট হ্যান্ডলার
  const handleVisibilityChangeGlobal = () => {
    if (document.hidden && !isSubmittingRef.current) {
      handleQuizSubmit("সতর্কবার্তা: আপনি অন্য ট্যাব বা অ্যাপে গেছেন! আপনার কুইজ অটো-সাবমিট করা হলো।");
    }
  };

  const handleBlurGlobal = () => {
    if (!isSubmittingRef.current) {
      handleQuizSubmit("সতর্কবার্তা: আপনি পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছেন! আপনার কুইজ অটো-সাবমিট করা হলো।");
    }
  };

  const removeAllListeners = () => {
    document.removeEventListener("visibilitychange", handleVisibilityChangeGlobal);
    window.removeEventListener("blur", handleBlurGlobal);
  };

  // সেন্ট্রাল সাবমিট ফাংশন
  const handleQuizSubmit = (message) => {
    if (isSubmitted || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    removeAllListeners();
    clearInterval(timerRef.current);
    
    // রিয়্যাক্ট রেন্ডার সাইকেলের বাইরে ডেটা প্রসেস করার জন্য safe execution
    if (onSubmitRef.current) {
      onSubmitRef.current();
    }

    // alert সবার শেষে দেওয়া হলো যাতে ডেটা অলরেডি API-তে চলে যায়
    if (message) {
      setTimeout(() => {
        alert(message);
      }, 50);
    }
  };

  // টাইমার ইফেক্ট
  useEffect(() => {
    if (!isActive || isSubmitted || isSubmittingRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeSpent((prevTime) => {
        if (prevTime >= 59) { 
          clearInterval(timerRef.current);
          handleQuizSubmit("আপনার পরীক্ষার নির্ধারিত সময় শেষ। উত্তর অটোমেটিক সাবমিট করা হচ্ছে।");
          return 0; 
        }
        return prevTime + 1; 
      });
    }, 1000);

    return () => clearInterval(timerRef.current); 
  }, [isActive, isSubmitted]);

  // ট্যাব চেঞ্জ ইফেক্ট
  useEffect(() => {
    if (!isActive || isSubmitted) return;

    document.addEventListener("visibilitychange", handleVisibilityChangeGlobal);
    window.addEventListener("blur", handleBlurGlobal);

    return () => {
      removeAllListeners();
    };
  }, [isActive, isSubmitted]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-10">
      <div>
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">কুইজ অগ্রগতি (Quiz Progress)</h4>
        
        <div className="flex items-center space-x-4 mx-1 sm:mx-0 ">
          <p className="text-xs text-slate-500 mt-0.5">
            Answered Question: <span className="font-semibold text-indigo-600 text-sm">{totalAnswered}</span> 
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Elapsed Time: <span className="font-semibold text-indigo-600 text-sm">{timeSpent}s</span> /60s
          </p>
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => handleQuizSubmit()} 
        disabled={isSubmitted}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all disabled:bg-slate-300 text-sm"
      >
        {isSubmitted ? 'জমা হয়েছে...' : 'কুইজ সাবমিট করুন'}
      </button>
    </div>
  );
};

export default QuizSubmitButton;
