import express from 'express';
import pool from '../config/db.js';    
import protect from '../middleware/auth_middleware.js';

const profileinfo_route =express.Router();


profileinfo_route.get('/profile',protect, async (req, res)=>{
     try {
    // ১. মিডলওয়্যার থেকে ইউজারের আইডি পাওয়া যাবে req.user.id এ
    const userId = req.user.userId; 

    // ২. Parameterized Query ব্যবহার করে ডাটাবেজ থেকে তথ্য আনা
    const queryText = 'SELECT id, name, phone, division, district, upazila, institute, created_at FROM users WHERE id = $1';
    const result = await pool.query(queryText, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // ৩. ইউজারের তথ্য ফ্রন্টএন্ডে রেসপন্স হিসেবে পাঠানো (পাসওয়ার্ড ছাড়া)
    res.status(200).json({ user: result.rows[0] });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default profileinfo_route;