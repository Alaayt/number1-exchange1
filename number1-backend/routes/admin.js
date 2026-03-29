// ============================================
// routes/admin.js — لوحة الأدمن + Telegram Webhook
// ============================================
const Setting = require('../models/Setting');
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const telegramService = require('../services/telegram');
const Rate = require('../models/Rate');
const mongoose = require('mongoose')

// ─── Middleware: حماية كل routes الأدمن ───────
router.use(protect, adminOnly);

// ─── GET /api/admin/orders ────────────────────
// جلب كل الطلبات مع فلترة
router.get('/orders', async (req, res) => {
  try {
    const {
      status,
      orderType,
      page = 1,
      limit = 20,
      search
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/orders/:id ────────────────
// تفاصيل طلب واحد
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PUT /api/admin/orders/:id/status ─────────
// تحديث حالة الطلب
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, note, transferId } = req.body;

    const validStatuses = ['verifying', 'verified', 'processing', 'completed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // تحديث الحالة
    order.status = status;
    if (note) order.adminNote = note;
    if (transferId) order.moneygo.transferId = transferId;

    // تحديث حالة MoneyGo إذا اكتمل
    if (status === 'completed') {
      order.moneygo.transferStatus = 'sent';
    } else if (status === 'rejected') {
      order.moneygo.transferStatus = 'failed';
    }

    // إضافة للـ Timeline
    order.addTimeline(status, note || `Status updated to ${status}`, `admin:${req.user.email}`);

    await order.save();

    // إشعار التليغرام
    await telegramService.notifyOrderUpdate(order, status, note);

    res.json({
      success: true,
      message: 'Order status updated.',
      order: { orderNumber: order.orderNumber, status: order.status }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/stats ─────────────────────
// إحصائيات لوحة التحكم
router.get('/stats', async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      rejectedOrders,
      totalUsers,
      todayOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending', 'verifying', 'verified', 'processing'] } }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    // إجمالي الحجم
    const volumeResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalUSD: { $sum: '$exchangeRate.finalAmountUSD' } } }
    ]);

    const totalVolumeUSD = volumeResult[0]?.totalUSD || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        rejectedOrders,
        totalUsers,
        todayOrders,
        totalVolumeUSD: totalVolumeUSD.toFixed(2)
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/users ─────────────────────
// قائمة المستخدمين
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, users: users.map(u => u.toSafeObject()) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/admin/telegram-webhook ─────────
// استقبال callbacks من التليغرام (أزرار الأدمن)
// ملاحظة: هذا الـ route يحتاج إزالة protect للتليغرام
router.post('/telegram-webhook-internal', async (req, res) => {
  try {
    const { callback_query } = req.body;

    if (!callback_query) {
      return res.json({ success: true });
    }

    const { data, id: callbackQueryId } = callback_query;

    // data format: "approve_ORDERID" | "reject_ORDERID" | "complete_ORDERID"
    const [action, orderId] = data.split('_');

    const order = await Order.findById(orderId);
    if (!order) {
      await telegramService.answerCallbackQuery(callbackQueryId, '❌ الطلب غير موجود');
      return res.json({ success: true });
    }

    let newStatus, message;

    switch (action) {
      case 'approve':
        newStatus = 'verified';
        message = '✅ تم الموافقة على الطلب';
        break;
      case 'reject':
        newStatus = 'rejected';
        message = '❌ تم رفض الطلب';
        break;
      case 'complete':
        newStatus = 'completed';
        message = '🎉 تم إكمال الطلب';
        break;
      default:
        return res.json({ success: true });
    }

    order.status = newStatus;
    order.addTimeline(newStatus, `${message} via Telegram`, 'admin:telegram');
    await order.save();

    await telegramService.answerCallbackQuery(callbackQueryId, message);
    await telegramService.notifyOrderUpdate(order, newStatus);

    res.json({ success: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.json({ success: true }); // دائماً نرجع 200 للتليغرام
  }
});
// ─── GET /api/admin/rates ─────────────────────
// جلب الأسعار الحالية
router.get('/rates', async (req, res) => {
  try {
    const rates = await Rate.getSingleton();
    res.json({ success: true, ...rates.toObject() });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PUT /api/admin/rates ─────────────────────
// تحديث الأسعار
router.put('/rates', async (req, res) => {
  try {
    const allowed = [
      'usdtBuyRate', 'usdtSellRate', 'moneygoRate',
      'vodafoneBuyRate', 'instaPayRate', 'fawryRate', 'orangeRate',
      'minOrderUsdt', 'maxOrderUsdt',
    ];

    // فلترة الحقول المسموحة فقط
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined && req.body[key] !== '') {
        updates[key] = parseFloat(req.body[key]);
      }
    });

    updates.updatedBy = req.user.email;

    const rates = await Rate.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Rates updated.', ...rates.toObject() });
  } catch (error) {
    console.error('Update rates error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/admin/settings ──────────────────
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.getSingleton()
    // نخفي كلمات السر من الـ response
    const safe = settings.toObject()
    if (safe.smtpPassword)    safe.smtpPassword    = safe.smtpPassword    ? '••••••••' : ''
    if (safe.telegramBotToken) safe.telegramBotToken = safe.telegramBotToken ? '••••••••' : ''
    res.json({ success: true, ...safe })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── PUT /api/admin/settings ──────────────────
router.put('/settings', async (req, res) => {
  try {
    const allowed = [
      'platformName', 'platformActive', 'maintenanceMode',
      'telegramNotifications', 'emailNotifications',
      'telegramBotToken', 'telegramChatId',
      'smtpHost', 'smtpPort', 'smtpEmail', 'smtpPassword',
      'minOrderUsdt', 'maxOrderUsdt', 'orderExpiryMins',
      'moneygoApiKey', 'moneygoApiUrl', 'cryptoApiKey',
    ]

    const updates = {}
    allowed.forEach(key => {
      if (req.body[key] !== undefined) {
        // لا تحدث كلمة السر إذا كانت النقاط
        if (req.body[key] === '••••••••') return
        updates[key] = req.body[key]
      }
    })

    const settings = await Setting.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true }
    )

    res.json({ success: true, message: 'Settings saved.', ...settings.toObject() })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ── نموذج مؤقت لحفظ وسائل الدفع في DB ────────
const paymentMethodSchema = new mongoose.Schema({
  cryptos: { type: Array, default: [] },
  wallets: { type: Array, default: [] },
}, { timestamps: true })

const PaymentMethod = mongoose.models.PaymentMethod || 
  mongoose.model('PaymentMethod', paymentMethodSchema)

// ─── GET /api/admin/payment-methods ───────────
router.get('/payment-methods', async (req, res) => {
  try {
    let doc = await PaymentMethod.findOne()
    if (!doc) doc = await PaymentMethod.create({ cryptos: [], wallets: [] })
    res.json({ success: true, cryptos: doc.cryptos, wallets: doc.wallets })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── PUT /api/admin/payment-methods ───────────
router.put('/payment-methods', async (req, res) => {
  try {
    const { cryptos, wallets } = req.body
    const doc = await PaymentMethod.findOneAndUpdate(
      {},
      { $set: { cryptos: cryptos || [], wallets: wallets || [] } },
      { new: true, upsert: true }
    )
    res.json({ success: true, message: 'Saved.', cryptos: doc.cryptos, wallets: doc.wallets })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ─── GET /api/payment-methods (public) ────────
// للمستخدمين — يجلب الوسائل المفعّلة فقط

module.exports = router;
