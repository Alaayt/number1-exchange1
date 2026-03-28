// ============================================
// models/User.js — نموذج المستخدم
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  // ─── معلومات أساسية ───────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },

  phone: {
    type: String,
    trim: true,
    default: null
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // لا يُرجع في الـ queries تلقائياً
  },

  // ─── الصلاحيات ────────────────────────────
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // ─── التحقق من الإيميل ────────────────────
  emailVerificationToken: {
    type: String,
    default: null,
    select: false
  },

  emailVerificationExpires: {
    type: Date,
    default: null,
    select: false
  },

  // ─── إعادة تعيين كلمة المرور ──────────────
  resetPasswordToken: {
    type: String,
    default: null,
    select: false
  },

  resetPasswordExpires: {
    type: Date,
    default: null,
    select: false
  },

  // ─── إحصائيات ────────────────────────────
  totalOrders: {
    type: Number,
    default: 0
  },

  totalVolume: {
    type: Number,
    default: 0
  },

  lastLogin: {
    type: Date,
    default: null
  }

}, {
  timestamps: true // createdAt, updatedAt تلقائياً
});

// ─── Hash Password قبل الحفظ ─────────────────
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method: مقارنة كلمة المرور ──────────────
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Method: بيانات آمنة للـ response ────────
userSchema.methods.toSafeObject = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    isVerified: this.isVerified,
    totalOrders: this.totalOrders,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
