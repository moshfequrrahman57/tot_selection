import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, User, Phone, MapPin, House, LandmarkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';



export default function SignUpPage() {
  const BANGLADESH = {
 
  Sylhet:   {
      Sylhet: [ "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Sylhet Sadar", "Zakiganj"],
      Moulvibazar: ["Barlekha", "Juri", "Kamalganj", "Kulaura",  "Moulvibazar Sadar", "Rajnagar", "Sreemangal"],
      Habiganj: [ "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"],
      Sunamganj: [ "Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha",  "Dowarabazar", "Jagannathpur", "Jamalganj", "Madhyanagar", "Shalla", "Shantiganj", "Sunamganj Sadar", "Tahirpur"],
    },
  Rangpur: {
    
      Rangpur: ["Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Rangpur Sadar", "Taraganj"],
      Dinajpur: ["Biral", "Birampur", "Birganj", "Bochaganj",  "Chirirbandar", "Dinajpur Sadar", "Fulbari", "Ghoraghat",  "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
      Gaibandha: [ "Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"]
    }, 
  
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    //console.log('Form Data Updated:', { ...formData, [name]: value });
  };

   const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent standard page refresh
    console.log({...formData});
    try {
      const response = await fetch('http://localhost:6001/auth/register', {
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
        setFormData({name: '',phone: '', division: '',district: '', upazila: '',institute: '',password: '',});
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
      setMessage('Could not connect to the server.');
    }
  };


  useEffect(()=>{
   // console.log({...formData});
  },[formData])

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
          {message && <p>{message}</p>}
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
