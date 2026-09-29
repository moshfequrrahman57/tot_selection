import React from 'react';

const QuizSubmitButton = ({ onValidateAndSubmit, isSubmitting, totalAnswered }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-10">
      <div>
        <h4 className="font-bold text-slate-800 text-sm sm:text-base">কুইজ অগ্রগতি (Quiz Progress)</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনি মোট <span className="font-semibold text-indigo-600 text-sm">{totalAnswered}টি</span> প্রশ্নের উত্তর দিয়েছেন।
        </p>
      </div>
      
      <button
        type="button"
        onClick={onValidateAndSubmit}
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-all disabled:bg-slate-300 text-sm"
      >
        {isSubmitting ? 'জমা হচ্ছে...' : 'কুইজ সাবমিট করুন'}
      </button>
    </div>
  );
};

export default QuizSubmitButton;
