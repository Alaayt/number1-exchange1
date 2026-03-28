// ============================================
// middleware/auth.js — حماية الـ Routes
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── حماية عامة (يجب تسجيل الدخول) ──────────
exports.protect = async (req, res, next) => {
  try {
    let token;

    // استخراج التوكن من الـ Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // جلب المستخدم
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    res.status(500).json({ success: false, message: 'Server error in auth middleware.' });
  }
};

// ─── حماية للأدمن فقط ─────────────────────
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.'
  });
};
