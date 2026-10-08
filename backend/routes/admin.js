import express from 'express';
import pool from '../config/db.js';


const admin_route=express.Router();



admin_route.get('/user', async (req, res)=>{
    try{

        const result = await pool.query('select now()');
        const userData= await pool.query('select * from users');
        res.json({ message: "Success", time: result.rows[0], users: userData.rows})

    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error -admin");
    }
});

admin_route.post('/secret', async (req, res)=>{
    const { access_code } =req.body;
    try{
        const ADMIN_SECRET_CODE="1111";

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

export default admin_route;



