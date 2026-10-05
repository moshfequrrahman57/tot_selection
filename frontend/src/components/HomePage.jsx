import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, AlertCircle, FileText, ArrowRight, HelpCircle } from 'lucide-react';
import Helpdesk from './Helpdesk';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function HomePage() {

  return (
  <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 font-sans bg-slate-50 min-h-screen">
      
      {/* পেজ হেডার (Page Header) */}
      <div className="mb-3 text-center sm:text-left border-b border-slate-200 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10 mb-3">
          ঘোষণা / Announcement
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          পরীক্ষা নির্দেশনাবলী
        </h1>

      </div>

      <div className="flex flex-col gap-6">
        
        {/* বাম/মূল কলাম: ধাপসমূহ এবং নিয়মাবলী */}
        <div className="lg:col-span-2 space-y-8">
          
      

          {/* সেকশন ২: গুরুত্বপূর্ণ নিয়মাবলী (Critical Rules) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2.5 mb-6">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">যোগ্যতার শর্ত ও নিয়মনীতি</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* নিষিদ্ধ বিষয়সমূহ */}
              <div className="rounded-xl bg-rose-50/50 p-4 border border-rose-100">
                <div className="flex gap-2.5">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-rose-900">কঠোরভাবে নিষিদ্ধ</h4>
                    <ul className="mt-2 space-y-1 text-xs text-rose-700 list-disc list-inside">
                      <li>পরীক্ষা চলাকালীন অন্য কোন ট্যাবে সুইচ করা নিষিদ্ধ  </li>
                      <li>পরীক্ষা চলাকালীন অন্য কোন অ্যাপ্লিকেশনে সুইচ করা নিষিদ্ধ </li>
                      <li>এছাড়াও কোন অনৈতিক কার্যকলাপ পরিলক্ষিত হলে পরীক্ষা সিস্টেম থেকে বাতিল হবে । </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* অনুমোদিত বিষয়সমূহ */}
              <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900">গ্রহণযোগ্য শর্তাবলী</h4>
                    <ul className="mt-2 space-y-1 text-xs text-emerald-700 list-disc list-inside">
                      <li>প্রতিটি পরীক্ষার্থীর বিপরীতে কেবল একটি অ্যাকাউন্ট গ্রহণযোগ্য।</li>
                      <li>সঠিক এবং সচল ১১-ডিজিটের বাংলাদেশি মোবাইল নম্বর ব্যবহার করতে হবে।</li>
                      <li>আপনার বর্তমান বা সর্বশেষ শিক্ষা প্রতিষ্ঠানের সঠিক নাম যুক্ত করতে হবে।</li>
                    </ul>
                  </div>
                </div>
              </div>

              
            </div>
          </section>

        </div>

        {/* ডানদিকের সাইডবার: প্রয়োজনীয় তথ্যের তালিকা ও সাপোর্ট */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* প্রয়োজনীয় ডকুমেন্টের তালিকা */}
          <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-bold">প্রয়োজনীয় জিনিসপত্র</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              অনলাইন পরীক্ষাটি সফলভাবে সম্পন্ন করতে নিচের জিনিসগুলো সাথে রাখুন:
            </p>
            <ul className="space-y-2.5 text-sm border-t border-slate-800 pt-2">
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                রাফ করার জন্য সাদা কাগজ এবং কলম/পেন
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Exam panel এ যাবার আগে ইন্টারনেট সংযোগ চেক করে দেখুন । 
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                ইউজার আইডি (মোবাইল নাম্বার) এবং পাসওয়ার্ড মনে রাখুন এবং প্রয়োজনে লিখে রাখুন । 
              </li>
            </ul>
          </div>

          {/* কুইক হেল্প বা সাপোর্ট ব্লক */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 h-9 w-9 flex items-center justify-center">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">কোনো সাহায্য প্রয়োজন?</h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত। নিবন্ধন সংক্রান্ত যেকোনো জটিলতায় আমাদের হেল্পডেস্কে যোগাযোগ করতে পারেন।
                </p>
              </div>
            </div>
            {/* <a href="#helpdesk" className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-100 py-2.5 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200">
              হেল্পডেস্ক সেন্টারে যান
              <ArrowRight className="h-3.5 w-3.5" />
            </a> */}
            <Helpdesk id="helpdesk2" className="scroll-mt-24"/>
          </div>

        </div>

      </div>

    </div>
  );
}

export default HomePage;
