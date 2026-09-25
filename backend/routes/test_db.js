import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js';

const router = express.Router();


router.get('/test-db', protect, async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    const carsData  = await pool.query('SELECT * FROM cars');
      res.json({ message: "Success", time: result.rows[0] , cars: carsData.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;