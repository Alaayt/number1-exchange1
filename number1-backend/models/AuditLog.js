// models/AuditLog.js — سجل دائم غير قابل للحذف أو التعديل

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    originalRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    userName:  { type: String, default: null },
    userEmail: { type: String, default: null },

    action: {
      type: String,
      enum: [
        'CREATED',
        'IN_PROGRESS',
        'VERIFIED',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
        'EXPIRED',
      ],
      required: true,
    },

    status: { type: String, required: true },

    requestDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    performedBy: { type: String, default: 'system' },
    note:        { type: String, default: null },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: false }
);

// ── منع الحذف نهائياً ────────────────────────────────────────
auditLogSchema.pre('deleteOne', function () {
  throw new Error('AuditLog: حذف السجلات ممنوع نهائياً.');
});
auditLogSchema.pre('deleteMany', function () {
  throw new Error('AuditLog: حذف السجلات ممنوع نهائياً.');
});
auditLogSchema.pre('findOneAndDelete', function () {
  throw new Error('AuditLog: حذف السجلات ممنوع نهائياً.');
});

// ── لا TTL index هنا أبداً ───────────────────────────────────

module.exports = mongoose.model('AuditLog', auditLogSchema);
