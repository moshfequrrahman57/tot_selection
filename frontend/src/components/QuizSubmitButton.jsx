import React from 'react';
import {useState, useRef, useEffect} from 'react';
const QuizSubmitButton = ({ onValidateAndSubmit, isSubmitted, totalAnswered, isActive }) => {
  
    const [timeSpent, setTimeSpent] = useState(0); // ০ থেকে সময় গণনা শুরু হবে
    const timerRef = useRef(null);

    
    useEffect(() => {
        if (!isActive) return;
    
        timerRef.current = setInterval(() => {
          setTimeSpent((prevTime) => {
            // যদি ৬০ সেকেন্ড অতিবাহিত হয়ে যায়
            if (prevTime >= 59) { 
              clearInterval(timerRef.current);
              
              alert("আপনার পরীক্ষার নির্ধারিত ৬০ সেকেন্ড সময় শেষ। উত্তর অটোমেটিক সাবমিট করা হচ্ছে।");
              if (onValidateAndSubmit) onValidateAndSubmit(); // প্যারেন্টের সাবমিট ফাংশন কল হবে
              return 60;
            }
            return prevTime + 1; // প্রতি সেকেন্ডে ১ করে বাড়বে
          });
        }, 1000);
    
        return () => clearInterval(timerRef.current); 
      }, [isActive, onValidateAndSubmit]);
    useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.hidden && isActive) {
            clearInterval(timerRef.current);
            
            setTimeSpent(60);
            alert("সতর্কবার্তা: আপনি অন্য ট্যাব বা অ্যাপে গেছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
            if (onValidateAndSubmit) onValidateAndSubmit();
          }
        };
    
        const handleBlur = () => {
          if (isActive) {
            clearInterval(timerRef.current);
            
            setTimeSpent(60);
            alert("সতর্কবার্তা: আপনি পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছেন! আপনার পরীক্ষা বাতিল ও অটো-সাবমিট করা হলো।");
            if (onValidateAndSubmit) onValidateAndSubmit();
          }
        };
    
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
    
        return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          window.removeEventListener("blur", handleBlur);
        };
      }, [isActive, onValidateAndSubmit]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-10">
      <div>
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">কুইজ অগ্রগতি (Quiz Progress)</h4>
        
        <div className="flex items-center space-x-4 mx-1 sm:mx-0 ">
<p className="text-xs text-slate-500 mt-0.5">
          Answered Question:  <span className="font-semibold text-indigo-600 text-sm">{totalAnswered}</span> 
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
         Elapsed Time:  <span className="font-semibold text-indigo-600 text-sm">{timeSpent}s</span> /60s
        </p>
        </div>

      </div>
      
      <button
        type="button"
        onClick={onValidateAndSubmit}
        disabled={isSubmitted}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all disabled:bg-slate-300 text-sm"
      >
        {isSubmitted ? 'জমা হয়েছে...' : 'কুইজ সাবমিট করুন'}
      </button>
    </div>
  );
};

export default QuizSubmitButton;
