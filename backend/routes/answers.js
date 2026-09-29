import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js';

const answer_route=express.Router();




// POST API Endpoint to insert user responses
answer_route.post('/submit-quiz',protect, async (req, res) => {
  const { name, phone, division, district, upazila, institute, answers } = req.body;

  // Basic Validation
  if (!name || !phone || !answers) {
    return res.status(400).json({ error: 'Name, Phone, and Answers are required.' });
  }

  try {
    const queryText = `
      INSERT INTO user_answers (name, phone, division, district, upazila, institute, answers) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
    `;
    
    // JSON.stringify conversion is required by the 'pg' library when inserting into JSONB fields
    const values = [name, phone, division, district, upazila, institute, JSON.stringify(answers)];
    
    const result = await pool.query(queryText, values);
    
    res.status(201).json({ 
      success: true, 
      message: 'Submission saved successfully!', 
      data: result.rows[0] 
    });

  } catch (error) {
    console.error('Database Error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(400).json({ error: 'This phone number has already submitted the quiz.' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default answer_route;