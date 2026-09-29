import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js'


const question_route=express.Router();

question_route.get('/fetch',protect, async (req, res)=>{
    try {
    const result = await pool.query(
      'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions ORDER BY RANDOM() LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default question_route;