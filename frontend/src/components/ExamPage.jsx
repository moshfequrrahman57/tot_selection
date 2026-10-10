import React, { useState, useContext,useRef,useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Path to your AuthContext
import QuestionList from './QuestionList';     // Path to your QuestionList component
import QuizSubmitButton from './QuizSubmitButton'; // The new component
import VerifyQuizCode from './VerifyQuizCode';
import LoginPrompt from './LumSumPage/LoginPrompt';
import { useBlocker, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 
const ExamPage = () => {
  // 1. Get user profile data directly from your AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

  // 2. State to hold answers bubble up from QuestionList
  // const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('exam_answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  // 🎯 এটি যোগ করুন: selectedAnswers এর লেটেস্ট মান ট্র্যাক করার জন্য Ref
const answersRef = useRef(selectedAnswers);
useEffect(() => {
  answersRef.current = selectedAnswers;
}, [selectedAnswers]);


  const [submitted, setSubmitted] = useState(false);

  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  // স্টেট ইনিশিয়ালাইজ করার সময় localStorage চেক করা হচ্ছে
  // const [isVerified, setIsVerified] = useState(() => {
  //   const savedStatus = localStorage.getItem('isQuizVerified');
  //   return savedStatus === 'true'; // যদি আগে থেকে 'true' সেভ থাকে তবে সরাসরি true হবে
  // });
  const [isVerified, setIsVerified]=useState(false);
  
  const [isActive, setIsActive] = useState(false); 
  
   let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isActive && currentLocation.pathname !== nextLocation.pathname
  );
  // যখনই submitted স্টেট চেঞ্জ হবে, রিফের ভ্যালু আপডেট হবে
  
 

 

  const handleVerificationSuccessful = async () => {
    // Check if user has already attempted the exam
    if (user.no_of_attempt !== null && user.no_of_attempt !== undefined) {
      toast.error('আপনি ইতিমধ্যে পরীক্ষা দিয়েছেন। পুনরায় পরীক্ষা দেওয়া সম্ভব নয়।');
      return;
    }

    // First attempt — allow access
    //localStorage.setItem('isQuizVerified', 'true');
    setIsVerified(true);
    setIsActive(true);

    // Record the attempt in the database
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login/update-attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Failed to record attempt:', result.error);
      }
    } catch (error) {
      console.error('Error recording attempt:', error);
    }
  }

  // Callback to receive answers from QuestionList child component
  const handleAnswersChange = (answers) => {
    // console.log("Answers from Exam page:  ", answers);
    setSelectedAnswers(answers);

  };

  // The central submit handler
  const handleQuizSubmit = async () => {
    if (authLoading) return;
    if (!user) {
      setStatusMessage({ type: 'error', text: 'Please log in to submit the quiz.' });
      return;
    }
    
    // setStatusMessage({ type: '', text: '' });
    setSubmitted(true);
    setIsActive(false); // Stop the timer when submitting
    const loadingToast = toast.loading('Submitting Answer...'); 
    // Destructure the profile information directly from your Context user object
    const { name, phone, division, district, upazila, institute } = user;
    // console.log(name,phone,division,district,upazila,institute);
    const token = localStorage.getItem('token'); // লোকাল স্টোরেজ থেকে টোকেন নেওয়া
    // console.log("Answers:   ",selectedAnswers);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/answers/submit-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}`
        },
          body: JSON.stringify({
          name: name,
          phone: phone,
          division: division,
          district: district,
          upazila: upazila,
          institute: institute,
          answers: answersRef.current
        })
      });
      
      const result = await response.json();
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Submitted Successful!', { id: loadingToast });
      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setStatusMessage({ type: 'success', text: 'আপনার কুইজ উত্তরটি সফলভাবে জমা হয়েছে!' });
      localStorage.removeItem('exam_answers');
     // localStorage.removeItem('isQuizVerified');
      
          navigate('/submitted');
       

    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
      toast.error(err.message || 'Submission Failed', { id: loadingToast });
    } finally {
      setSubmitted(false);
      
    }
  };
  

  if (authLoading) return <div className="text-center py-10">Loading User Profile...</div>;

// প্রোফাইল লোড শেষ হওয়ার (authLoading = false) ঠিক পর পরই চেক হবে ইউজার আসলেই লগইনড কিনা 
if (!user) {
  return <LoginPrompt/>; 

}
  if (!isVerified) {
    return (
    <>
      <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 99999 }} />
      <VerifyQuizCode onVerificationSuccess={handleVerificationSuccessful} />
    </>
  );
  }
 
  return (
   
    <div className="min-h-screen bg-slate-50 py-10 px-4 max-w-2xl mx-auto space-y-6">
     <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 99999 }} />
      <div>
      <h1>পরীক্ষা চলছে...</h1>
      
      {/* ব্যাক বাটন চাপলে এই অ্যালার্ট বা মডাল শো করবে */}
      {blocker.state === "blocked" && (
        <div className="custom-modal">
          <p>পরীক্ষা চলাকালীন আপনি ব্যাক বাটন চেপে বের হতে পারবেন না!</p>
          <button onClick={() => blocker.reset()}>পরীক্ষায় ফিরে যান</button>
        </div>
      )}
    </div>
      
      {/* 🟢 Status Banner if any error/success happens */}
      {statusMessage.text && (
        <div className={`p-4 rounded-xl text-center text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {statusMessage.text}
        </div>
      )}

      {/* 🟢 NEW SUBMIT BUTTON COMPONENT (Placed ABOVE the QuestionList) */}
      <QuizSubmitButton 
        onValidateAndSubmit={handleQuizSubmit} 
        isSubmitted={submitted} 
        totalAnswered={Object.keys(selectedAnswers).length}
        isActive={isActive}
      />
      

      {/* 🟢 QUESTION LIST COMPONENT */}
      {/* Pass handleAnswersChange down so it can report answers back up */}
      <QuestionList onAnswerChange={handleAnswersChange} currentAnswers={selectedAnswers} />
      
    </div>
   
  );
};

export default ExamPage;
