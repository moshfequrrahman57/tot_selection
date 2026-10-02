// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // অ্যাপ লোড হওয়ার সময় বা টোকেন চেঞ্জ হলে ডেটা অটো-ফেচ হবে
  const fetchUserProfile = async (tokenParam=null) => {
    const token = tokenParam || localStorage.getItem('token');
    console.log('Fetching user profile with token from fetchUserProfile:', token);
    if (!token) {
      setUser(null);
      setLoading(false);
      console.log('No token found, user set to null');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // ডাটাবেজ থেকে আসা ইউজার অবজেক্ট
      } else {
        localStorage.removeItem('token'); // ইনভ্যালিড টোকেন হলে রিমুভ
        console.log("Token remove from auth context due to invalid token or error:", data.error);
        setUser(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
