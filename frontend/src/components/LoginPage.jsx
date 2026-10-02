import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Phone } from 'lucide-react'; // Optional: install lucide-react for sharp icons
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    phone: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { fetchUserProfile } = useContext(AuthContext); // ফাংশনটি আনুন
  const navigate=useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Signals Express to parse JSON
        },
        body: JSON.stringify(credentials), // Sends { mobile, password }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Login successful!');
        const token = data.token; // Assuming your backend returns a JWT token
        // OPTIONAL: If your API returns a JWT token or user data, save it here
        localStorage.setItem('token', data.token);
        // 🌟 ম্যাজিক লাইন: এটি কল করার সাথে সাথে গ্লোবাল স্টেট আপডেট হবে
        await fetchUserProfile(token); 
        navigate('/homepage');
        console.log('Logged in user info:', data);
      } else {
        // Displays backend validation or database errors (e.g., "Invalid credentials")
        setErrorMessage(data.error || 'Login failed.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      setErrorMessage('Unable to connect to the server. Please check your network.');
    }
  };

  return (
   <div className="flex min-h-screen w-full items-center justify-center  px-4  sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 sm:p-10">
        

        {/* Main Form Body */}
        <div className="mx-auto w-full max-w-md my-auto py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back Mr. 
            </h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
            <p className="mt-2 text-sm text-slate-500">
              Please enter your details to access your account.
            </p>
          </div>

          {/* Core Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="username"
                  required
                  value={credentials['phone']}
                  onChange={(e) => setCredentials((prev)=>({...prev,phone:e.target.value}))}
                  placeholder="017XXXXXXXX"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={credentials['password']}
                  onChange={(e) => setCredentials((prev)=>({...prev, password:e.target.value}))}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 selection:bg-transparent">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Primary Submit CTA */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-all duration-150 hover:bg-indigo-700 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.99]"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

        
        </div>

        {/* Footer Flow Alternation */}
        <div className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
    Create an account
  </Link>
        </div>
      </div>

    </div>
  );
}
