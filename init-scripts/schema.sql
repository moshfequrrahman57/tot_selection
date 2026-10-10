CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- 🟢 Added securely here
    division VARCHAR(50),
    district VARCHAR(50),
    upazila VARCHAR(50),
    institute VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	no_of_attempt INT
);

CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    division VARCHAR(50),
    district VARCHAR(50),
    upazila VARCHAR(50),
    institute VARCHAR(150),
    answers JSONB, -- This holds your React state directly!
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
	correct_answer VARCHAR(255) NOT NULL
);

INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES
('ইন্দোনেশিয়ার  রাজধানীর নাম কি?', 'কাঠমন্ডু', 'দিল্লি', 'ঢাকা', 'জাকার্তা' , 'option_d'),
('আমাদের জাতীয় ফুলের নাম কি?', 'গোলাপ', 'জবা', 'শাপলা', 'সূর্যমুখী', 'option_c'),
('কোনটি বাংলাদেশের জাতীয় পশু?', 'সিংহ', 'রয়্যাল বেঙ্গল টাইগার', 'হরিণ', 'হাতি', 'option_b'),
('আমাদের জাতীয় কবির নাম কি?', 'রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জসীমউদ্দীন', 'জীবনানন্দ দাশ', 'option_b'),
('বছরে কতটি মাস থাকে?', '১০টি', '১১টি', '১২টি', '১৩টি', 'option_c'),
('সপ্তাহে কত দিন হয়?', '৫ দিন', '৬ দিন', '৭ দিন', '৮ দিন', 'option_c'),
('আমাদের জাতীয় ফলের নাম কি?', 'আম', 'কাঁঠাল', 'কলা', 'লিচু', 'option_b'),
('কোনটি একটি তরল পদার্থ?', 'পাথর', 'কাঠ', 'পানি', 'লোহা', 'option_c'),
('সূর্য কোন দিকে ওঠে?', 'পূর্ব', 'পশ্চিম', 'উত্তর', 'দক্ষিণ', 'option_a'),
('ইংরেজিতে কতটি Alphabet বা বর্ণ আছে?', '২১টি', '২৬টি', '৫টি', '৩০টি', 'option_b'),
('মানবদেহে কতটি চোখ থাকে?', '২টি', '৩টি', '৪টি', '৫টি', 'option_a'),
('কোন রঙের কারণে গাছের পাতা সবুজ দেখায়?', 'ক্যারোটিন', 'ক্লোরোফিল', 'ভিটামিন', 'পানি', 'option_b'),
('নিচের কোনটি একটি গৃহপালিত পশু?', 'বাঘ', 'গরু', 'হরিণ', 'ভাল্লুক', 'option_b'),
('রংধনুতে কয়টি রং থাকে?', '৫টি', '৬টি', '৭টি', '৮টি', 'option_c'),
('কাগজ তৈরি হয় কি থেকে?', 'পাথর', 'লোহা', 'বাঁশ বা কাঠ', 'মাটি', 'option_c'),
('বাংলাদেশের মুদ্রার (টাকার) নাম কি?', 'রুপি', 'ডলার', 'টাকা', 'ইউরো', 'option_c'),
('বাংলাদেশের সবচেয়ে উত্তরের জেলা কোনটি ?','পঞ্চগড় ', 'ঠাকুরগাঁও ', 'দিনাজপুর ', 'নীলফামারি ', 'option_a' );