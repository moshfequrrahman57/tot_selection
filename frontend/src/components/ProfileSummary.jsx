// src/components/ProfileSummary.jsx
import React, { useState , useEffect} from 'react';

export default function ProfileSummary() {
  // যদি ইউজার ডেটা এখনো লোড না হয়ে থাকে
const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const getUserProfile = async () => {
    const token = localStorage.getItem('token'); // লোকাল স্টোরেজ থেকে টোকেন নেওয়া

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // টোকেনটি পাঠানো হচ্ছে
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log("ডাটাবেজ থেকে আসা ইউজারের তথ্য:", data.user);
        // এখানে আপনি স্টেট আপডেট করতে পারেন: setUser(data.user);
        setUser(data.user);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
    finally{
        setLoading(false);
    }
  };

  getUserProfile();
}, []);

// ৩. ডেটা লোড হওয়া পর্যন্ত একটি সেফটি মেসেজ দিন
  if (loading) return <p>Loading user details...</p>;
  if (!user) return <p>No user data found.</p>;



  return (
   <>
   
   </>
  );
}
