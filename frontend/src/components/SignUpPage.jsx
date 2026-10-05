import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, User, Phone, MapPin, House, LandmarkIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 


export default function SignUpPage() {
const BANGLADESH = {
  "Barishal": {
    "Barisal": ["Bakerganj", "Muladi", "Uzirpur"],
    "Bhola": ["Borhanuddin", "Char Fasson"],
    "Jhalokati": ["Nalchity", "Kathalia"],
    "Pirojpur": ["Nesarabad", "Bhandaria"],
    "Barguna": ["Bamna", "Amtali"],
    "Patuakhali": ["Bauphal", "Galachipa"]
  },
  "Dhaka": {
    "Dhaka": ["Savar", "Nawabganj"],
    "Gazipur": ["Kaliganj", "Sreepur"],
    "Munshiganj": ["Tongibari"],
    "Narayanganj": ["Sonargaon"],
    "Narsingdi": ["Raipura", "Monohardi"],
    "Faridpur": ["Boalmari", "Sadarpur"],
    "Gopalganj": ["Tungipara", "Muksudpur"],
    "Madaripur": ["Kalkini"],
    "Rajbari": ["Baliakandi"],
    "Shariatpur": ["Nariya"],
    "Tangail": ["Kalihati", "Ghatail", "Mirzapur"]
  },
  "Mymensingh": {
    "Mymensingh": ["Gafargaon", "Gouripur", "Haluaghat", "Trishal"],
    "Jamalpur": ["Islampur", "Madarganj"],
    "Sherpur": ["Nalitabari"],
    "Netrokona": ["Atpara", "Purbadhala"]
  },
  "Rajshahi": {
    "Sirajganj": ["Ullahpara", "Kazipur", "Shahjadpur"],
    "Rajshahi": ["Paba", "Tanor", "Puthia", "Bagmara"],
    "Chapainawabganj": ["Nachole", "Shibganj"],
    "Natore": ["Gurudaspur", "Bagatipara"],
    "Naogaon": ["Manda", "Patnitala", "Porsha"],
    "Pabna": ["Sujanagar", "Atgharia"],
    "Joypurhat": ["Khetlal"],
    "Bogra": ["Nandigram", "Gabtali", "Shibganj"]
  },
  "Chattogram": {
    "Chattogram": ["Raozan", "Sitakunda", "Patiya", "Chandanaish"],
    "Cox's Bazar": ["Chakaria", "Ramu"],
    "Feni": ["Chhagalnaiya"],
    "Lakshmipur": ["Raipur"],
    "Noakhali": ["Chatkhil", "Companiganj"],
    "Khagrachhari": ["Khagrachhari Sadar"],
    "Rangamati": ["Rangamati Sadar"],
    "Chandpur": ["Matlab Dakshin", "Faridganj"],
    "Comilla": ["Chauddagram", "Burichang", "Chandina", "Daudkandi"],
    "Brahmanbaria": ["Sarail", "Nabinagar"]
  },
  "Sylhet": {
    "Sylhet": ["Beanibazar", "Sylhet Sadar"],
    "Habiganj": ["Chunarughat", "Baniyachong"],
    "Moulvibazar": ["Kulaura", "Rajnagar"],
    "Sunamganj": ["Chhatak", "Jamalganj"]
  },
  "Khulna": {
    "Khulna": ["Paikgacha", "Dumuria", "Dighalia"],
    "Satkhira": ["Kaliganj"],
    "Jessore": ["Manirampur", "Bagherpara", "Jhikargacha"],
    "Jhenaidah": ["Maheshpur", "Shailkupa"],
    "Magura": ["Mohammadpur"],
    "Narail": ["Lohagara"],
    "Chuadanga": ["Damurhuda"],
    "Meherpur": ["Gangni"],
    "Kushtia": ["Kumarkhali", "Daulatpur"]
  },
  "Rangpur": {
    "Gaibandha": ["Sadullapur", "Gobindaganj"],
    "Kurigram": ["Ulipur", "Nageshwari"],
    "Lalmonirhat": ["Kaliganj"],
    "Nilphamari": ["Kishoreganj", "Dimla"],
    "Rangpur": ["Pirganj", "Badarganj", "Kaunia"],
    "Dinajpur": ["Parbatipur", "Nawabganj", "Birganj", "Biral"],
    "Panchagarh": ["Debiganj"],
    "Thakurgaon": ["Baliadangi", "Ranishankail"]
  }
};


  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    district: '',
    upazila: '',
    institute: '',
    password: '',
  });
  const [selectedDivision, setSelectedDivision]=useState("");
  const [selectedDistrict, setSelectedDistrict]=useState("");
  const [selectedUpazila, setSelectedUpazila]=useState("");
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    //console.log('Form Data Updated:', { ...formData, [name]: value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent standard page refresh
    console.log({...formData});
    setIsSubmitting(true); // সাবমিট প্রক্রিয়া শুরু হলে বাটন লক হবে
    // একটি রানিং টোস্ট লোডার দেখাবে যা ব্যাকএন্ড রেসপন্স না পাওয়া পর্যন্ত স্ক্রিনে থাকবে
    const loadingToast = toast.loading('Registering account...'); 

    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Inform API that JSON data is coming
        },
        body: JSON.stringify(formData), // Convert state object to JSON string
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration Successful!');
        // Clear form values if needed
        // লোডিং টোস্টটি পরিবর্তন হয়ে সাকসেস মেসেজ দেখাবে
        toast.success('Registration Successful!', { id: loadingToast });
        setFormData({name: '',phone: '', division: '',district: '', upazila: '',institute: '',password: '',});
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage(data.message);
        toast.error(data.message || 'Registration Failed', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
      toast.error('Could not connect to the server.', { id: loadingToast });
      setMessage('Could not connect to the server.');
    }
    finally {
      setIsSubmitting(false); // সাবমিট প্রক্রিয়া শেষ হলে বাটন আনলক হবে
    }
  };


  useEffect(()=>{
   // console.log({...formData});
  },[formData])

  return (
    <div className="flex min-h-screen w-full items-center justify-center  px-4 sm:px-6 lg:px-8 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

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
          {message && <p className='text-red-400'>{message}</p>}
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
                pattern="[0-9]{11}"
                maxLength={11}
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* division Dropdown Field */}
          <div>
            <label htmlFor="division" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Division
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin className="h-5 w-5" />
              </div>
              <select
                id="division"
                name="division"
                required
                value={selectedDivision}
                onChange={(e)=>{
                  const newDivision=e.target.value;
                  setSelectedDivision(newDivision);
                  setFormData((prev)=>({...prev, division:newDivision, district:"", upazila:""}));
                  setSelectedDistrict("");
                  setSelectedUpazila("");
                
                  
                }}
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
              >
                <option value="" >Select your division</option>
                {Object.keys(BANGLADESH).map((division) => (
                  <option key={division} value={division}>
                    {division}
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
        { /* District Dropdown Field */}
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
                value={selectedDistrict}
                onChange={(e)=>{
                  const newDistrict=e.target.value;
                  setSelectedDistrict(newDistrict);
                  setFormData((prev)=>({...prev,district:newDistrict,upazila:""}));
                  setSelectedUpazila("");
                  
                  
                }}
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
              >
                <option value="" >Select your district</option>
                { selectedDivision && Object.keys(BANGLADESH[selectedDivision]).map(district=>{
                return  <option key={district} value={district}>{district}</option>
                })}
              </select>
              {/* Custom Dropdown Chevron Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            </div>



   { /* Upazila Dropdown Field */}
        <div>
            <label htmlFor="upazila" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Upazila
            </label>
             <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin className="h-5 w-5" />
              </div>
              <select
                id="upazila"
                name="upazila"
                required
                value={selectedUpazila}
                onChange={(e)=>{
                  const newUpazila=e.target.value;
                  setSelectedUpazila(newUpazila);
                  setFormData((prev)=>({...prev,upazila:newUpazila}));
                  
                  
                }}
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer"
              >
                <option value="" >Select your upazila</option>
                { selectedDivision && selectedDistrict && BANGLADESH[selectedDivision][selectedDistrict]?.map(upazila=>{
                 return <option key={upazila} value={upazila}>{upazila}</option>
                })}
              </select>
              {/* Custom Dropdown Chevron Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            </div>

      {/*Institute Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Institute
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <LandmarkIcon className="h-5 w-5" />
              </div>
              <input
                id="institute"
                name="institute"
                type="text"
                required
                value={formData.institute}
                onChange={handleChange}
                placeholder="Ideal High School"
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
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
          {/* Submit Button (লোডার এবং ডিজেবল লজিকসহ) */}
          <button
            type="submit"
            disabled={isSubmitting} // সাবমিট হওয়ার সময় বাটন লক হয়ে যাবে
            className="w-full flex items-center justify-center rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-100 outline-none transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              // বাটনের ভেতরের স্পিনার লোডার
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Sign Up'
            )}
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
