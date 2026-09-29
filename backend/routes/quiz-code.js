
import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js'

const quiz_code_route=express.Router();

// এক্সপ্রেস এপিআই (server.js বা আপনার প্রশ্ন সংক্রান্ত রাউটারে)
quiz_code_route.post('/quiz', (req, res) => {
  const { accessCode } = req.body;

  // এখানে আপনি যেকোনো সংখ্যা সেট করতে পারেন (যেমন: 12345)
  const CORRECT_CODE = "12345"; 

  if (!accessCode) {
    return res.status(400).json({ success: false, error: 'অনুগ্রহ করে কোডটি দিন।' });
  }

  if (String(accessCode) === CORRECT_CODE) {
    return res.json({ success: true, message: 'কোড মিলেছে!' });
  } else {
    return res.status(401).json({ success: false, error: 'ভুল কোড! আবার চেষ্টা করুন।' });
  }
});

export default quiz_code_route;