import { Phone } from 'lucide-react';

const programmers = [
  { name: 'মুহাম্মদ মাহ্‌দী', designation: 'প্রোগ্রামার', phone: '01746434034' },
  { name: 'মিল্টন দাস', designation: 'প্রোগ্রামার', phone: '01515607165' },
  { name: 'মোঃ সালাউদ্দিন', designation: 'প্রোগ্রামার', phone: 'PABX: ICT' },
  { name: 'দেবব্রত চক্রবর্তী', designation: 'প্রোগ্রামার', phone: 'PABX: ICT' }
];

export default function Helpdesk() {
  return (
    <section id="helpdesk" className="p-4 bg-white rounded-xl border border-slate-100 max-w-3xl mx-auto shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 mb-3 px-2 border-l-4 border-blue-500">
        হেল্পডেস্ক সাপোর্ট (আইসিটি বিভাগ)
      </h3>
      
      <div className="divide-y divide-slate-100">
        {programmers.map((p, index) => (
          <div key={index} className="flex flex-wrap items-center justify-between py-2 px-2 text-xs text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            {/* নাম ও পদবি বামে */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{p.name}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{p.designation}</span>
            </div>
            
            {/* মোবাইল নাম্বার ডানে */}
            <a href={`tel:${p.phone}`} className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors">
              <Phone className="h-3 w-3" />
              {p.phone}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
