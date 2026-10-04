import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext'; // Path to your AuthContext
import QuestionList from './QuestionList';     // Path to your QuestionList component
import QuizSubmitButton from './QuizSubmitButton'; // The new component
import VerifyQuizCode from './VerifyQuizCode';
import Pdf_Download from './Pdf_Download';
import CheatChecker from './CheatChecker';

const ExamPage = () => {
  // 1. Get user profile data directly from your AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);
  
  // 2. State to hold answers bubble up from QuestionList
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  // স্টেট ইনিশিয়ালাইজ করার সময় localStorage চেক করা হচ্ছে
  const [isVerified, setIsVerified] = useState(() => {
    const savedStatus = localStorage.getItem('isQuizVerified');
    return savedStatus === 'true'; // যদি আগে থেকে 'true' সেভ থাকে তবে সরাসরি true হবে
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [isActive, setIsActive] = useState(false); 

  const handleVerificationSuccessful= ()=>{
    setIsVerified(true);
    localStorage.setItem('isQuizVerified', 'true');
    setIsActive(true); // ভেরিফিকেশন সফল হলে টাইমার শুরু হবে
  }

  // Callback to receive answers from QuestionList child component
  const handleAnswersChange = (answers) => {
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

    // Destructure the profile information directly from your Context user object
    const { name, phone, division, district, upazila, institute } = user;
    console.log(name,phone,division,district,upazila,institute);
    const token = localStorage.getItem('token'); // লোকাল স্টোরেজ থেকে টোকেন নেওয়া

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
          answers: selectedAnswers
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setStatusMessage({ type: 'success', text: 'আপনার কুইজ উত্তরটি সফলভাবে জমা হয়েছে!' });
      const finalData= {...user, answers:selectedAnswers};
      setSubmittedData(finalData);
      

    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitted(false);
    }
  };
  

  if (authLoading) return <div className="text-center py-10">Loading User Profile...</div>;

// প্রোফাইল লোড শেষ হওয়ার (authLoading = false) ঠিক পর পরই চেক হবে ইউজার আসলেই লগইনড কিনা 
if (!user) {
  return <div className="text-center py-10">কুইজে অংশ নিতে আগে লগইন করুন।</div>; 

}
  if (!isVerified) {
    return <VerifyQuizCode onVerificationSuccess={handleVerificationSuccessful } />;
  }
  if(submittedData){
    return <Pdf_Download sub_data={submittedData}/>
  }
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 max-w-2xl mx-auto space-y-6">
      
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
      <QuestionList onAnswerChange={handleAnswersChange} />
      
    </div>
  );
};

export default ExamPage;
