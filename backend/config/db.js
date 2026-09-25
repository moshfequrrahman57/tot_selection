
import pkg from 'pg'; 
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

// ডেটাবেজ কনফিগারেশন
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// কানেকশন চেক করার জন্য একটি টেস্ট
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Success with PostgreSQL Connection 🎉');
  release();
});

export default pool;
