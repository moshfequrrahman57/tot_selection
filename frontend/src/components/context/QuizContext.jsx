import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  // ১. সিলেক্টেড উত্তর লোকাল স্টোরেজে রাখা হচ্ছে যাতে কম্পোনেন্ট চেঞ্জ হলেও মুছে না যায়
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('quiz_selected_answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [isExamActive, setIsExamActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // উত্তর আপডেট করার গ্লোবাল ফাংশন
  const updateAnswers = (answers) => {
    setSelectedAnswers(answers);
    localStorage.setItem('quiz_selected_answers', JSON.stringify(answers));
  };

  // পরীক্ষা শেষ বা সাবমিট হলে সব ডেটা ক্লিয়ার করার ফাংশন
  const resetQuizContext = useCallback(() => {
    clearInterval(timerRef.current);
    setIsExamActive(false);
    setTimeLeft(0);
    setSelectedAnswers({});
    sessionStorage.removeItem('is_exam_active');
    sessionStorage.removeItem('exam_expiry_time');
    localStorage.removeItem('quiz_selected_answers');
    localStorage.removeItem('isQuizVerified');
  }, []);

  // পরীক্ষা শুরু করার ফাংশন (যেমন: ৩০ মিনিটের পরীক্ষা)
  const startExam = useCallback((durationInMinutes) => {
    const now = Date.now();
    const expiryTime = now + durationInMinutes * 60 * 1000;

    sessionStorage.setItem('is_exam_active', 'true');
    sessionStorage.setItem('exam_expiry_time', expiryTime.toString());
    setIsExamActive(true);
  }, []);

  // টাইমার চেক ও রানিং লজিক
  const checkAndRunTimer = useCallback(() => {
    const savedActive = sessionStorage.getItem('is_exam_active') === 'true';
    const savedExpiry = sessionStorage.getItem('exam_expiry_time');

    if (savedActive && savedExpiry) {
      setIsExamActive(true);

      const updateTimer = () => {
        const now = Date.now();
        const expiry = parseInt(savedExpiry, 10);
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

        if (remaining <= 0) {
          resetQuizContext();
          // এখানে অটো সাবমিটের জন্য একটি কাস্টম ইভেন্ট ফায়ার করা যেতে পারে
          window.dispatchEvent(new Event('autoSubmitQuiz')); 
        } else {
          setTimeLeft(remaining);
        }
      };

      updateTimer();
      clearInterval(timerRef.current);
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      setIsExamActive(false);
      setTimeLeft(0);
    }
  }, [resetQuizContext]);

  useEffect(() => {
    checkAndRunTimer();

    // ট্যাব চেঞ্জ করে ফিরে আসলে সঠিক টাইম সিঙ্ক করার জন্য
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndRunTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAndRunTimer]);

  return (
    <QuizContext.Provider value={{ 
      isExamActive, 
      timeLeft, 
      selectedAnswers, 
      updateAnswers, 
      startExam, 
      resetQuizContext 
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
