import React from 'react';
import { useState, useRef, useEffect } from 'react';

const QuizSubmitButton = ({ onValidateAndSubmit, isSubmitted, totalAnswered, isActive }) => {
  
  const [timeSpent, setTimeSpent] = useState(0); 
  const timerRef = useRef(null);
  
  // 🔒 গ্লোবাল লক: এই রিফটি নিশ্চিত করবে পুরো কম্পোনেন্টে যেকোনো উপায়ে সাবমিট একবারই হবে
  const isSubmittingRef = useRef(false);

  // 🎯 সেন্ট্রাল সাবমিট ফাংশন (সব ধরণের সাবমিট এখান থেকে হ্যান্ডেল হবে সেফলি)
  const handleQuizSubmit = (message) => {
    // অলরেডি সাবমিট হয়ে থাকলে বা সাবমিট প্রসেস চলতে থাকলে আর ভেতরে ঢুকবে না
    if (isSubmitted || isSubmittingRef.current) return;
    
    // সাথে সাথে লক করে দিন যাতে সেকেন্ডের ভগ্নাংশেও অন্য কোনো ইভেন্ট ফায়ার হতে না পারে
    isSubmittingRef.current = true;
    
    clearInterval(timerRef.current);
    setTimeSpent(60);
    
    if (message) {
      console.log("Submit triggered with message:", message);
      alert(message);
    } else {
      console.log("Manual submit triggered");
    }
    
    // রেন্ডারিং সাইকেলের বাইরে সেফলি প্যারেন্ট স্টেট আপডেট করার জন্য
    if (onValidateAndSubmit) onValidateAndSubmit();
  };

  // ১. টাইমার কাউন্টডাউন ইফেক্ট (৬০ সেকেন্ড পূর্ণ হলে সাবমিট)
  useEffect(() => {
    if (!isActive || isSubmitted || isSubmittingRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeSpent((prevTime) => {
        if (prevTime >= 59) { 
          clearInterval(timerRef.current);
          
          // 🛑 স্টেট আপডেটের বাইরে এসে সেফলি সাবমিট কল করা হচ্ছে
          setTimeout(() => {
            handleQuizSubmit("আপনার পরীক্ষার নির্ধারিত ৬০ সেকেন্ড সময় শেষ। উত্তর অটোমেটিক সাবমিট করা হচ্ছে।");
          }, 0);
          
          return 60; 
        }
        return prevTime + 1; 
      });
    }, 1000);

    return () => clearInterval(timerRef.current); 
  }, [isActive, isSubmitted]); // onValidateAndSubmit এখানে না দিলেও চলবে কারণ আমরা handleQuizSubmit ব্যবহার করছি

  // ২. ট্যাব পরিবর্তন বা উইন্ডো ফোকাস হারানোর ইফেক্ট (প্রটেকশন)
  useEffect(() => {
    if (!isActive || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmittingRef.current) {
        handleQuizSubmit("সতর্কবার্তা: আপনি অন্য ট্যাব বা অ্যাপে গেছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
      }
    };

    const handleBlur = () => {
      // alert দেওয়ার কারণে ব্রাউজার নিজে থেকে যে blur ফায়ার করে, তা এখানে আটকে যাবে
      if (!isSubmittingRef.current) {
        handleQuizSubmit("সতর্কবার্তা: আপনি পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
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
        onClick={() => handleQuizSubmit()} // ম্যানুয়াল ক্লিকের সময় কোনো অ্যালার্ট দেখাবে না, সরাসরি সাবমিট হবে
        disabled={isSubmitted}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all disabled:bg-slate-300 text-sm"
      >
        {isSubmitted ? 'জমা হয়েছে...' : 'কুইজ সাবমিট করুন'}
      </button>
    </div>
  );
};

export default QuizSubmitButton;
