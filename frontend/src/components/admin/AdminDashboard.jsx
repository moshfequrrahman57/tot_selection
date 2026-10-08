import React, { useState, useEffect } from 'react';
import { ShieldAlert, KeyRound, Users, Server, Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('admin_unlocked') === 'true';
  });
  const [secretError, setSecretError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Data states
  const [loading, setLoading] = useState(false);
  const [serverData, setServerData] = useState(null);
  const [dataError, setDataError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setSecretError('');
    setVerifying(true);

    try {
      const response = await axios.post(`${API_URL}/admin/secret`, { access_code: accessCode });
      if (response.data?.success) {
        setIsUnlocked(true);
        localStorage.setItem('admin_unlocked', 'true');
      } else {
        setSecretError(response.data?.error || 'অবৈধ অ্যাক্সেস কোড!');
      }
    } catch (err) {
      setSecretError(err.response?.data?.error || 'ভুল সিক্রেট কোড! আবার চেষ্টা করুন।');
    } finally {
      setVerifying(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    setDataError('');
    try {
      const response = await axios.get(`${API_URL}/admin/user`);
      setServerData(response.data);
    } catch (err) {
      setDataError(err.response?.data || err.message || 'ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAdminData();
    }
  }, [isUnlocked]);

  const handleLock = () => {
    localStorage.removeItem('admin_unlocked');
    setIsUnlocked(false);
    setAccessCode('');
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
            <KeyRound className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white">এডমিন অ্যাক্সেস ভেরিফিকেশন</h2>
          <p className="text-sm text-slate-400">
            এডমিন ড্যাশবোর্ড ব্যবহারের জন্য অনুগ্রহ করে আপনার সিক্রেট অ্যাক্সেস কোডটি দিন।
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
          {secretError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{secretError}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Access Code
            </label>
            <input
              type="password"
              placeholder="Enter Admin Secret Code (e.g. 1111)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors shadow-lg disabled:opacity-50"
          >
            {verifying ? 'ভেরিফাই হচ্ছে...' : 'অ্যাক্সেস করুন'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-white">এডমিন কন্ট্রোল প্যানেল</h1>
          <p className="text-sm text-slate-400">সিস্টেম স্ট্যাটাস ও ইউজার ওভারভিউ</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
          <button
            onClick={handleLock}
            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
          >
            লক করুন
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Total Users */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">মোট ইউজার সংখ্যা</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {serverData?.users ? serverData.users.length : '—'}
            </p>
          </div>
        </div>

        {/* Card 2: Server Time */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">ডাটাবেজ সময়</p>
            <p className="text-xs font-mono text-emerald-400 mt-1 truncate max-w-[200]">
              {serverData?.time?.now ? new Date(serverData.time.now).toLocaleString('bn-BD') : '—'}
            </p>
          </div>
        </div>

        {/* Card 3: System Status */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">সিস্টেম স্ট্যাটাস</p>
            <div className="flex items-center space-x-1.5 mt-1 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>অনলাইন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation & Preview */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">সম্প্রতি নিবন্ধিত ইউজারগণ</h2>
          <Link
            to="/admin/users"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            সকল ইউজার দেখুন &rarr;
          </Link>
        </div>

        {dataError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {dataError}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">ডেটা লোড হচ্ছে...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">নাম</th>
                  <th className="py-3 px-4">ইমেইল / মোবাইল</th>
                  <th className="py-3 px-4">রোল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {serverData?.users && serverData.users.length > 0 ? (
                  serverData.users.slice(0, 5).map((u, i) => (
                    <tr key={u.id || i} className="hover:bg-slate-700/30">
                      <td className="py-3 px-4 font-mono text-slate-400">{u.id || u.user_id || i + 1}</td>
                      <td className="py-3 px-4 font-semibold text-white">{u.name || u.username || u.full_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-300">{u.email || u.mobile || u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {u.role || 'User'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-500">
                      কোনো ইউজারের তথ্য পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
