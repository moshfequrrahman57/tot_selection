import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js'
import redis from 'redis';

const question_route=express.Router();


// 🟢 Dynamic Production and Docker Friendly Connection
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});


redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// সার্ভার চালু হওয়ার সময় রেডিস কানেক্ট করুন
(async () => {
    await redisClient.connect();
    console.log('Connected to Redis successfully!');
})();

question_route.get('/fetch',protect, async (req, res)=>{
  const cacheKey = 'quiz:all_questions';
    try {
       const cachedQuestions = await redisClient.get(cacheKey);
       if (cachedQuestions) {
      console.log('🟢 Cache Hit: Fetching from Redis');
      // রেডিসে ডেটা স্ট্রিং আকারে থাকে, তাই পার্স করে অবজেক্ট বানাতে হবে
      return res.json(JSON.parse(cachedQuestions));
    }

    // খ) ক্যাশে না পাওয়া গেলে (Cache Miss) PostgreSQL থেকে ডেটা আনুন
    console.log('🔴 Cache Miss: Fetching from PostgreSQL');
    const result = await pool.query(
      'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions ORDER BY id ASC LIMIT 20'
    );
    const questionsFromDB = result.rows;
    await redisClient.set(cacheKey, JSON.stringify(questionsFromDB), {
        EX: 3600 
    });
    res.json(questionsFromDB);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: err.message });
  }
});

export default question_route;