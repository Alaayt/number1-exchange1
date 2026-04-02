// ============================================
// models/Wallet.js — محفظة المستخدم (رصيد واحد USDT)
// ============================================
const mongoose = require('mongoose')

// ─── توليد رقم محفظة مميز N1-XXXXX ──────────
function generateWalletId() {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `N1-${num}`
}

const walletSchema = new mongoose.Schema({

  // ─── المستخدم ─────────────────────────────
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // ─── رقم المحفظة المميز ───────────────────
  walletId: {
    type: String,
    unique: true,
    default: generateWalletId
  },

  // ─── رصيد USDT (الأدمن يتحكم فيه يدوياً) ──
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },

  currency: {
    type: String,
    default: 'USDT'
  },

  // ─── الإجماليات ───────────────────────────
  totalDeposited: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },

  // ─── الحالة ───────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },

  // ─── ملاحظة الأدمن ────────────────────────
  adminNote: {
    type: String,
    default: null
  }

}, { timestamps: true })

module.exports = mongoose.model('Wallet', walletSchema)