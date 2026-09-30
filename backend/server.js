import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import testdb_route from './routes/test_db.js';
import auth_router from './routes/auth.js';
import profileinfo_route from './routes/profileInfo.js';
import question_route from './routes/questions.js';
import answer_route from './routes/answers.js';
import quiz_code_route from './routes/quiz-code.js';

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
app.use("/api", testdb_route);
app.use("/auth", auth_router);
app.use("/login", profileinfo_route);
app.use("/api/questions",question_route);
app.use("/api/answers", answer_route);
app.use("/verify-code",quiz_code_route);


// সার্ভার চালু করা
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
