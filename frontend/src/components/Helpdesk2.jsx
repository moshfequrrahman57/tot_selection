import React from 'react';

const programmers = [
  { name: 'মুহাম্মদ মাহ্‌দী', designation: 'প্রোগ্রামার', phone: '01746434034' },
  { name: 'মিল্টন দাস', designation: 'প্রোগ্রামার', phone: '01515607165' },
  { name: 'মোঃ সালাউদ্দিন', designation: 'প্রোগ্রামার', phone: '01557685179' },
  { name: 'দেবব্রত চক্রবর্তী', designation: 'প্রোগ্রামার', phone: '01717143821' }
];

export default function Helpdesk2() {
  return (
    <div className="m-4 w-[calc(100vw-2rem)] min-h-screen bg-slate-50/50 flex flex-col items-center py-10 antialiased font-sans">
      <div className="w-full max-w-5xl px-4">
        
        {/* Clean Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            আইটি হেল্পডেস্ক সাপোর্ট
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            আমাদের ডেডিকেটেড প্রোগ্রামারদের সাথে সরাসরি যোগাযোগের তালিকা।
          </p>
        </div>

        {/* Professional Table Container */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
          
          {/* Table Header (Desktop Only) */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 py-4 px-6 bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <div className="sm:col-span-5"> নাম</div>
            <div className="sm:col-span-4">পদবী</div>
            <div className="sm:col-span-3 text-right">যোগাযোগ</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {programmers.map((programmer, index) => (
              <div 
                key={index} 
                className="p-5 sm:px-6 sm:py-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center hover:bg-slate-50/40 transition-colors duration-150"
              >
                
                {/* MOBILE ROW 1 / DESKTOP COLUMN 1 */}
                <div className="sm:col-span-5 flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar Icon */}
                    <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-base font-semibold text-slate-800 sm:text-sm sm:font-medium">
                      {programmer.name}
                    </span>
                  </div>
                  
                  {/* Designation Badge: Mobile Only */}
                  <span className="sm:hidden text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                    {programmer.designation}
                  </span>
                </div>

                {/* DESKTOP COLUMN 2 */}
                <div className="hidden sm:block sm:col-span-4 text-sm text-slate-600">
                  {programmer.designation}
                </div>

                {/* MOBILE ROW 2 / DESKTOP COLUMN 3 */}
                <div className="mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-dashed border-slate-100 sm:border-none sm:col-span-3 flex items-center justify-between sm:justify-end gap-2 text-sm">
                  {/* Label: Mobile Only */}
                  <span className="sm:hidden font-medium text-slate-500 text-xs uppercase">
                    মোবাইলঃ
                  </span>

                  <a 
                    href={`tel:${programmer.phone}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-indigo-600 text-slate-700 hover:text-white font-mono tracking-wide text-xs sm:text-sm border border-slate-200 hover:border-indigo-600 rounded-md shadow-sm transition-all duration-150"
                  >
                    {/* Phone Icon */}
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.194-4.177-7-7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {programmer.phone}
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
        
      </div>
    </div>
  );
}
