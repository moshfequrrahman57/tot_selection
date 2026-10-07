import React from 'react';
import { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'; 
const QuizSubmitButton = ({ onValidateAndSubmit, isSubmitted, totalAnswered, isActive }) => {
  
  const [timeSpent, setTimeSpent] = useState(0); 
  const timerRef = useRef(null);
  const isSubmittingRef = useRef(false);
  
  // ⏱️ ৫ সেকেন্ড ট্র্যাক করার জন্য Ref
  const blurTimeoutRef = useRef(null);
  const allowTimeRef = useRef(0);

  // প্যারেন্ট ফাংশনটিকে রেফ-এ রাখা হলো ক্লোজার সমস্যা এড়াতে
  const onSubmitRef = useRef(onValidateAndSubmit);
  useEffect(() => {
    onSubmitRef.current = onValidateAndSubmit;
  }, [onValidateAndSubmit]);

  // ✅ ১. সেন্ট্রাল সাবমিট ফাংশন
  const handleQuizSubmit = (message) => {
    if (isSubmitted || isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    removeAllListeners();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    if (onSubmitRef.current) {
      onSubmitRef.current();
    }

    if (message) {
      // রেন্ডারিং ও স্টেট আপডেটের সাথে যাতে ক্ল্যাশ না হয়, তাই alert-কে সামান্য ডিলে দেওয়া হলো
      setTimeout(() => {
        toast.dismiss();
        toast.error(message, {
          duration: 4000,
          position: 'top-center',
        });
      }, 50);
    }
  };

  // ✅ ২. ইউজার উইন্ডো বা ট্যাব ছেড়ে চলে গেলে যা হবে
  const handleUserLeft = (message) => {
    if (isSubmittingRef.current) return;

    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    blurTimeoutRef.current = setTimeout(() => {
      handleQuizSubmit(message);
    }, 5000); // ৫ সেকেন্ড
  };

  // ✅ ৩. ইউজার ৫ সেকেন্ডের মধ্যে ফিরে আসলে যা হবে
  const handleUserReturned = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
      console.log("ইউজার ৫ সেকেন্ডের মধ্যে ফিরে এসেছে, সাবমিট বাতিল করা হলো।");
      
      allowTimeRef.current = allowTimeRef.current + 1; 
      console.log("ট্যাব চেঞ্জের সংখ্যা: ", allowTimeRef.current);
      
      // 🚨 ৩ বার ট্যাব চেঞ্জ করলে (৩য় বার কুইজ অটো-সাবমিট)
      if (allowTimeRef.current >= 3) {
        handleQuizSubmit("সতর্কবার্তা: আপনি সর্বোচ্চ ২ বার সুযোগ পার করে ৩য় বার ট্যাব চেঞ্জ করেছেন! আপনার কুইজ অটো-সাবমিট করা হলো।");
      } else {
        // ১ ও ২ বারের জন্য সতর্কবার্তা অ্যালার্ট
        const currentCount = allowTimeRef.current;
        setTimeout(() => {
          toast.dismiss();
          if (currentCount === 1) {
            toast('⚠️ সতর্কবার্তা ১: আপনি ট্যাব পরিবর্তন করেছিলেন! ২য় বার সুযোগ পাবেন, ৩য় বার কুইজ অটো-সাবমিট হবে।', {
              duration: 5000,
              position: 'top-center',
              style: { background: '#FFF3CD', color: '#856404', fontWeight: 'bold' }
            });
          } else if (currentCount === 2) {
            toast.error('⚠️ চূড়ান্ত সতর্কবার্তা ২: এরপর আবার ট্যাব পরিবর্তন করলে কুইজ অটো-সাবমিট হয়ে যাবে!', {
              duration: 5000,
              position: 'top-center',
            });
          }
        }, 50);
      }
    }
  };

  // ✅ ৪. গ্লোবাল ইভেন্ট হ্যান্ডলার ফাংশনসমূহ
  const handleVisibilityChangeGlobal = () => {
    if (document.hidden) {
      handleUserLeft("সতর্কবার্তা: আপনি ৫ সেকেন্ডের বেশি সময় অন্য ট্যাব বা অ্যাপে ছিলেন! কুইজ অটো-সাবমিট করা হলো।");
    } else {
      handleUserReturned();
    }
  };

  const handleBlurGlobal = () => {
    handleUserLeft("সতর্কবার্তা: আপনি ৫ সেকেন্ডের বেশি সময় পরীক্ষার উইন্ডো থেকে ফোকাস হারিয়েছিলেন! কুইজ অটো-সাবমিট করা হলো।");
  };

  const handleFocusGlobal = () => {
    handleUserReturned();
  };

  const removeAllListeners = () => {
    document.removeEventListener("visibilitychange", handleVisibilityChangeGlobal);
    window.removeEventListener("blur", handleBlurGlobal);
    window.removeEventListener("focus", handleFocusGlobal);
  };

  // ⏱️ টাইমার ইফেক্ট (এখানে শুধু প্রতি সেকেন্ডে স্টেট বাড়ানো হবে, কোন সাবমিট লজিক থাকবে না)
  useEffect(() => {
    if (!isActive || isSubmitted || isSubmittingRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeSpent((prevTime) => {
        if (prevTime >= 60) {
          clearInterval(timerRef.current);
          return 60;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isSubmitted]);

  // 🎯 🟢 মূল সমাধান: সময় শেষ হওয়া ট্র্যাক করার জন্য আলাদা এবং নিরাপদ useEffect
  useEffect(() => {
    if (timeSpent >= 60 && !isSubmitted && !isSubmittingRef.current) {
      handleQuizSubmit("আপনার পরীক্ষার নির্ধারিত সময় শেষ। উত্তর অটোমেটিক সাবমিট করা হচ্ছে।");
    }
  }, [timeSpent, isSubmitted]);

  // ট্যাব চেঞ্জ এবং উইন্ডো ফোকাস ইফেক্ট
  useEffect(() => {
    if (!isActive || isSubmitted) return;

    document.addEventListener("visibilitychange", handleVisibilityChangeGlobal);
    window.addEventListener("blur", handleBlurGlobal);
    window.addEventListener("focus", handleFocusGlobal);

    return () => {
      removeAllListeners();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };
  }, [isActive, isSubmitted]);

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        containerStyle={{ zIndex: 99999 }}
      />
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
    </>
  );
};

export default QuizSubmitButton;
