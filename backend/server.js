import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/test_db.js';
import auth_router from './routes/auth.js';

const app = express();
app.use(cors());
dotenv.config();
 
const PORT = process.env.PORT || 5000;

// মিডেলওয়্যার (JSON ডেটা রিড করার জন্য)
app.use(express.json());

// ১. টেস্ট রুট: ডেটাবেজের বর্তমান সময় চেক করা
app.get('/', (req, res) => {
    res.send('Welcome to the TOT Selection Project Backend! ');
});
app.use("/api", router);
app.use("/auth", auth_router);

// সার্ভার চালু করা
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
