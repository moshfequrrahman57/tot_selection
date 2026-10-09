import express from 'express';
import pool from '../config/db.js';
import protect from '../middleware/auth_middleware.js';
import redis from 'redis';

const question_route = express.Router();

// 🟢 Dynamic Production and Docker Friendly Connection
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err.message));

// Connect to Redis safely
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis successfully!');
    } catch (err) {
        console.error('Redis connection warning:', err.message);
    }
})();

// Helper function to invalidate questions Redis cache
const clearQuestionsCache = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.del('quiz:all_questions');
            console.log('🟢 Cache Cleared: quiz:all_questions');
        }
    } catch (err) {
        console.error('Redis cache invalidation error:', err.message);
    }
};

// 1. GET /api/questions/fetch - Fetch questions for quiz takers (Cached in Redis)
question_route.get('/fetch', protect, async (req, res) => {
    const cacheKey = 'quiz:all_questions';
    try {
        if (redisClient.isOpen) {
            const cachedQuestions = await redisClient.get(cacheKey);
            if (cachedQuestions) {
                console.log('🟢 Cache Hit: Fetching from Redis');
                return res.json(JSON.parse(cachedQuestions));
            }
        }

        console.log('🔴 Cache Miss: Fetching from PostgreSQL');
        const result = await pool.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions ORDER BY id ASC'
        );
        const questionsFromDB = result.rows;
        
        if (redisClient.isOpen) {
            await redisClient.set(cacheKey, JSON.stringify(questionsFromDB), { EX: 3600 });
        }
        res.json(questionsFromDB);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET /api/questions/all (or /api/questions) - Fetch all questions with correct_answer for Management
question_route.get('/all', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer FROM questions ORDER BY id ASC'
        );
        res.json({ success: true, questions: result.rows });
    } catch (err) {
        console.error('Error fetching all questions for admin:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

question_route.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer FROM questions ORDER BY id ASC'
        );
        res.json({ success: true, questions: result.rows });
    } catch (err) {
        console.error('Error fetching all questions:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. POST /api/questions (and /api/questions/add) - Add a new question
const addQuestionHandler = async (req, res) => {
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
        return res.status(400).json({ 
            success: false, 
            error: 'সবগুলো ফিল্ড (প্রশ্ন, অপশন ক-ঘ এবং সঠিক উত্তর) পূরণ করা আবশ্যক!' 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, question_text, option_a, option_b, option_c, option_d, correct_answer`,
            [question_text.trim(), option_a.trim(), option_b.trim(), option_c.trim(), option_d.trim(), correct_answer.trim()]
        );

        await clearQuestionsCache();

        res.status(201).json({
            success: true,
            message: 'প্রশ্ন সফলভাবে তৈরি করা হয়েছে!',
            question: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

question_route.post('/add', addQuestionHandler);
question_route.post('/', addQuestionHandler);

// 4. PUT /api/questions/:id (and /api/questions/update/:id) - Update an existing question
const updateQuestionHandler = async (req, res) => {
    const { id } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
        return res.status(400).json({ 
            success: false, 
            error: 'সবগুলো ফিল্ড (প্রশ্ন, অপশন ক-ঘ এবং সঠিক উত্তর) পূরণ করা আবশ্যক!' 
        });
    }

    try {
        const result = await pool.query(
            `UPDATE questions 
             SET question_text = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_answer = $6 
             WHERE id = $7 
             RETURNING id, question_text, option_a, option_b, option_c, option_d, correct_answer`,
            [question_text.trim(), option_a.trim(), option_b.trim(), option_c.trim(), option_d.trim(), correct_answer.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'প্রশ্ন খুঁজে পাওয়া যায়নি!' });
        }

        await clearQuestionsCache();

        res.json({
            success: true,
            message: 'প্রশ্ন সফলভাবে আপডেট করা হয়েছে!',
            question: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating question:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

question_route.put('/update/:id', updateQuestionHandler);
question_route.put('/:id', updateQuestionHandler);

// 5. DELETE /api/questions/:id (and /api/questions/delete/:id) - Delete a question
const deleteQuestionHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM questions WHERE id = $1 RETURNING id, question_text',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'প্রশ্ন খুঁজে পাওয়া যায়নি!' });
        }

        await clearQuestionsCache();

        res.json({
            success: true,
            message: 'প্রশ্ন সফলভাবে মুছে ফেলা হয়েছে!',
            deletedQuestion: result.rows[0]
        });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

question_route.delete('/delete/:id', deleteQuestionHandler);
question_route.delete('/:id', deleteQuestionHandler);

export default question_route;