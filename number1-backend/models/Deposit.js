// ============================================
// models/Deposit.js — طلبات إيداع USDT
// ============================================
const mongoose = require('mongoose')

const depositSchema = new mongoose.Schema(
  {
    // ─── المستخدم ───────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── نوع الإيداع (USDT فقط) ──────────────
    // تم حذف bank_transfer نهائياً
    type: {
      type: String,
      enum: ['usdt'],
      default: 'usdt',
      required: true,
    },

    // ─── المبلغ المطلوب ──────────────────────
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ─── USDT — رقم المعاملة (TXID) ──────────
    txid: {
      type: String,
      required: true, // TXID إلزامي الحين لأنه الدليل الوحيد
    },

    // ─── الحالة ──────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // ─── سبب الرفض ───────────────────────────
    rejectionReason: {
      type: String,
      default: null,
    },

    // ─── الأدمن اللي عالج الطلب ──────────────
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Deposit', depositSchema)