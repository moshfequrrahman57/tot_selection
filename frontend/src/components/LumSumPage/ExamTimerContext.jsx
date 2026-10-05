import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const timerRef = useRef(null);

  // পরীক্ষা শুরু করার ফাংশন
  const startExam = (durationInSeconds) => {
    const now = Date.now();
    const expiryTime = now + durationInSeconds * 1000;
    
    // সেশন স্টোরেজে শেষ হওয়ার সময়টি সেভ করে রাখছি
    sessionStorage.setItem('exam_expiry_time', expiryTime.toString());
    sessionStorage.setItem('is_exam_active', 'true');
    
    setIsExamActive(true);
    setTimeLeft(durationInSeconds);
  };

  // পরীক্ষা শেষ/সাবমিট করার ফাংশન
  const endExam = () => {
    clearInterval(timerRef.current);
    sessionStorage.removeItem('exam_expiry_time');
    sessionStorage.removeItem('is_exam_active');
    setIsExamActive(false);
    setTimeLeft(0);
    // এখানে আপনার সাবমিট লজিক কল করতে পারেন
  };

  // ব্যাকগ্রাউন্ডে টাইমার টিক-টক করার লজিক (পেজ চেঞ্জ হলেও এটি সচল থাকবে)
  useEffect(() => {
    const savedActive = sessionStorage.getItem('is_exam_active') === 'true';
    const savedExpiry = sessionStorage.getItem('exam_expiry_time');

    if (savedActive && savedExpiry) {
      setIsExamActive(true);
      
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((parseInt(savedExpiry) - now) / 1000));
        
        if (remaining <= 0) {
          endExam(); // সময় শেষ হলে অটো সাবমিট
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isExamActive]);

  return (
    <TimerContext.Provider value={{ timeLeft, isExamActive, startExam, endExam }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
