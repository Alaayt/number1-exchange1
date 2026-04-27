// services/auditService.js — helper لتسجيل أحداث الطلبات في AuditLog

const AuditLog = require('../models/AuditLog');

const STATUS_TO_ACTION = {
  pending:    'CREATED',
  verifying:  'IN_PROGRESS',
  verified:   'VERIFIED',
  processing: 'PROCESSING',
  completed:  'COMPLETED',
  rejected:   'FAILED',
  cancelled:  'CANCELLED',
  expired:    'EXPIRED',
};

/**
 * سجّل حدث طلب في AuditLog.
 * لا يرمي exception — فشل التسجيل لا يوقف العملية الأصلية.
 */
async function logOrderEvent(order, performedBy = 'system', note = null, overrideAction = null) {
  try {
    const action = overrideAction || STATUS_TO_ACTION[order.status] || 'IN_PROGRESS';

    await AuditLog.create({
      originalRequestId: order._id || null,
      userId:    order.user || null,
      userName:  order.customerName  || null,
      userEmail: order.customerEmail || null,
      action,
      status: order.status,
      requestDetails: {
        orderNumber: order.orderNumber,
        orderType:   order.orderType,
        payment: {
          method:       order.payment?.method,
          amountSent:   order.payment?.amountSent,
          currencySent: order.payment?.currencySent,
          txHash:       order.payment?.txHash || null,
        },
        moneygo: {
          recipientName: order.moneygo?.recipientName,
          recipientPhone: order.moneygo?.recipientPhone,
          amountUSD:     order.moneygo?.amountUSD,
          transferId:    order.moneygo?.transferId || null,
          transferStatus: order.moneygo?.transferStatus,
        },
        exchangeRate: {
          appliedRate:    order.exchangeRate?.appliedRate,
          finalAmountUSD: order.exchangeRate?.finalAmountUSD,
        },
        timeline: order.timeline || [],
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      performedBy,
      note,
    });
  } catch (err) {
    console.error('[AuditLog] فشل تسجيل الحدث:', err.message);
  }
}

module.exports = { logOrderEvent };
