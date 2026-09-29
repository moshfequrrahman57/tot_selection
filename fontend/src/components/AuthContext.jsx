// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // অ্যাপ লোড হওয়ার সময় বা টোকেন চেঞ্জ হলে ডেটা অটো-ফেচ হবে
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:6001/login/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user); // ডাটাবেজ থেকে আসা ইউজার অবজেক্ট
      } else {
        localStorage.removeItem('token'); // ইনভ্যালিড টোকেন হলে রিমুভ
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
