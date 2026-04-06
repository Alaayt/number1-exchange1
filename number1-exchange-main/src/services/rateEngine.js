// src/services/rateEngine.js
// ═══════════════════════════════════════════════════════════════
// محرك الأسعار — المصدر الوحيد لكل منطق الحساب
//
// الأسعار في DB:
//   usdtBuyRate     — كم جنيه يدفع المستخدم ليحصل على 1 USDT
//   usdtSellRate    — كم جنيه يحصل المستخدم مقابل 1 USDT
//   moneygoRate     — كم USDT يساوي 1 MoneyGo
//   vodafoneBuyRate — كم جنيه فودافون = 1 USDT
//   instaPayRate    — كم جنيه إنستا = 1 USDT
//   fawryRate       — كم جنيه فاوري = 1 USDT
//   orangeRate      — كم جنيه أورنج = 1 USDT
// ═══════════════════════════════════════════════════════════════

const RATE_MAP = {

  // ── Vodafone Cash (EGP) → ────────────────────────────────
  // العميل يدفع جنيه فودافون ÷ السعر = USDT أو MoneyGo
  'vodafone': {
    'mgo-recv':  (r) => ({ rate: r.vodafoneBuyRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.vodafoneBuyRate, divide: true }),
  },

  // ── InstaPay (EGP) → ─────────────────────────────────────
  'instapay': {
    'mgo-recv':  (r) => ({ rate: r.instaPayRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.instaPayRate, divide: true }),
  },

  // ── Fawry (EGP) → ────────────────────────────────────────
  'fawry': {
    'mgo-recv':  (r) => ({ rate: r.fawryRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.fawryRate, divide: true }),
  },

  // ── Orange Cash (EGP) → ──────────────────────────────────
  'orange': {
    'mgo-recv':  (r) => ({ rate: r.orangeRate, divide: true }),
    'usdt-recv': (r) => ({ rate: r.orangeRate, divide: true }),
  },

  // ── USDT TRC20 → ─────────────────────────────────────────
  'usdt-trc': {
    // USDT → MoneyGo: العميل يرسل USDT × moneygoRate = MoneyGo
    // مثال: 10 USDT × 1.004 = 10.04 MoneyGo
    'mgo-recv':    (r) => ({ rate: r.moneygoRate,  divide: false }), // ✅ مصحح

    // USDT → محفظة داخلية: 1:1
    'wallet-recv': ()  => ({ rate: 1,              divide: false }),
  },

  // ── MoneyGo USD → ────────────────────────────────────────
  'mgo-send': {
    // MoneyGo → USDT: العميل يرسل MoneyGo × moneygoRate = USDT
    // مثال: 10 MoneyGo × 1.004 = 10.04 USDT
    'usdt-recv': (r) => ({ rate: r.moneygoRate, divide: false }),
  },

  // ── محفظة داخلية → ───────────────────────────────────────
  'wallet-usdt': {
    // محفظة → USDT TRC20: 1:1
    'usdt-recv': () => ({ rate: 1, divide: false }),
    // محفظة → MoneyGo: × moneygoRate
    'mgo-recv':  (r) => ({ rate: r.moneygoRate, divide: false }),
  },
}

// ════════════════════════════════════════════════════════════
// getRate — الدالة الوحيدة المسموح استخدامها في كل المشروع
// ════════════════════════════════════════════════════════════
export function getRate(fromId, toId, rates) {
  const DEFAULT_RATE = { rate: 1, divide: false }

  if (!fromId || !toId || !rates) return DEFAULT_RATE

  const fromMap = RATE_MAP[fromId]
  if (!fromMap) {
    console.warn(`[rateEngine] Unknown fromId: "${fromId}"`)
    return DEFAULT_RATE
  }

  const rateFunc = fromMap[toId]
  if (!rateFunc) {
    console.warn(`[rateEngine] No rate defined for: "${fromId}" → "${toId}"`)
    return DEFAULT_RATE
  }

  const result = rateFunc(rates)

  if (!result.rate || result.rate <= 0) {
    console.warn(`[rateEngine] Invalid rate for "${fromId}" → "${toId}":`, result.rate)
    return DEFAULT_RATE
  }

  return result
}

// ════════════════════════════════════════════════════════════
// calcReceiveAmount — حساب المبلغ المستلَم
// ════════════════════════════════════════════════════════════
export function calcReceiveAmount(sendAmount, fromId, toId, rates) {
  const amt = parseFloat(sendAmount) || 0
  if (amt <= 0) return ''

  const { rate, divide } = getRate(fromId, toId, rates)
  const result = divide ? amt / rate : amt * rate
  return result.toFixed(4)
}

// ════════════════════════════════════════════════════════════
// getRateDisplay — نص السعر للعرض في الواجهة
// ════════════════════════════════════════════════════════════
export function getRateDisplay(fromId, toId, rates, fromSymbol, toSymbol) {
  if (!rates) return '...'
  const { rate, divide } = getRate(fromId, toId, rates)

  if (divide) {
    // العميل يدفع N جنيه ليحصل على 1 USDT
    return `${rate.toFixed(2)} ${fromSymbol || 'EGP'} = 1 ${toSymbol || 'USDT'}`
  } else {
    // 1 MoneyGo = 1.004 USDT
    return `1 ${fromSymbol || 'MGO'} = ${rate.toFixed(4)} ${toSymbol || 'USDT'}`
  }
}

// ════════════════════════════════════════════════════════════
// toOrderType — تحويل (fromId, toId) → orderType للـ backend
// ════════════════════════════════════════════════════════════
export function toOrderType(fromId, toId) {
  const MAP = {
    'usdt-trc:wallet-recv':  'USDT_TO_WALLET',
    'usdt-trc:mgo-recv':     'USDT_TO_MONEYGO',
    'wallet-usdt:usdt-recv': 'WALLET_TO_USDT',
    'wallet-usdt:mgo-recv':  'WALLET_TO_MONEYGO',
    'mgo-send:usdt-recv':    'MONEYGO_TO_USDT',
  }

  const key = `${fromId}:${toId}`
  const result = MAP[key]

  if (!result) {
    const egpSenders = ['vodafone', 'instapay', 'fawry', 'orange']
    if (egpSenders.includes(fromId)) return 'EGP_WALLET_TO_MONEYGO'
    console.warn(`[rateEngine] Unknown orderType for: "${fromId}" → "${toId}"`)
    return 'EGP_WALLET_TO_MONEYGO'
  }

  return result
}

// ════════════════════════════════════════════════════════════
// toPaymentMethod — تحويل fromId → payment.method للـ backend
// ════════════════════════════════════════════════════════════
export function toPaymentMethod(fromId) {
  const MAP = {
    'vodafone':    'VODAFONE_CASH',
    'instapay':    'INSTAPAY',
    'fawry':       'FAWRY',
    'orange':      'ORANGE_CASH',
    'usdt-trc':    'USDT_TRC20',
    'mgo-send':    'MONEYGO',
    'wallet-usdt': 'WALLET',
  }
  return MAP[fromId] || 'VODAFONE_CASH'
}

// ════════════════════════════════════════════════════════════
// getCurrencySent — العملة المرسلة حسب fromId
// ════════════════════════════════════════════════════════════
export function getCurrencySent(fromId) {
  const egpSenders = ['vodafone', 'instapay', 'fawry', 'orange']
  if (egpSenders.includes(fromId)) return 'EGP'
  if (fromId === 'mgo-send')       return 'MGO'
  return 'USDT'
}