import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/admin/user`);
      setUsers(response.data?.users || []);
    } catch (err) {
      setError(err.response?.data || err.message || 'ইউজার তালিকা লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const name = (u.name || u.username || u.full_name || '').toLowerCase();
    const email = (u.email || u.mobile || u.phone || '').toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-1">
            <Link to="/admin" className="hover:underline flex items-center space-x-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-400">নিবন্ধিত সকল ইউজারের তালিকা ও বিস্তারিত তথ্য</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="ইউজার নাম বা ইমেইল দিয়ে সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          মোট ইউজার: <span className="text-white font-bold">{users.length}</span> (ফিল্টারড: {filteredUsers.length})
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        {error && (
          <div className="p-4 bg-red-500/10 border-b border-red-500/30 text-red-400 text-sm flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">ইউজারদের তালিকা লোড হচ্ছে...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">নাম</th>
                  <th className="py-3.5 px-4">ইমেইল / ফোন</th>
                  <th className="py-3.5 px-4">রোল</th>
                  <th className="py-3.5 px-4">রেজিস্ট্রেশন তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <tr key={u.id || i} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{u.id || i + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {u.name || u.username || u.full_name || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {u.email || u.mobile || u.phone || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {u.role || 'User'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('bn-BD') : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      কোনো ইউজার খুঁজে পাওয়া যায়নি।
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
