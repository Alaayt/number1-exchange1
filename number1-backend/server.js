// ============================================
// server.js
// ============================================

const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();

// ─── App ──────────────────────────────────────
const app = express();  // ✅ لازم يكون أول شيء

app.set('trust proxy', 1);

// ─── Middleware ───────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ─── Database ─────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected — Number1DB'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/public', require('./routes/public'));
app.use('/api/wallet', require('./routes/wallet'));  // ✅ هنا المكان الصحيح

// ─── Telegram Webhook ─────────────────────────
app.post('/api/telegram/webhook', async (req, res) => {
  try {
    const { callback_query } = req.body;
    if (!callback_query) return res.json({ ok: true });

    const { data, id: callbackQueryId } = callback_query;

    const underscoreIndex = data.indexOf('_');
    const action  = data.substring(0, underscoreIndex);
    const orderId = data.substring(underscoreIndex + 1);

    const telegramService = require('./services/telegram');

    // ─── معالجة طلبات إيداع المحفظة ──────────
    if (action === 'dep-approve' || action === 'dep-reject') {
      const Deposit     = require('./models/Deposit')
      const Wallet      = require('./models/Wallet')
      const Transaction = require('./models/Transaction')

      const deposit = await Deposit.findById(orderId)
      if (!deposit) {
        await telegramService.answerCallbackQuery(callbackQueryId, '❌ الطلب غير موجود')
        return res.json({ ok: true })
      }
      if (deposit.status !== 'pending') {
        await telegramService.answerCallbackQuery(callbackQueryId, '⚠️ تم معالجة هذا الطلب مسبقاً')
        return res.json({ ok: true })
      }

      if (action === 'dep-approve') {
        deposit.status      = 'approved'
        deposit.processedAt = new Date()
        await deposit.save()

        let wallet = await Wallet.findOne({ user: deposit.user })
        if (!wallet) wallet = await Wallet.create({ user: deposit.user })

        const balanceBefore   = wallet.balance
        wallet.balance        += deposit.amount
        wallet.totalDeposited += deposit.amount
        await wallet.save()

        await Transaction.create({
          user:          deposit.user,
          wallet:        wallet._id,
          type:          'deposit',
          amount:        deposit.amount,
          balanceBefore,
          balanceAfter:  wallet.balance,
          status:        'completed',
          performedBy:   'admin:telegram',
          note:          `TXID: ${deposit.txid}`
        })

        await telegramService.answerCallbackQuery(
          callbackQueryId,
          `✅ تمت الموافقة — رصيد المحفظة: ${wallet.balance} USDT`
        )
      } else {
        deposit.status      = 'rejected'
        deposit.processedAt = new Date()
        await deposit.save()
        await telegramService.answerCallbackQuery(callbackQueryId, '❌ تم رفض طلب الإيداع')
      }

      return res.json({ ok: true })
    }

    const Order = require('./models/Order');

    const order = await Order.findById(orderId);
    if (!order) {
      await telegramService.answerCallbackQuery(callbackQueryId, '❌ الطلب غير موجود');
      return res.json({ ok: true });
    }

    // ✅ منع تغيير الطلبات المكتملة أو المرفوضة
    const finalStatuses = ['completed', 'rejected', 'cancelled'];
    if (finalStatuses.includes(order.status)) {
      await telegramService.answerCallbackQuery(
        callbackQueryId,
        `⚠️ الطلب ${order.status === 'completed' ? 'مكتمل' : 'مرفوض'} مسبقاً`
      );
      return res.json({ ok: true });
    }

    const statusMap = {
      approve:  { status: 'verified',  msg: '✅ تمت الموافقة' },
      reject:   { status: 'rejected',  msg: '❌ تم الرفض'     },
      complete: { status: 'completed', msg: '🎉 تم الإكمال'   },
    };

    const action_data = statusMap[action];
    if (!action_data) return res.json({ ok: true });

    order.status = action_data.status;
    order.addTimeline(action_data.status, `${action_data.msg} via Telegram`, 'admin:telegram');

    if (action_data.status === 'completed') order.moneygo.transferStatus = 'sent';
    if (action_data.status === 'rejected')  order.moneygo.transferStatus = 'failed';

    await order.save();

    await telegramService.answerCallbackQuery(callbackQueryId, action_data.msg);
    await telegramService.notifyOrderUpdate(order, action_data.status);

    res.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.json({ ok: true });
  }
});

// ─── Admin Routes ─────────────────────────────
app.use('/api/admin', require('./routes/admin'))

;

// ─── Health Check ─────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success:   true,
    message:   'Number1 Backend is running 🚀',
    version:   '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 ──────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Number1 Server running on port ${PORT}`);

  // ── تسجيل Telegram Webhook تلقائياً عند البدء ──
  if (process.env.BACKEND_URL) {
    try {
      const telegramService = require('./services/telegram')
      const Setting = require('./models/Setting')
      const s = await Setting.getSingleton()
      const token = s.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN

      if (token) {
        const webhookUrl = `${process.env.BACKEND_URL}/api/telegram/webhook`
        const axios = require('axios')
        const res = await axios.post(
          `https://api.telegram.org/bot${token}/setWebhook`,
          { url: webhookUrl, drop_pending_updates: false }
        )
        if (res.data.ok) {
          console.log(`✅ Telegram Webhook registered: ${webhookUrl}`)
        } else {
          console.warn('⚠️ Telegram Webhook registration failed:', res.data.description)
        }
      }
    } catch (e) {
      console.warn('⚠️ Telegram Webhook auto-setup error:', e.message)
    }
  } else {
    console.warn('⚠️ BACKEND_URL not set — Telegram Webhook not auto-registered. Set BACKEND_URL in .env')
  }
});