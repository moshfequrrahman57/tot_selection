import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, RefreshCw, AlertCircle, ArrowLeft, Eye, X, 
  User, Phone, MapPin, Building, Calendar, Trash2, Filter, 
  ChevronLeft, ChevronRight, FileText, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BANGLADESH } from '../../data/locations';

export default function UsersAnswers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const ITEMS_PER_PAGE = 50;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  const fetchUserAnswers = async () => {
    setLoading(true);
    setError('');
    
      // Try user-answers endpoint first, fallback to user list if unavailable
      try {
        const response = await axios.get(`${API_URL}/admin/user-answers`);
        setUsers(response.data?.users || []);
     
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || err.message || 'সাবমিট করা ইউজারের উত্তর তালিকা লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAnswers();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedUpazila]);

  // Extract District options from BANGLADESH dataset & loaded users
  const districtOptions = useMemo(() => {
    const set = new Set();
    Object.values(BANGLADESH).forEach((div) => {
      Object.keys(div).forEach((dist) => set.add(dist));
    });
    users.forEach((u) => {
      if (u.district) set.add(u.district);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'bn'));
  }, [users]);

  // Extract Upazila options based on selected District
  const upazilaOptions = useMemo(() => {
    const set = new Set();
    if (selectedDistrict) {
      Object.values(BANGLADESH).forEach((div) => {
        if (div[selectedDistrict]) {
          div[selectedDistrict].forEach((up) => set.add(up));
        }
      });
      users.forEach((u) => {
        if (u.district === selectedDistrict && u.upazila) set.add(u.upazila);
      });
    } else {
      users.forEach((u) => {
        if (u.upazila) set.add(u.upazila);
      });
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'bn'));
  }, [users, selectedDistrict]);

  // Delete user answer submission
  const handleDeleteUser = async (userToDelete) => {
    const uName = userToDelete.name || userToDelete.username || userToDelete.phone || 'এই ইউজার';
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${uName}" এর সাবমিট করা উত্তরটি মুছে ফেলতে চান?`)) {
      return;
    }
   
      try {
        await axios.delete(`${API_URL}/admin/user-answers/${userToDelete.id}`);
      
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data || err.message || 'উত্তর মুছে ফেলা সম্ভব হয়নি');
    }
  };

  // Filter users by search, district, upazila
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      const name = (u.name || u.username || u.full_name || '').toLowerCase();
      const email = (u.email || u.mobile || u.phone || '').toLowerCase();
      const matchesSearch = name.includes(term) || email.includes(term);

      const matchesDistrict = selectedDistrict ? u.district === selectedDistrict : true;
      const matchesUpazila = selectedUpazila ? u.upazila === selectedUpazila : true;

      return matchesSearch && matchesDistrict && matchesUpazila;
    });
  }, [users, searchTerm, selectedDistrict, selectedUpazila]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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
          <h1 className="text-2xl font-bold text-white">ইউজার অ্যান্সার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-400">সাবমিট করা সকল ইউজারের উত্তর ও বিস্তারিত তথ্য</p>
        </div>
        <button
          onClick={fetchUserAnswers}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors w-fit"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Filter Bar (Above Search Bar) */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs shrink-0">
          <Filter className="h-4 w-4" />
          <span>ফিল্টার:</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 justify-end">
          {/* District Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-slate-400 whitespace-nowrap">জেলা:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedUpazila('');
              }}
              className="w-full sm:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল জেলা</option>
              {districtOptions.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-slate-400 whitespace-nowrap">উপজেলা:</label>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল উপজেলা</option>
              {upazilaOptions.map((up) => (
                <option key={up} value={up}>
                  {up}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedDistrict || selectedUpazila) && (
            <button
              onClick={() => {
                setSelectedDistrict('');
                setSelectedUpazila('');
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              ফিল্টার রিসেট
            </button>
          )}
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="ইউজার নাম বা ইমেইল/ফোন দিয়ে সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          মোট সাবমিশন: <span className="text-white font-bold">{users.length}</span> (ফিল্টারড: {filteredUsers.length})
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
          <div className="py-12 text-center text-slate-400 text-sm">ইউজারদের সাবমিশন তালিকা লোড হচ্ছে...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">নাম</th>
                  <th className="py-3.5 px-4">ইমেইল / ফোন</th>
                  <th className="py-3.5 px-4 text-center">ডিটেইলস</th>
                  <th className="py-3.5 px-4">সাবমিটের তারিখ ও সময়</th>
                  <th className="py-3.5 px-4 text-center">ডিলিট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u, i) => {
                    const submitDate = u.submitted_at || u.created_at || u.submission_date || u.created_time;
                    return (
                      <tr key={u.id || i} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {u.name || u.username || u.full_name || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {u.email || u.mobile || u.phone || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>ডিটেইলস</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                          {submitDate
                            ? new Date(submitDate).toLocaleString('bn-BD', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u)}
                            title="উত্তর মুছে ফেলুন"
                            className="p-1.5 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      কোনো সাবমিটেড উত্তর খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 bg-slate-900 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              প্রদর্শন করা হচ্ছে{' '}
              <span className="font-semibold text-white">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              থেকে{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </span>{' '}
              (সর্বমোট <span className="font-semibold text-white">{filteredUsers.length}</span> জন)
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>

              <div className="px-3 py-1.5 font-medium text-white">
                পৃষ্ঠা {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-lg border border-slate-700 transition-colors"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal Pop-up */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ইউজার সাবমিশন তথ্য</h3>
                  <p className="text-xs text-slate-400">আইডি: #{selectedUser.id || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    নাম
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.name || selectedUser.username || selectedUser.full_name || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    ফোন / ইমেইল
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.phone || selectedUser.email || selectedUser.mobile || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    বিভাগ
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.division || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    জেলা
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.district || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    উপজেলা
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.upazila || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    প্রতিষ্ঠান / ইনস্টিটিউট
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedUser.institute || 'N/A'}
                  </span>
                </div>

                {/* Submission Date & Time Column Replacement */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl sm:col-span-2 border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    সাবমিটের তারিখ ও সময়
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
                    <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                    {(selectedUser.submitted_at || selectedUser.created_at || selectedUser.submission_date || selectedUser.created_time)
                      ? new Date(selectedUser.submitted_at || selectedUser.created_at || selectedUser.submission_date || selectedUser.created_time).toLocaleString('bn-BD', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })
                      : 'N/A'}
                  </span>
                </div>

                {/* Submitted Answers JSON/Data section if available */}
                {selectedUser.answers && (
                  <div className="bg-slate-900/60 p-3.5 rounded-xl sm:col-span-2 border border-slate-700/60">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      সাবমিট করা উত্তরসমূহ
                    </span>
                    <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg max-h-40 overflow-y-auto border border-slate-800">
                      {typeof selectedUser.answers === 'object' 
                        ? JSON.stringify(selectedUser.answers, null, 2)
                        : String(selectedUser.answers)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-between items-center">
              <button
                onClick={() => handleDeleteUser(selectedUser)}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>উত্তর ডিলিট করুন</span>
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
