import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  try {
    let token;

    // ১. চেক করা হেডার-এ Bearer Token আছে কি না
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN_HERE' থেকে শুধু টোকেন নেওয়া
    }

    // ২. টোকেন না থাকলে এরর দেওয়া
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token provided!" });
    }

    // ৩. টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // ৪. ইউজারের ইনফো রিকোয়েস্ট অবজেক্টে সেভ করা (যাতে পরের রুট এটি ব্যবহার করতে পারে)
    req.user = decoded; 

    // ৫. সবকিছু ঠিক থাকলে পরবর্তী রুটে যাওয়ার অনুমতি দেওয়া
    next(); 
    
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed!" });
  }
};

export default protect;
