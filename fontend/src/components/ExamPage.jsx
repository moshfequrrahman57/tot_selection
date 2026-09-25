{/* Here some directional message and some important data exibition */}

import React, { useState, useEffect, useRef } from "react";

export default function ExamPage() {
  const [isActive, setIsActive] = useState(false); // পরীক্ষা চলছে কিনা
  const [timeLeft, setTimeLeft] = useState(60); // ১ মিনিট বা ৬০ সেকেন্ড
  const timerRef = useRef(null);

  useEffect(()=>{
    
    if(isActive && timeLeft > 0){
      timerRef.current=setInterval(()=>{
        setTimeLeft((prevTime) => prevTime - 1);
      },1000);

    }
    else if(timeLeft==0){
      clearInterval(timerRef.current);
      alert("সময় শেষ! আপনার পরীক্ষাটি স্বয়ংক্রিয়ভাবে সাবমিট করা হচ্ছে।");
      setIsActive(false);
    }
    
    return () => clearInterval(timerRef.current);

  },[isActive,timeLeft]);

  useEffect(()=>{
   const handleVisibilityChange = ()=>{
    if(document.hidden && isActive){
      clearInterval(timerRef.current);
      setIsActive(false);
      setTimeLeft(0);
      alert("সতর্কবার্তা: আপনি পরীক্ষা চলাকালীন অন্য ট্যাব বা অ্যাপে গেছেন! আপনার পরীক্ষা বাতিল করা হলো।");
    }
   };
   const handleBlur = ()=>{
    if(isActive){
      clearInterval(timerRef.current);
      setIsActive(false);
      setTimeLeft(0);
      alert("সতর্কবার্তা: আপনি পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছেন! পরীক্ষা বাতিল করা হলো।");
    }
   };

   document.addEventListener("visibilitychange",handleVisibilityChange);
   window.addEventListener("blur",handleBlur);

   return ()=>{
    document.removeEventListener("visibilitychange",handleVisibilityChange);
    window.removeEventListener("blur",handleBlur);
   };
    
  }, [isActive]);
 
  const handleStartButtonClick = () => {
    if (isActive) {
      // Stop বাটনে ক্লিক করলে
      setIsActive(false);
      clearInterval(timerRef.current);
      
    } else {
      // Start বাটনে ক্লিক করলে (যদি সময় বাকি থাকে)
      if (timeLeft > 0) {
        setIsActive(true);
      }
    }
  }
    
  return (
    

      <div className=" w-full min-h-screen  mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800">১২৫ UITRCE মাস্টার ট্রেইনার সিলেকশন পরীক্ষা</h1>
        <h3 className="mt-2"> </h3>
        <div className="flex items-center justify-between space-x-4 mt-2">
          <h3>সময় ১ ঘণ্টা </h3>
          <h3>পূর্ণমান ১০০ </h3>
        </div>
        <div className="flex items-center justify-between space-x-4 mt-4 border-t-2 pt-2">
          <h3>Time Remaining: 00:{timeLeft}</h3>
          <button
           onClick={handleStartButtonClick}
          className={`bg-blue-500 text-white px-4 py-2 rounded  ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
            {isActive ? "Stop" : "Start"}
          </button>
        </div>
      </div>

  )

}