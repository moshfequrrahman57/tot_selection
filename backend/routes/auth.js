import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const auth_router = express.Router();


auth_router.post('/register', async (req, res) => {
  const { phone, password , name, division, district, upazila, institute} = req.body;
  

  try {
    // ইউজার ইতিমধ্যে আছে কিনা চেক করা
    const userExist = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ডাটাবেজে ইউজার সেভ করা
    const newUser = await pool.query(
      'INSERT INTO users (phone, password, name, division, district, upazila, institute) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, phone, name, division, district, upazila, institute',
      [phone, hashedPassword,name,division,district,upazila, institute]
    );

    res.status(201).json({ message: 'Registration successful', user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ২. লগইন রুট
auth_router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  // .env ফাইলে JWT_SECRET="আপনার_একটি_গোপন_কোড" লিখে রাখবেন
  const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123'; 

  try {
    // মোবাইল নম্বর চেক করা
    const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid phone no' });
    }

    const user = userResult.rows[0];

    // পাসওয়ার্ড ম্যাচ করা
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid  password!' });
    }

    // JWT টোকেন তৈরি করা (১ ঘণ্টার জন্য কার্যকর)
    const token = jwt.sign(
      { userId: user.id, phone: user.phone }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // টোকেনটি রেসপন্স হিসেবে পাঠানো
    res.json({
      message: 'Successful login',
      token: token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default auth_router;