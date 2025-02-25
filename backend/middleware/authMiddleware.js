import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Adjust the path based on your structure

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  console.log("🔍 Received Authorization Header:", token); // ✅ Debugging log

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];

      console.log("✅ Extracted Token:", token); // ✅ Debugging log

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded); // ✅ Debugging log

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error("❌ User not found in database!");
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ Authenticated User:", req.user); // ✅ Debugging log
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error("❌ No token provided!");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 🔹 Middleware to check user roles (Admin, Employer, etc.)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export { protect, authorizeRoles };

