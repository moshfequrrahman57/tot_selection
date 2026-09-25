import React from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, AlertCircle, FileText, ArrowRight, HelpCircle } from 'lucide-react';

export default function InstructionPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 font-sans bg-slate-50 min-h-screen">
      
      {/* পেজ হেডার (Page Header) */}
      <div className="mb-10 text-center sm:text-left border-b border-slate-200 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10 mb-3">
          ডকুমেন্টেশন পোর্টাল
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          অ্যাকাউন্ট নিবন্ধনের নির্দেশনাবলী
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-3xl">
          নতুন অ্যাকাউন্ট তৈরি করার আগে অথবা আঞ্চলিক ভেরিফিকেশন সম্পন্ন করার আগে দয়া করে নিচের নির্দেশিকাগুলো মনোযোগ সহকারে পড়ুন।
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* বাম/মূল কলাম: ধাপসমূহ এবং নিয়মাবলী */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* সেকশন ১: পর্যায়ক্রমিক ধাপসমূহ (Sequential Steps) */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2.5 mb-6">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">ধাপ-বাই-ধাপ নিবন্ধন প্রক্রিয়া</h2>
            </div>

            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ১
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">সঠিক ব্যক্তিগত তথ্য প্রদান করুন</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    আপনার জাতীয় পরিচয়পত্র (NID) অথবা প্রাতিষ্ঠানিক নথিপত্রে যেভাবে নাম দেওয়া আছে, ঠিক সেভাবে আপনার সম্পূর্ণ নাম লিখুন।
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ২
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">ভৌগোলিক এলাকা বা অঞ্চল নিশ্চিত করুন</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    ড্রপডাউন তালিকা থেকে আপনার সঠিক বিভাগ, জেলা এবং উপজেলা নির্বাচন করুন। আপনার এই তথ্যের ওপর ভিত্তি করেই আপনার অ্যাকাউন্টের আঞ্চলিক সেবা নির্ধারণ করা হবে।
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-xs text-white">
                  ৩
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">অ্যাকাউন্টের নিরাপত্তা নিশ্চিতকরণ</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                    অন্তত একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন যাতে ইংরেজি অক্ষর, সংখ্যা এবং বিশেষ চিহ্ন (@, #, $) অন্তর্ভুক্ত থাকে। আপনার পাসওয়ার্ড অন্য কারও সাথে শেয়ার করবেন না।
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
              {/* অনুমোদিত বিষয়সমূহ */}
              <div className="rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
                <div className="flex gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900">গ্রহণযোগ্য শর্তাবলী</h4>
                    <ul className="mt-2 space-y-1 text-xs text-emerald-700 list-disc list-inside">
                      <li>প্রতিটি নাগরিক পরিচয়ের বিপরীতে কেবল একটি অ্যাকাউন্ট গ্রহণযোগ্য।</li>
                      <li>সঠিক এবং সচল ১১-ডিজিটের বাংলাদেশি মোবাইল নম্বর ব্যবহার করতে হবে।</li>
                      <li>আপনার বর্তমান বা সর্বশেষ শিক্ষা প্রতিষ্ঠানের সঠিক নাম যুক্ত করতে হবে।</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* নিষিদ্ধ বিষয়সমূহ */}
              <div className="rounded-xl bg-rose-50/50 p-4 border border-rose-100">
                <div className="flex gap-2.5">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-rose-900">কঠোরভাবে নিষিদ্ধ</h4>
                    <ul className="mt-2 space-y-1 text-xs text-rose-700 list-disc list-inside">
                      <li>কোনো ধরনের অস্থায়ী বা ভার্চুয়াল/VoIP ফোন নম্বর ব্যবহার করা যাবে না।</li>
                      <li>ভুয়া প্রাতিষ্ঠানিক পরিচয় বা ভুল তথ্য দিয়ে অ্যাকাউন্ট খোলার চেষ্টা দণ্ডনীয়।</li>
                      <li>অ্যাকাউন্ট তৈরির জন্য কোনো অটোমেটেড স্ক্রিপ্ট বা বোট (Bot) ব্যবহার করা নিষিদ্ধ।</li>
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
              নিবন্ধন প্রক্রিয়াটি কোনো বাধা ছাড়া সম্পন্ন করতে নিচের জিনিসগুলো সাথে রাখুন:
            </p>
            <ul className="space-y-2.5 text-sm border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                প্রতিষ্ঠানের আইডি কার্ড বা রোল নম্বর
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                ওটিপি (OTP) কোড পাওয়ার জন্য সচল মোবাইল ফোন
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                এলাকার পোস্টাল বা জিপ কোড (যদি প্রযোজ্য হয়)
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
            <a href="#helpdesk" className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-slate-100 py-2.5 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200">
              হেল্পডেস্ক সেন্টারে যান
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
