const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secretkey = process.env.WHATISNAME; // 🔑 make sure same as used in login

const verifytoken = async (req, res, next) => {
  try {
    const token = req.headers.token; // 👈 frontend sends { headers: { token: loginToken } }

    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, secretkey);

    const user = await User.findById(decoded.userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userid = user._id;
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = verifytoken;
