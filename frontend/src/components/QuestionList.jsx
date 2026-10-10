import React, { useState, useEffect } from 'react';

const QuestionList = ({onAnswerChange, currentAnswers}) => {
  // স্টেট ম্যানেজমেন্ট
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ব্যবহারকারীর সিলেক্ট করা উত্তর জমা রাখার স্টেট (e.g., { [questionId]: 'option_b' })
  const [selectedAnswers, setSelectedAnswers] = useState(currentAnswers || {});
    // console.log("Selected Answers State from question list:", selectedAnswers);

  // API থেকে ডেটা ফেচ করা
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token'); // লোকাল স্টোরেজ থেকে টোকেন নেওয়া

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/fetch`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // টোকেনটি পাঠানো হচ্ছে
        }
      });
      
        if (!response.ok) {
          throw new Error('নেটওয়ার্ক রেসপন্স ঠিক ছিল না');
        }
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => a.id - b.id);
        setQuestions(sortedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
    const handleCopy = (e) => {
      e.preventDefault(); // Prevents the content from hitting the clipboard
      alert('Copying content is disabled on this website.');
    };

    // Add listener to the entire document
    document.addEventListener('copy', handleCopy);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  // Automatically save to local storage whenever answers change
useEffect(() => {
  localStorage.setItem('exam_answers', JSON.stringify(selectedAnswers));
}, [selectedAnswers]);


  // অপশন ক্লিক হ্যান্ডলার
  const handleOptionSelect = (questionId, optionKey) => {
    const updatedAnswers ={...selectedAnswers}

   if (updatedAnswers[questionId] === optionKey) {
    // যদি আগের সিলেক্ট করা অপশনেই আবার ক্লিক করা হয়, তবে Deselect হবে
    delete updatedAnswers[questionId];
  } else {
    // অন্যথায় নতুন অপশনটি Select হবে
    updatedAnswers[questionId] = optionKey;
  }
    setSelectedAnswers(updatedAnswers);
    if(onAnswerChange){
      onAnswerChange(updatedAnswers);
    }
  };

  // লোডিং স্ক্রিন
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-lg font-medium text-slate-600">লোডিং হচ্ছে...</span>
      </div>
    );
  }

  // এরর স্ক্রিন
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl max-w-md w-full text-center shadow-sm">
          <p className="font-bold">ত্রুটি ঘটেছে!</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="disable-copy min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* হেডার সেকশন */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            অনলাইন কুইজ 
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            নিচের প্রশ্নগুলোর সঠিক উত্তরটি নির্বাচন করুন।
          </p>
        </div>

        {/* প্রশ্ন তালিকা */}
        <div className="space-y-6">
          {questions.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md"
            >
              {/* প্রশ্নের টেক্সট */}
              <div className="flex items-start gap-3 mb-4">
                <span className="flex items-center justify-center bg-indigo-50 text-indigo-700 text-sm font-bold h-7 w-7 rounded-full shrink-0">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-800 pt-0.5 leading-relaxed">
                  {quiz.question_text}
                </h3>
              </div>

              {/* অপশন সমূহ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'option_a', label: 'ক', text: quiz.option_a },
                  { key: 'option_b', label: 'খ', text: quiz.option_b },
                  { key: 'option_c', label: 'গ', text: quiz.option_c },
                  { key: 'option_d', label: 'ঘ', text: quiz.option_d },
                ].map((option) => {
                  const isSelected = selectedAnswers[quiz.id] === option.key;
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => handleOptionSelect(quiz.id, option.key)}
                      className={`flex items-center w-full px-4 py-3 text-left border rounded-xl transition-all duration-200 group text-slate-700 font-medium
                        ${isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className={`flex items-center justify-center text-xs font-bold h-5 w-5 rounded-md mr-3 transition-colors
                        ${isSelected 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-sm sm:text-base">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
