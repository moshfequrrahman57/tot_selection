import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, Search, RefreshCw, Plus, Edit, Trash2, X, 
  CheckCircle2, AlertCircle, ArrowLeft, BookOpen, Check, ListOrdered
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // null = adding new
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'option_a'
  });

  // Delete confirmation modal state
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6001';

  // Fetch All Questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/questions/all`);
      if (response.data?.success && Array.isArray(response.data.questions)) {
        setQuestions(response.data.questions);
      } else if (Array.isArray(response.data)) {
        setQuestions(response.data);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      // Fallback try standard /api/questions endpoint
      try {
        const fallbackRes = await axios.get(`${API_URL}/api/questions`);
        if (fallbackRes.data?.questions) {
          setQuestions(fallbackRes.data.questions);
        } else if (Array.isArray(fallbackRes.data)) {
          setQuestions(fallbackRes.data);
        }
      } catch (fallbackErr) {
        setError(err.response?.data?.error || err.message || 'প্রশ্ন তালিকা লোড করতে ব্যর্থ হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Open modal for Adding a new Question
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'option_a'
    });
    setError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing Question
  const handleOpenEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text || '',
      option_a: question.option_a || '',
      option_b: question.option_b || '',
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      correct_answer: question.correct_answer || 'option_a'
    });
    setError('');
    setIsModalOpen(true);
  };

  // Close form modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setError('');
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = formData;
    if (!question_text.trim() || !option_a.trim() || !option_b.trim() || !option_c.trim() || !option_d.trim() || !correct_answer) {
      setError('অনুগ্রহ করে প্রশ্ন, ৪টি অপশন এবং সঠিক উত্তর পূরণ করুন।');
      return;
    }

    setSubmitting(true);

    try {
      if (editingQuestion) {
        // UPDATE existing question
        const response = await axios.put(`${API_URL}/api/questions/${editingQuestion.id}`, formData);
        if (response.data?.success) {
          const updatedQ = response.data.question;
          setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
          setSuccessMsg('প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!');
          setIsModalOpen(false);
        }
      } else {
        // ADD new question
        const response = await axios.post(`${API_URL}/api/questions`, formData);
        if (response.data?.success) {
          const newQ = response.data.question;
          setQuestions((prev) => [...prev, newQ]);
          setSuccessMsg('নতুন প্রশ্ন সফলভাবে যুক্ত করা হয়েছে!');
          setIsModalOpen(false);
        }
      }

      // Auto clear success message after 4 seconds
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'অপারেশনটি সম্পন্ন করা যায়নি');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    setError('');
    try {
      const response = await axios.delete(`${API_URL}/api/questions/${questionToDelete.id}`);
      if (response.data?.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete.id));
        setSuccessMsg('প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'প্রশ্ন মুছে ফেলা সম্ভব হয়নি');
    } finally {
      setQuestionToDelete(null);
    }
  };

  // Filtered Questions based on Search Term
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const term = searchTerm.toLowerCase();
      const qText = (q.question_text || '').toLowerCase();
      const optA = (q.option_a || '').toLowerCase();
      const optB = (q.option_b || '').toLowerCase();
      const optC = (q.option_c || '').toLowerCase();
      const optD = (q.option_d || '').toLowerCase();
      return qText.includes(term) || optA.includes(term) || optB.includes(term) || optC.includes(term) || optD.includes(term);
    });
  }, [questions, searchTerm]);

  // Helper to format option key to label
  const getOptionLabel = (key) => {
    switch (key) {
      case 'option_a': return 'ক';
      case 'option_b': return 'খ';
      case 'option_c': return 'গ';
      case 'option_d': return 'ঘ';
      default: return key;
    }
  };

  // Helper to get correct answer display text
  const getCorrectAnswerText = (question) => {
    const key = question.correct_answer;
    if (!key) return 'N/A';
    if (question[key]) {
      return `${getOptionLabel(key)}: ${question[key]}`;
    }
    // Handle case where correct_answer is 'a', 'b', 'c', 'd' or 'option_a'
    if (key === 'a' || key === 'option_a') return `ক: ${question.option_a || ''}`;
    if (key === 'b' || key === 'option_b') return `খ: ${question.option_b || ''}`;
    if (key === 'c' || key === 'option_c') return `গ: ${question.option_c || ''}`;
    if (key === 'd' || key === 'option_d') return `ঘ: ${question.option_d || ''}`;
    return key;
  };

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
            <HelpCircle className="h-6 w-6 text-indigo-400" />
            প্রশ্ন ও উত্তর ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-slate-400">কুইজ পরীক্ষার জন্য প্রশ্ন সংযোজন, পরিমার্জন ও বিলোপসাধন করুন</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchQuestions}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md hover:shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>নতুন প্রশ্ন যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Global Alert Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && !isModalOpen && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="প্রশ্ন অথবা অপশন দিয়ে সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0">
          সর্বমোট প্রশ্ন: <span className="text-white font-bold">{questions.length}</span> টি
          {searchTerm && ` (ফিল্টারড: ${filteredQuestions.length} টি)`}
        </div>
      </div>

      {/* Questions Card List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-400 text-sm">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-indigo-400 mb-3" />
            প্রশ্নসমূহ লোড হচ্ছে...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-400 text-sm">
            <BookOpen className="h-10 w-10 mx-auto text-slate-600 mb-3" />
            {searchTerm ? 'সার্চ রেজাল্টে কোনো প্রশ্ন পাওয়া যায়নি।' : 'কোনো প্রশ্ন যুক্ত করা নেই। "নতুন প্রশ্ন যোগ করুন" বাটনে ক্লিক করে প্রশ্ন যোগ করুন।'}
          </div>
        ) : (
          filteredQuestions.map((q, index) => {
            const isAnswerA = q.correct_answer === 'option_a' || q.correct_answer === 'a';
            const isAnswerB = q.correct_answer === 'option_b' || q.correct_answer === 'b';
            const isAnswerC = q.correct_answer === 'option_c' || q.correct_answer === 'c';
            const isAnswerD = q.correct_answer === 'option_d' || q.correct_answer === 'd';

            return (
              <div 
                key={q.id || index}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 shadow-sm transition-all"
              >
                {/* Header: Question ID & Actions */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold h-7 w-7 rounded-lg shrink-0 mt-0.5 font-mono">
                      #{q.id || index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-white leading-relaxed">
                      {q.question_text}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      title="প্রশ্ন এডিট করুন"
                      className="p-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setQuestionToDelete(q)}
                      title="প্রশ্ন মুছে ফেলুন"
                      className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-xs transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                  {/* Option A */}
                  <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isAnswerA 
                      ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' 
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  }`}>
                    <span className="font-medium">
                      <strong className="text-indigo-400 mr-2">ক.</strong> {q.option_a}
                    </span>
                    {isAnswerA && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-md shrink-0">
                        <Check className="h-3 w-3" /> সঠিক উত্তর
                      </span>
                    )}
                  </div>

                  {/* Option B */}
                  <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isAnswerB 
                      ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' 
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  }`}>
                    <span className="font-medium">
                      <strong className="text-indigo-400 mr-2">খ.</strong> {q.option_b}
                    </span>
                    {isAnswerB && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-md shrink-0">
                        <Check className="h-3 w-3" /> সঠিক উত্তর
                      </span>
                    )}
                  </div>

                  {/* Option C */}
                  <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isAnswerC 
                      ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' 
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  }`}>
                    <span className="font-medium">
                      <strong className="text-indigo-400 mr-2">গ.</strong> {q.option_c}
                    </span>
                    {isAnswerC && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-md shrink-0">
                        <Check className="h-3 w-3" /> সঠিক উত্তর
                      </span>
                    )}
                  </div>

                  {/* Option D */}
                  <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isAnswerD 
                      ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200' 
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  }`}>
                    <span className="font-medium">
                      <strong className="text-indigo-400 mr-2">ঘ.</strong> {q.option_d}
                    </span>
                    {isAnswerD && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-md shrink-0">
                        <Check className="h-3 w-3" /> সঠিক উত্তর
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Badge showing correct answer */}
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
                  <span className="font-medium">
                    সঠিক উত্তর: <span className="text-emerald-400 font-bold">{getCorrectAnswerText(q)}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
                  {editingQuestion ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingQuestion ? 'প্রশ্ন এডিট করুন' : 'নতুন প্রশ্ন তৈরি করুন'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingQuestion ? `প্রশ্ন আইডি: #${editingQuestion.id}` : 'কুইজের জন্য একটি নতুন প্রশ্ন ফরম পূরণ করুন'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  প্রশ্ন লিখুন <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="question_text"
                  rows={3}
                  placeholder="যেমন: বাংলাদেশের রাজধানী কী?"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              {/* Option A & B */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    অপশন ক (Option A) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="option_a"
                    placeholder="অপশন ক"
                    value={formData.option_a}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    অপশন খ (Option B) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="option_b"
                    placeholder="অপশন খ"
                    value={formData.option_b}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Option C & D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    অপশন গ (Option C) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="option_c"
                    placeholder="অপশন গ"
                    value={formData.option_c}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    অপশন ঘ (Option D) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="option_d"
                    placeholder="অপশন ঘ"
                    value={formData.option_d}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Correct Answer Dropdown */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  সঠিক উত্তর নির্বাচন করুন <span className="text-red-400">*</span>
                </label>
                <select
                  name="correct_answer"
                  value={formData.correct_answer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-emerald-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                >
                  <option value="option_a">ক (Option A): {formData.option_a || 'ক'}</option>
                  <option value="option_b">খ (Option B): {formData.option_b || 'খ'}</option>
                  <option value="option_c">গ (Option C): {formData.option_c || 'গ'}</option>
                  <option value="option_d">ঘ (Option D): {formData.option_d || 'ঘ'}</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingQuestion ? 'আপডেট করুন' : 'সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setQuestionToDelete(null)}
        >
          <div 
            className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">প্রশ্ন মুছে ফেলতে চান?</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              আপনি কি নিশ্চিত যে প্রশ্ন #{questionToDelete.id}: <strong className="text-white">"{questionToDelete.question_text}"</strong> স্থায়ীভাবে ডিলিট করতে চান?
            </p>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-lg"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
