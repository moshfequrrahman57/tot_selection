import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Alphabetically sorted list of all 64 districts of Bangladesh
const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", 
  "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", 
  "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", 
  "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", 
  "Khagrachhari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", 
  "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", 
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", 
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", 
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", 
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", 
  "Tangail", "Thakurgaon"
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration submission logic here
    console.log('Registering user with:', formData);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center  px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 sm:p-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md shadow-indigo-100">
            S
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please fill in your details to get started.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-5 w-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Phone className="h-5 w-5" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* District Dropdown Field */}
          <div>
            <label htmlFor="district" className="block text-sm font-semibold text-slate-700 mb-1.5">
              District
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin className="h-5 w-5" />
              </div>
              <select
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
              >
                <option value="" disabled hidden>Select your district</option>
                {BANGLADESH_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {/* Custom Dropdown Chevron Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
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

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-all duration-150 hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>

        {/* Alternative Flow Link */}
        <div className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
    Sign in
       </Link>
        </div>

      </div>
    </div>
  );
}
