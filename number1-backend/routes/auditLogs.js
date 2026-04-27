// routes/auditLogs.js — API السجل الدائم

const express = require('express');
const router  = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, adminOnly } = require('../middleware/auth');

// ─── GET /api/audit-logs ──────────────────────────────────────
// كل السجلات (للأدمن فقط) مع فلاتر متعددة
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      status, action, userId, userName,
      page = 1, limit = 20,
      startDate, endDate,
      search,
    } = req.query;

    const filter = {};
    if (status)    filter.status = status;
    if (action)    filter.action = action;
    if (userId)    filter.userId = userId;
    if (userName)  filter.userName = { $regex: userName, $options: 'i' };
    if (search) {
      filter.$or = [
        { userName:  { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { 'requestDetails.orderNumber': { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate)   filter.timestamp.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit)),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        page:  parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/audit-logs/user/:userId ─────────────────────────
// سجلات مستخدم معين — المستخدم يرى سجله فقط، الأدمن يرى الكل
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'غير مصرح.' });
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find({ userId }).sort({ timestamp: -1 }).skip(skip).limit(parseInt(limit)),
      AuditLog.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        page:  parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/audit-logs/:id ───────────────────────────────────
// تفاصيل سجل واحد (للأدمن فقط)
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: 'السجل غير موجود.' });
    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── لا DELETE ولا PUT ولا PATCH هنا أبداً ──

module.exports = router;
