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

export default admin_route;



