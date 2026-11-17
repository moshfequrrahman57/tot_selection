import express from 'express';
import pool from '../config/db.js';


const admin_route=express.Router();



admin_route.get('/user', async (req, res)=>{
    try{
        const result = await pool.query('select now()');
        let userData;
        try {
            userData = await pool.query(`
                SELECT u.*, 
                       EXISTS (
                           SELECT 1 FROM user_answers ua 
                           WHERE TRIM(ua.phone) = TRIM(u.phone)
                       ) AS is_submitted
                FROM users u
                ORDER BY u.id DESC
            `);
        } catch (dbErr) {
            console.log("user_answers status query fallback:", dbErr.message);
            userData = await pool.query('SELECT u.*, false AS is_submitted FROM users u ORDER BY u.id DESC');
        }
        res.json({ message: "Success", time: result.rows[0], users: userData.rows});
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error -admin");
    }
});

admin_route.post('/secret', async (req, res)=>{
    const { access_code } =req.body;
    try{
        const ADMIN_SECRET_CODE="181126";

        if(!access_code){
            return res.status(400).json({ success: false, error: 'অনুগ্রহ করে সিক্রেট কোডটি দিন '}); 
        }

        if ( String(access_code) === ADMIN_SECRET_CODE){
            return res.json({ success: true, message: 'সিক্রেট কোড মিলেছে ! '}); 
        } else {
            return res.status(401).json({ success: false, error: 'ভুল  সিক্রেট কোড! আবার চেষ্টা করুন।' });
        }
        
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error -admin-verify");
    }
})

admin_route.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'ইউজার খুঁজে পাওয়া যায়নি' });
        }
        res.json({ success: true, message: 'ইউজার সফলভাবে মুছে ফেলা হয়েছে', deletedUser: result.rows[0] });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error - delete user");
    }
});

admin_route.put('/user/:id/attempt', async (req, res) => {
    const { id } = req.params;
    const { no_of_attempt } = req.body;

    if (no_of_attempt === undefined || no_of_attempt === null) {
        return res.status(400).json({ success: false, error: 'অ্যাটেম্পট সংখ্যা দেওয়া আবশ্যক' });
    }

    const attemptVal = parseInt(no_of_attempt, 10);
    if (isNaN(attemptVal) || attemptVal < 0) {
        return res.status(400).json({ success: false, error: 'সঠিক অ্যাটেম্পট সংখ্যা দিন' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check user exists
        const userRes = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, error: 'ইউজার খুঁজে পাওয়া যায়নি' });
        }
        const user = userRes.rows[0];

        // Update no_of_attempt in users table
        const updateRes = await client.query(
            'UPDATE users SET no_of_attempt = $1 WHERE id = $2 RETURNING *',
            [attemptVal, id]
        );

        let answerDeleted = false;
        // When attempt is 0, delete the answer of that user
        if (attemptVal === 0 && user.phone) {
            const deleteAnsRes = await client.query(
                'DELETE FROM user_answers WHERE TRIM(phone) = TRIM($1) RETURNING id',
                [user.phone]
            );
            answerDeleted = (deleteAnsRes.rowCount || 0) > 0;
        }

        await client.query('COMMIT');

        // Check if user still has answers
        let is_submitted = false;
        if (attemptVal !== 0 && user.phone) {
            const ansCheck = await pool.query(
                'SELECT 1 FROM user_answers WHERE TRIM(phone) = TRIM($1) LIMIT 1',
                [user.phone]
            );
            is_submitted = ansCheck.rows.length > 0;
        }

        res.json({
            success: true,
            message: attemptVal === 0
                ? 'অ্যাটেম্পট সফলভাবে ০ করা হয়েছে এবং ইউজারের সাবমিট করা উত্তর মুছে ফেলা হয়েছে।'
                : 'অ্যাটেম্পট সফলভাবে আপডেট করা হয়েছে।',
            user: {
                ...updateRes.rows[0],
                is_submitted
            },
            answerDeleted
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating user attempt:', err);
        res.status(500).json({ success: false, error: 'Server Error - update user attempt' });
    } finally {
        client.release();
    }
});

admin_route.get('/user-answers', async (req, res) => {
    try {
        const userData = await pool.query('SELECT * FROM user_answers ORDER BY id DESC');
        res.json({ message: "Success", users: userData.rows });
    } catch (err) {
        console.log(err.message);
        // Fallback or handle missing table if user_answers doesn't exist yet
        res.status(500).json({ error: "Server Error - admin user-answers" });
    }
});

admin_route.delete('/user-answers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM user_answers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'উত্তর খুঁজে পাওয়া যায়নি' });
        }
        res.json({ success: true, message: 'উত্তর সফলভাবে মুছে ফেলা হয়েছে', deletedUser: result.rows[0] });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error - delete user answer");
    }
});

admin_route.get('/marksheet', async (req, res) => {
    try {
        const answersRes = await pool.query('SELECT * FROM user_answers ORDER BY id DESC');
        const questionsRes = await pool.query('SELECT id, correct_answer FROM questions');
        
        const questionsMap = new Map();
        questionsRes.rows.forEach(q => {
            questionsMap.set(String(q.id), q.correct_answer);
        });

        const normalizeOption = (val) => {
            if (!val) return '';
            const str = String(val).trim().toLowerCase();
            if (str === 'a' || str === 'option_a') return 'option_a';
            if (str === 'b' || str === 'option_b') return 'option_b';
            if (str === 'c' || str === 'option_c') return 'option_c';
            if (str === 'd' || str === 'option_d') return 'option_d';
            return str;
        };

        const marksheet = answersRes.rows.map(user => {
            const userAnsObj = typeof user.answers === 'string' 
                ? JSON.parse(user.answers || '{}') 
                : (user.answers || {});

            let all_answer = 0;
            let correct_answer = 0;
            let wrong_answer = 0;

            Object.entries(userAnsObj).forEach(([qId, uAns]) => {
                if (uAns) {
                    all_answer++;
                    const correctAns = questionsMap.get(String(qId));
                    if (correctAns && normalizeOption(uAns) === normalizeOption(correctAns)) {
                        correct_answer++;
                    } else {
                        wrong_answer++;
                    }
                }
            });

            const negative_mark = parseFloat((wrong_answer * 0.25).toFixed(2));
            const total_mark = parseFloat((correct_answer - negative_mark).toFixed(2));

            return {
                id: user.id,
                name: user.name || user.username || 'N/A',
                phone: user.phone || user.mobile || user.email || 'N/A',
                division: user.division || '',
                district: user.district || '',
                upazila: user.upazila || '',
                institute: user.institute || '',
                submitted_at: user.submitted_at || user.created_at || null,
                all_answer,
                correct_answer,
                wrong_answer,
                negative_mark,
                total_mark,
                raw_answers: userAnsObj
            };
        });

        res.json({ success: true, marksheet });
    } catch (err) {
        console.error('Marksheet fetch error:', err.message);
        res.status(500).json({ success: false, error: 'Server Error - marksheet' });
    }
});

export default admin_route;



