import express from 'express';
import pool from '../config/db.js';    
import protect from '../middleware/auth_middleware.js';

const profileinfo_route =express.Router();


profileinfo_route.get('/profile',protect, async (req, res)=>{
     try {
    // ১. মিডলওয়্যার থেকে ইউজারের আইডি পাওয়া যাবে req.user.id এ
    const userId = req.user.userId; 

    // ২. Parameterized Query ব্যবহার করে ডাটাবেজ থেকে তথ্য আনা
    const queryText = 'SELECT id, name, phone, division, district, upazila, institute, created_at, no_of_attempt FROM users WHERE id = $1';
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


// POST route: Update no_of_attempt to 1 for first-time exam takers
profileinfo_route.post('/update-attempt', protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Update no_of_attempt to 1 only if it is currently NULL
    const queryText = 'UPDATE users SET no_of_attempt = 1 WHERE id = $1 AND no_of_attempt IS NULL RETURNING no_of_attempt';
    const result = await pool.query(queryText, [userId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Attempt already recorded or user not found." });
    }

    res.status(200).json({ message: "Attempt recorded successfully.", no_of_attempt: result.rows[0].no_of_attempt });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


export default profileinfo_route;