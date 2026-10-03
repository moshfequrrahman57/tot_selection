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

dotenv.config();
 
const PORT = process.env.PORT || 6001;

// মিডেলওয়্যার (JSON ডেটা রিড করার জন্য)
app.use(express.json());

// CORS Configuration

// 🟢 DYNAMIC PRODUCTION CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:5173', // Your local Vite React port
  'http://localhost:3000', // Alternative local port if used
  'http://localhost:4173',
  process.env.FRONTEND_URL // 🌟 Your live React application URL from Render environment variables
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Thunder Client, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by security rules: CORS Policy Violation.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Set to true if you plan to use HTTP-only cookies or sessions later
}));


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
