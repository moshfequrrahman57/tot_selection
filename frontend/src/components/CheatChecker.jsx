import React, { useState, useEffect, useRef } from "react";

// প্যারেন্ট থেকে onAutoSubmit ফাংশনটি props হিসেবে নেওয়া হচ্ছে
export default function CheatChecker({ onAutoSubmit }) {
  const [isActive, setIsActive] = useState(false); 
  const [timeSpent, setTimeSpent] = useState(0); // ০ থেকে সময় গণনা শুরু হবে
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeSpent((prevTime) => {
        // যদি ৬০ সেকেন্ড অতিবাহিত হয়ে যায়
        if (prevTime >= 59) { 
          clearInterval(timerRef.current);
          setIsActive(false);
          alert("আপনার পরীক্ষার নির্ধারিত ৬০ সেকেন্ড সময় শেষ। উত্তর অটোমেটিক সাবমিট করা হচ্ছে।");
          if (onAutoSubmit) onAutoSubmit(); // প্যারেন্টের সাবমিট ফাংশন কল হবে
          return 60;
        }
        return prevTime + 1; // প্রতি সেকেন্ডে ১ করে বাড়বে
      });
    }, 1000);

    return () => clearInterval(timerRef.current); 
  }, [isActive, onAutoSubmit]);

  // ট্যাব পরিবর্তন বা ফোকাস হারানোর সিকিউরিটি লজিক
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        clearInterval(timerRef.current);
        setIsActive(false);
        setTimeSpent(60);
        alert("সতর্কবার্তা: আপনি অন্য ট্যাব বা অ্যাপে গেছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
        if (onAutoSubmit) onAutoSubmit();
      }
    };

    const handleBlur = () => {
      if (isActive) {
        clearInterval(timerRef.current);
        setIsActive(false);
        setTimeSpent(60);
        alert("সতর্কবার্তা: আপনি পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
        if (onAutoSubmit) onAutoSubmit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isActive, onAutoSubmit]);

  const handleStartButtonClick = () => {
    if (isActive) {
      setIsActive(false);
      clearInterval(timerRef.current);
    } else {
      if (timeSpent < 60) {
        setIsActive(true);
      }
    }
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 border p-4 bg-gray-50 rounded-lg shadow-sm mb-6">
      <h1 className="text-2xl font-bold text-gray-800">১২৫ UITRCE মাস্টার ট্রেইনার সিলেকশন পরীক্ষা</h1>
      
      <div className="flex items-center justify-between space-x-4 mt-2 text-gray-600">
        <h3>সময়সীমা: ৬০ সেকেন্ড (টেস্টিং)</h3>
        <h3>পূর্ণমান: ১০০</h3>
      </div>
      
      <div className="flex items-center justify-between space-x-4 mt-4 border-t-2 pt-2">
        {/* এখানে অতিবাহিত সময় ফরম্যাট করে দেখানো হচ্ছে */}
        <h3 className="text-lg font-semibold text-blue-600">
          Time Elapsed: 00:{timeSpent < 10 ? `0${timeSpent}` : timeSpent} / 00:60
        </h3>
        <button
          onClick={handleStartButtonClick}
          className={`text-white px-4 py-2 rounded font-medium transition ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isActive ? "Pause Exam" : "Start Exam"}
        </button>
      </div>
    </div>
  );
}
