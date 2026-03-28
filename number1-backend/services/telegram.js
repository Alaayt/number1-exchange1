// ============================================
// services/telegram.js — إشعارات التليغرام
// ============================================

const axios = require('axios');

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ─── إرسال رسالة نصية ────────────────────────
exports.sendMessage = async (text, options = {}) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      ...options
    });
    return { success: true, messageId: response.data.result.message_id };
  } catch (error) {
    console.error('Telegram sendMessage error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// ─── إرسال إشعار طلب جديد (مع أزرار) ────────
exports.notifyNewOrder = async (order) => {
  const methodEmojis = {
    USDT_TRC20: '💰',
    VODAFONE_CASH: '📱',
    ORANGE_CASH: '🟠',
    FAWRY: '🏪',
    WE_PAY: '💳',
    MEEZA: '🏦',
    INSTAPAY: '⚡'
  };

  const emoji = methodEmojis[order.payment.method] || '💸';
  const isUSDT = order.payment.method === 'USDT_TRC20';

  const text = `
🆕 <b>طلب جديد — Number1</b>
━━━━━━━━━━━━━━━━━━━
📋 <b>رقم الطلب:</b> <code>${order.orderNumber}</code>
👤 <b>العميل:</b> ${order.customerName}
📧 <b>الإيميل:</b> ${order.customerEmail}
${order.customerPhone ? `📞 <b>الهاتف:</b> ${order.customerPhone}` : ''}

${emoji} <b>طريقة الدفع:</b> ${order.payment.method.replace(/_/g, ' ')}
💵 <b>المبلغ المُرسل:</b> ${order.payment.amountSent} ${order.payment.currencySent}
${isUSDT && order.payment.txHash ? `🔗 <b>TX Hash:</b> <code>${order.payment.txHash}</code>` : ''}
${!isUSDT && order.payment.senderPhoneNumber ? `📱 <b>رقم المُرسِل:</b> ${order.payment.senderPhoneNumber}` : ''}

💱 <b>السعر المُطبَّق:</b> ${order.exchangeRate.appliedRate}
💚 <b>المبلغ النهائي:</b> $${order.exchangeRate.finalAmountUSD} USD

👤 <b>المستقبل:</b> ${order.moneygo.recipientName}
📞 <b>هاتف المستقبل:</b> ${order.moneygo.recipientPhone}
━━━━━━━━━━━━━━━━━━━
⏰ ${new Date(order.createdAt).toLocaleString('ar-EG')}
  `.trim();

  // أزرار inline للأدمن
  const inline_keyboard = [
    [
      { text: '✅ موافقة', callback_data: `approve_${order._id}` },
      { text: '❌ رفض', callback_data: `reject_${order._id}` }
    ],
    [
      { text: '✔️ اكتمل', callback_data: `complete_${order._id}` }
    ]
  ];

  return await exports.sendMessage(text, {
    reply_markup: { inline_keyboard }
  });
};

// ─── إشعار تحديث حالة الطلب ──────────────────
exports.notifyOrderUpdate = async (order, newStatus, note = '') => {
  const statusText = {
    verified: '✅ تم التحقق من الدفع',
    processing: '⚙️ جاري المعالجة',
    completed: '🎉 مكتمل — تم التحويل',
    rejected: '❌ مرفوض',
    cancelled: '🚫 ملغي'
  };

  const text = `
📊 <b>تحديث طلب — Number1</b>
━━━━━━━━━━━━
📋 <b>الطلب:</b> <code>${order.orderNumber}</code>
👤 <b>العميل:</b> ${order.customerName}
🔄 <b>الحالة:</b> ${statusText[newStatus] || newStatus}
${note ? `📝 <b>ملاحظة:</b> ${note}` : ''}
━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('ar-EG')}
  `.trim();

  return await exports.sendMessage(text);
};

// ─── إرسال صورة إيصال ────────────────────────
exports.sendReceiptPhoto = async (photoUrl, caption = '') => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/sendPhoto`, {
      chat_id: CHAT_ID,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML'
    });
    return { success: true, messageId: response.data.result.message_id };
  } catch (error) {
    console.error('Telegram sendPhoto error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// ─── الرد على callback_query (أزرار الأدمن) ──
exports.answerCallbackQuery = async (callbackQueryId, text) => {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
      show_alert: false
    });
  } catch (error) {
    console.error('answerCallbackQuery error:', error.message);
  }
};

// ─── تعديل رسالة موجودة ──────────────────────
exports.editMessage = async (messageId, newText) => {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageText`, {
      chat_id: CHAT_ID,
      message_id: messageId,
      text: newText,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('editMessage error:', error.message);
  }
};
