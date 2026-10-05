import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, AlertCircle, FileText, ArrowRight, HelpCircle } from 'lucide-react';
import Helpdesk from './Helpdesk';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function InstructionPage() {


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
        <p className="mt-3 text-lg text-slate-500 max-w-3xl">
          পরীক্ষায় অংশগ্রহণের আগে নিজেকেই একটি নতুন অ্যাকাউন্ট তৈরি করতে হবে ।<span className="font-bold text-red-500">  মোবাইল নাম্বার ও পাসওয়ার্ড মনে রাখতে হবে পরবর্তীতে একাউন্ট লগইন এর জন্য । </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        {/* বাম/মূল কলাম: ধাপসমূহ এবং নিয়মাবলী */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* সেকশন ১: পর্যায়ক্রমিক ধাপসমূহ (Sequential Steps) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2.5 mb-6">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900"> নিবন্ধন প্রক্রিয়া</h2>
            </div>

            <ol className="space-y-2">
              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ১
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">সঠিক নাম প্রদান করুন</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    প্রাতিষ্ঠানিক নথিপত্রে যেভাবে নাম দেওয়া আছে ঠিক সেভাবে আপনার  <span className="font-bold text-red-500"> নাম ইংরেজিতে (Camel Case)</span>- এ লিখুন।
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ২ 
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">সঠিক মোবাইলে  তথ্য প্রদান করুন</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    আপনার ১১ ডিজিটের সঠিক মোবাইল নাম্বার (যেটি দিয়ে আবেদন করেছিলেন) ইংরেজিতে লিখুন। <span className="font-bold text-red-500"> যেমন: 01XXXXXXXXXX</span>
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ৩ 
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">আবেদনকৃত UITRCE এর ঠিকানা  </h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                   আপনি যেই UITRCE কার্যালয়ের জন্য আবেদন করেছেন তা  ড্রপডাউন তালিকা থেকে আপনার <span className="font-bold text-red-500"> সঠিক বিভাগ, জেলা এবং উপজেলা </span>নির্বাচন করুন। 
                  </p>
                </div>
              </li>
                <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ৪ 
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">প্রতিষ্ঠানের তথ্য দিন </h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    আপনার কর্মরত শিখা প্রতিষ্ঠানের তথ্য দিন (ইংরেজিতে Camel Case) । ভিন্ন হলে প্রতিষ্ঠানের নামের পাশে উপজেলা উল্লেখ করতে পারেন।   <span className="font-bold text-red-500"> যেমন: Abc Model High School </span>
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ৫ 
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">অ্যাকাউন্টের পাসওয়ার্ড প্রদান</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                   একটি অতিসহজ ইংরেজি পাসওয়ার্ড ব্যবহার করুন যাতে আপনি মনে রাখতে পারেন  প্রয়োজনে লিখে রাখুন । আপনার পাসওয়ার্ড অন্য কারও সাথে শেয়ার করবেন না। <span className="font-bold text-red-500"> যেমন: 1990 বা 2026 </span>
                  </p>
                </div>
              </li>
            </ol>
          </section>

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
        <div className="space-y-6">
          
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
            <Helpdesk id="helpdesk" className="scroll-mt-24"/>
          </div>

        </div>

      </div>

    </div>
  );
}
