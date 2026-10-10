import React, { useState, useEffect, useMemo } from 'react';
import { 
  Award, Search, RefreshCw, AlertCircle, ArrowLeft, Download, 
  Filter, ChevronLeft, ChevronRight, Eye, X, User, Phone, 
  MapPin, Building, FileSpreadsheet, CheckCircle2, XCircle, MinusCircle 
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { BANGLADESH } from '../../data/locations';

export default function AdminMarksheet() {
  const [marksheet, setMarksheet] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [negativeRate, setNegativeRate] = useState(0.25);
  
  // Pagination & Modal states
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const ITEMS_PER_PAGE = 50;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  // Normalize option keys to compare correct answers
  const normalizeOption = (val) => {
    if (!val) return '';
    const str = String(val).trim().toLowerCase();
    if (str === 'a' || str === 'option_a') return 'option_a';
    if (str === 'b' || str === 'option_b') return 'option_b';
    if (str === 'c' || str === 'option_c') return 'option_c';
    if (str === 'd' || str === 'option_d') return 'option_d';
    return str;
  };

  // Fetch Marksheet & Questions Data
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Questions for precise client verification fallback
      let qMap = new Map();
      try {
        const qRes = await axios.get(`${API_URL}/api/questions/all`);
        const qList = qRes.data?.questions || (Array.isArray(qRes.data) ? qRes.data : []);
        setQuestions(qList);
        qList.forEach((q) => qMap.set(String(q.id), q.correct_answer));
      } catch (qErr) {
        console.warn('Could not load questions list directly:', qErr.message);
      }

      // 2. Try fetching processed marksheet endpoint
      try {
        const res = await axios.get(`${API_URL}/admin/marksheet`);
        if (res.data?.success && Array.isArray(res.data.marksheet)) {
          setMarksheet(res.data.marksheet);
          setLoading(false);
          return;
        }
      } catch (mErr) {
        console.log('Fallback to /admin/user-answers processing:', mErr.message);
      }

      // Fallback: Fetch user answers & compute locally
      const answersRes = await axios.get(`${API_URL}/admin/user-answers`);
      const userList = answersRes.data?.users || [];

      const computedList = userList.map((user) => {
        const userAnsObj = typeof user.answers === 'string'
          ? JSON.parse(user.answers || '{}')
          : (user.answers || {});

        let all_answer = 0;
        let correct_answer = 0;
        let wrong_answer = 0;

        Object.entries(userAnsObj).forEach(([qId, uAns]) => {
          if (uAns) {
            all_answer++;
            const correctAns = qMap.get(String(qId));
            if (correctAns && normalizeOption(uAns) === normalizeOption(correctAns)) {
              correct_answer++;
            } else {
              wrong_answer++;
            }
          }
        });

        return {
          id: user.id,
          name: user.name || user.username || 'N/A',
          phone: user.phone || user.mobile || user.email || 'N/A',
          division: user.division || '',
          district: user.district || '',
          upazila: user.upazila || '',
          institute: user.institute || '',
          submitted_at: user.submitted_at || user.created_at || user.submission_date || null,
          all_answer,
          correct_answer,
          wrong_answer,
          raw_answers: userAnsObj
        };
      });

      setMarksheet(computedList);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'মার্াকশিটের তথ্য লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedUpazila, negativeRate]);

  // Dynamically recalculated marksheet based on selected negative mark rate
  const processedMarksheet = useMemo(() => {
    return marksheet.map((item) => {
      const negative_mark = parseFloat((item.wrong_answer * negativeRate).toFixed(2));
      const total_mark = parseFloat((item.correct_answer - negative_mark).toFixed(2));
      return {
        ...item,
        negative_mark,
        total_mark
      };
    });
  }, [marksheet, negativeRate]);

  // Extract District Options from BANGLADESH dataset & loaded users
  const districtOptions = useMemo(() => {
    const set = new Set();
    Object.values(BANGLADESH).forEach((div) => {
      Object.keys(div).forEach((dist) => set.add(dist));
    });
    marksheet.forEach((u) => {
      if (u.district) set.add(u.district);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'bn'));
  }, [marksheet]);

  // Extract Upazila Options based on selected District
  const upazilaOptions = useMemo(() => {
    const set = new Set();
    if (selectedDistrict) {
      Object.values(BANGLADESH).forEach((div) => {
        if (div[selectedDistrict]) {
          div[selectedDistrict].forEach((up) => set.add(up));
        }
      });
      marksheet.forEach((u) => {
        if (u.district === selectedDistrict && u.upazila) set.add(u.upazila);
      });
    } else {
      marksheet.forEach((u) => {
        if (u.upazila) set.add(u.upazila);
      });
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'bn'));
  }, [marksheet, selectedDistrict]);

  // Filter users by search term, district, upazila
  const filteredMarksheet = useMemo(() => {
    return processedMarksheet.filter((u) => {
      const term = searchTerm.toLowerCase();
      const name = (u.name || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const district = (u.district || '').toLowerCase();
      const upazila = (u.upazila || '').toLowerCase();

      const matchesSearch = name.includes(term) || phone.includes(term) || district.includes(term) || upazila.includes(term);
      const matchesDistrict = selectedDistrict ? u.district === selectedDistrict : true;
      const matchesUpazila = selectedUpazila ? u.upazila === selectedUpazila : true;

      return matchesSearch && matchesDistrict && matchesUpazila;
    });
  }, [processedMarksheet, searchTerm, selectedDistrict, selectedUpazila]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMarksheet.length / ITEMS_PER_PAGE) || 1;
  const paginatedMarksheet = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMarksheet.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMarksheet, currentPage]);

  // Format dataset for CSV download using react-csv
  const csvHeaders = [
    { label: "SL", key: "sl" },
    { label: "User Name", key: "name" },
    { label: "Phone/Email", key: "phone" },
    { label: "District", key: "district" },
    { label: "Upazila", key: "upazila" },
    { label: "Institute", key: "institute" },
    { label: "All Answer", key: "all_answer" },
    { label: "Correct Answer", key: "correct_answer" },
    { label: "Wrong Answer", key: "wrong_answer" },
    { label: "Negative Mark", key: "negative_mark" },
    { label: "Total Mark", key: "total_mark" },
    { label: "Submission Date", key: "submitted_at_formatted" }
  ];

  const csvData = useMemo(() => {
    return filteredMarksheet.map((u, idx) => ({
      sl: idx + 1,
      name: u.name || 'N/A',
      phone: u.phone || 'N/A',
      district: u.district || 'N/A',
      upazila: u.upazila || 'N/A',
      institute: u.institute || 'N/A',
      all_answer: u.all_answer,
      correct_answer: u.correct_answer,
      wrong_answer: u.wrong_answer,
      negative_mark: u.negative_mark,
      total_mark: u.total_mark,
      submitted_at_formatted: u.submitted_at
        ? new Date(u.submitted_at).toLocaleString('en-US')
        : 'N/A'
    }));
  }, [filteredMarksheet]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-800 p-6 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-1">
            <Link to="/admin" className="hover:underline flex items-center space-x-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            মার্কশিট ব্যবস্থাপনা (Mark Sheet)
          </h1>
          <p className="text-sm text-slate-400">পরীক্ষার্থীদের বিষয়ভিত্তিক মোট উত্তর, সঠিক ও ভুল উত্তর এবং চূড়ান্ত নম্বর</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>

          {/* Download CSV Button using react-csv */}
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`marksheet_${selectedDistrict || 'all'}_${selectedUpazila || 'all'}.csv`}
            className={`flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-emerald-500/20 ${
              filteredMarksheet.length === 0 ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <Download className="h-4 w-4" />
            <span>CSV ডাউনলোড ({filteredMarksheet.length})</span>
          </CSVLink>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs shrink-0">
          <Filter className="h-4 w-4" />
          <span>ফিল্টার ও কনফিগারেশন:</span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 flex-1 justify-end">
          {/* District Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-slate-400 whitespace-nowrap">জেলা:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedUpazila('');
              }}
              className="w-full sm:w-44 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল জেলা</option>
              {districtOptions.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-slate-400 whitespace-nowrap">উপজেলা:</label>
            <select
              value={selectedUpazila}
              onChange={(e) => setSelectedUpazila(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">সকল উপজেলা</option>
              {upazilaOptions.map((up) => (
                <option key={up} value={up}>
                  {up}
                </option>
              ))}
            </select>
          </div>

          {/* Negative Marking Rate Selector */}
          {/* <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs text-slate-400 whitespace-nowrap">নেগেটিভ মার্ক:</label>
            <select
              value={negativeRate}
              onChange={(e) => setNegativeRate(parseFloat(e.target.value))}
              className="w-full sm:w-32 px-3 py-2 bg-slate-900 border border-amber-500/40 rounded-lg text-amber-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={0.25}>-0.25 (ডিফল্ট)</option>
              <option value={0.50}>-0.50</option>
              <option value={1.00}>-1.00</option>
              <option value={0.00}>0.00 (কোনো পেনাল্টি নেই)</option>
            </select>
          </div> */}

          {/* Reset Filters */}
          {(selectedDistrict || selectedUpazila || negativeRate !== 0.25) && (
            <button
              onClick={() => {
                setSelectedDistrict('');
                setSelectedUpazila('');
                setNegativeRate(0.25);
              }}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              রিসেট
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
            placeholder="ইউজার নাম, ফোন, জেলা অথবা উপজেলা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0">
          সর্বমোট রেকর্ড: <span className="text-white font-bold">{marksheet.length}</span> জন (ফিল্টারড: {filteredMarksheet.length} জন)
        </div>
      </div>

      {/* Marksheet Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-400 mb-3" />
            মার্কশিট লোড হচ্ছে...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 uppercase font-semibold text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">User (ইউজার)</th>
                  <th className="py-3.5 px-4">District (জেলা)</th>
                  <th className="py-3.5 px-4">Upazila (উপজেলা)</th>
                  <th className="py-3.5 px-4 text-center">All Answer (মোট উত্তর)</th>
                  <th className="py-3.5 px-4 text-center">Correct Answer (সঠিক)</th>
                  <th className="py-3.5 px-4 text-center">Wrong Answer (ভুল)</th>
                  <th className="py-3.5 px-4 text-center">Negative (নেগেটিভ)</th>
                  <th className="py-3.5 px-4 text-center">Total Mark (মোট নম্বর)</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {paginatedMarksheet.length > 0 ? (
                  paginatedMarksheet.map((u, i) => {
                    const slNo = (currentPage - 1) * ITEMS_PER_PAGE + i + 1;
                    return (
                      <tr key={u.id || i} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {slNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.phone}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {u.district || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-medium">
                          {u.upazila || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-200">
                          {u.all_answer}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {u.correct_answer}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-400 border border-red-500/30">
                            {u.wrong_answer}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            -{u.negative_mark}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-black font-mono bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm">
                            {u.total_mark}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedRecord(u)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-lg text-xs font-medium transition-all shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>ডিটেইলস</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="py-10 text-center text-slate-500">
                      কোনো ফলাফল খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredMarksheet.length > 0 && (
          <div className="p-4 bg-slate-900 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              প্রদর্শন করা হচ্ছে{' '}
              <span className="font-semibold text-white">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              থেকে{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredMarksheet.length)}
              </span>{' '}
              (সর্বমোট <span className="font-semibold text-white">{filteredMarksheet.length}</span> জন)
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

      {/* Detailed Modal Pop-up */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ইউজার মার্কশিট সামারি</h3>
                  <p className="text-xs text-slate-400">আইডি: #{selectedRecord.id || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    ইউজার নাম
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <User className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedRecord.name}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    ফোন / ইমেইল
                  </span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedRecord.phone}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    জেলা
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedRecord.district || 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    উপজেলা
                  </span>
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-indigo-400 shrink-0" />
                    {selectedRecord.upazila || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Performance Score Card Grid */}
              <div className="pt-2 border-t border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  ফলাফল হিসাব ও মার্কস
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">মোট উত্তর</span>
                    <span className="text-lg font-black text-white font-mono">{selectedRecord.all_answer}</span>
                  </div>
                  <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-[10px] text-emerald-400 uppercase block font-semibold">সঠিক উত্তর</span>
                    <span className="text-lg font-black text-emerald-300 font-mono">{selectedRecord.correct_answer}</span>
                  </div>
                  <div className="bg-red-950/40 p-3 rounded-xl border border-red-500/30 text-center">
                    <span className="text-[10px] text-red-400 uppercase block font-semibold">ভুল উত্তর</span>
                    <span className="text-lg font-black text-red-300 font-mono">{selectedRecord.wrong_answer}</span>
                  </div>
                  <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-[10px] text-amber-400 uppercase block font-semibold">নেগেটিভ</span>
                    <span className="text-lg font-black text-amber-300 font-mono">-{selectedRecord.negative_mark}</span>
                  </div>
                </div>

                <div className="mt-3 p-4 bg-indigo-950/50 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-200">সর্বমোট প্রাপ্ত নম্বর (Total Mark):</span>
                  <span className="text-2xl font-black text-indigo-300 font-mono">{selectedRecord.total_mark}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
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
