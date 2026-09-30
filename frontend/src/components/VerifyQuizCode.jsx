import React, { useState } from 'react';

const VerifyQuizCode = ({ onVerificationSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!accessCode) {
      setError('অনুগ্রহ করে কোডটি টাইপ করুন।');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-code/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ভেরিফিকেশন ব্যর্থ হয়েছে! আবার চেষ্টা করুন।');
      }

      // Trigger the parent callback function on success
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-md w-full">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          কুইজে প্রবেশ করুন
        </h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          কুইজ শুরু করতে আপনাকে দেওয়া নির্দিষ্ট সংখ্যাটি (Access Code) লিখুন।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quiz-code-input" className="sr-only">
              অ্যাক্সেস কোড
            </label>
            <input
              id="quiz-code-input"
              type="number"
              placeholder="কোডটি এখানে লিখুন"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-center text-lg font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 px-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'যাচাই করা হচ্ছে...' : 'কুইজ দেখুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyQuizCode;
