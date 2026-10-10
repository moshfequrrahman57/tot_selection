import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Users, ArrowLeft, Menu, X, LogOut, FileText, HelpCircle, KeyRound, AlertCircle } from 'lucide-react';
import useAdminAccess from './useAdminAccess';

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Shared admin access gate
  const {
    accessCode,
    setAccessCode,
    isUnlocked,
    secretError,
    verifying,
    handleVerifyCode,
    handleLock,
  } = useAdminAccess();

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'User Answers', path: '/admin/answers', icon: FileText },
    { name: 'Question Management', path: '/admin/questions', icon: HelpCircle },
  ];

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // If not unlocked, show access code verification form instead of any admin content
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center font-sans">
        <div className="max-w-md w-full mx-4 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
              <KeyRound className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">এডমিন অ্যাক্সেস ভেরিফিকেশন</h2>
            <p className="text-sm text-slate-400">
              এডমিন প্যানেল ব্যবহারের জন্য অনুগ্রহ করে আপনার সিক্রেট অ্যাক্সেস কোডটি দিন।
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

          {/* Return to Main App */}
          <button
            onClick={() => navigate('/instructions')}
            className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>মূল অ্যাপে ফিরে যান</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-wide block leading-none">
                  Admin Portal
                </span>
                <span className="text-xs text-indigo-400 font-medium">TOT Selection System</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleLock}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-red-500/30 text-xs font-medium text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>লক করুন</span>
              </button>
              <Link
                to="/instructions"
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-slate-600 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Main Application</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-700 space-y-2">
              <button
                onClick={() => {
                  handleLock();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-600/20"
              >
                <LogOut className="h-4 w-4" />
                <span>লক করুন</span>
              </button>
              <Link
                to="/instructions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Main App</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} TOT Selection System - Administrator Console</p>
      </footer>
    </div>
  );
}
