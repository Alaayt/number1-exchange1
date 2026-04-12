// services/balanceEngine.js
// ═══════════════════════════════════════════════════════════════
// Single source of truth for balance/liquidity updates.
// ═══════════════════════════════════════════════════════════════

const Rate = require('../models/Rate')

// ── Order type → currency mapping ─────────────────────────────
const ORDER_TYPE_CURRENCIES = {
  EGP_TO_USDT:           { currencySent: 'EGP',  currencyRecv: 'USDT' },
  EGP_TO_MONEYGO:        { currencySent: 'EGP',  currencyRecv: 'MGO'  },
  EGP_WALLET_TO_MONEYGO: { currencySent: 'EGP',  currencyRecv: 'MGO'  },
  USDT_TO_MONEYGO:       { currencySent: 'USDT', currencyRecv: 'MGO'  },
  USDT_TO_WALLET:        { currencySent: 'USDT', currencyRecv: null   },
  WALLET_TO_USDT:        { currencySent: null,   currencyRecv: 'USDT' },
  WALLET_TO_MONEYGO:     { currencySent: null,   currencyRecv: 'MGO'  },
  MONEYGO_TO_USDT:       { currencySent: 'MGO',  currencyRecv: 'USDT' },
  MONEYGO_TO_WALLET:     { currencySent: 'MGO',  currencyRecv: null   },
}

function getCurrencies(order) {
  const ot = order.orderType || ''
  const mapped = ORDER_TYPE_CURRENCIES[ot]
  if (mapped) return mapped
  const currencySent = order.payment?.currencySent || 'USDT'
  console.warn(`[BalanceEngine] Unknown orderType "${ot}" — fallback: ${currencySent} → USDT`)
  return { currencySent, currencyRecv: 'USDT' }
}

// ═══════════════════════════════════════════════════════════════
// processTransaction — updates availableEgp/Usdt/Mgo via $inc
// ═══════════════════════════════════════════════════════════════
async function processTransaction(order) {
  try {
    const { currencySent, currencyRecv } = getCurrencies(order)

    const amountSent = parseFloat(order.payment?.amountSent) || 0
    const amountRecv =
      parseFloat(order.moneygo?.amountUSD) ||
      parseFloat(order.exchangeRate?.finalAmountUSD) ||
      0

    const effectiveSent = currencySent ? amountSent : 0
    const effectiveRecv = currencyRecv ? amountRecv : 0

    if (effectiveSent <= 0 && effectiveRecv <= 0) {
      console.log(`[BalanceEngine] ${order.orderNumber} (${order.orderType}): no liquidity change needed.`)
      return { success: true, inc: {} }
    }

    const inc = {}

    // Customer sends → platform gets it → balance UP
    if (currencySent === 'EGP'  && effectiveSent > 0) inc.availableEgp  = (inc.availableEgp  || 0) + effectiveSent
    if (currencySent === 'USDT' && effectiveSent > 0) inc.availableUsdt = (inc.availableUsdt || 0) + effectiveSent
    if (currencySent === 'MGO'  && effectiveSent > 0) inc.availableMgo  = (inc.availableMgo  || 0) + effectiveSent

    // Customer receives → platform pays it → balance DOWN
    if (currencyRecv === 'EGP'  && effectiveRecv > 0) inc.availableEgp  = (inc.availableEgp  || 0) - effectiveRecv
    if (currencyRecv === 'USDT' && effectiveRecv > 0) inc.availableUsdt = (inc.availableUsdt || 0) - effectiveRecv
    if (currencyRecv === 'MGO'  && effectiveRecv > 0) inc.availableMgo  = (inc.availableMgo  || 0) - effectiveRecv

    if (Object.keys(inc).length === 0) {
      console.log(`[BalanceEngine] ${order.orderNumber}: inc empty, skipping.`)
      return { success: true, inc: {} }
    }

    await Rate.findOneAndUpdate({}, { $inc: inc }, { new: true })

    console.log(
      `[BalanceEngine] ✅ ${order.orderNumber} (${order.orderType}) |`,
      currencySent ? `+${effectiveSent} ${currencySent}` : '',
      currencyRecv ? `-${effectiveRecv} ${currencyRecv}` : '',
      '| $inc:', JSON.stringify(inc)
    )

    return { success: true, inc }
  } catch (err) {
    console.error(`[BalanceEngine] ❌ processTransaction failed for ${order.orderNumber}:`, err.message)
    return { success: false, error: err.message }
  }
}

// ═══════════════════════════════════════════════════════════════
// completeOrder — the main function called from everywhere
//   1. Mark order as completed + save
//   2. Update liquidity (Rate.$inc)
//   3. Credit wallet if USDT_TO_WALLET / MONEYGO_TO_WALLET
// ═══════════════════════════════════════════════════════════════
async function completeOrder(order, completedBy = 'system', note = '') {
  // Guard: already completed
  if (order.status === 'completed') {
    console.warn(`[BalanceEngine] Order ${order.orderNumber} already completed — skipping.`)
    return { success: false, error: 'already_completed' }
  }

  try {
    // ── Step 1: Update order status ──────────────
    order.status = 'completed'
    order.moneygo.transferStatus = 'sent'
    order.addTimeline(
      'completed',
      note || `🎉 تم إتمام الطلب بنجاح via ${completedBy}`,
      completedBy
    )
    await order.save()
    console.log(`[BalanceEngine] ✅ Step 1: Order ${order.orderNumber} status → completed`)

    // ── Step 2: Update liquidity ─────────────────
    const balanceResult = await processTransaction(order)
    if (!balanceResult.success) {
      console.error(`[BalanceEngine] ⚠️ Step 2 failed for ${order.orderNumber}: ${balanceResult.error}`)
    } else {
      console.log(`[BalanceEngine] ✅ Step 2: Liquidity updated for ${order.orderNumber}`)
    }

    // ── Step 3: Credit wallet (if applicable) ────
    let walletResult = null
    if (order.orderType === 'USDT_TO_WALLET' || order.orderType === 'MONEYGO_TO_WALLET') {
      walletResult = await creditWallet(order)
      console.log(`[BalanceEngine] ✅ Step 3: Wallet credit for ${order.orderNumber}:`, walletResult)
    }

    console.log(`[BalanceEngine] 🔥 Order ${order.orderNumber} completed by ${completedBy}`)
    return { success: true, order, walletResult }
  } catch (err) {
    console.error(`[BalanceEngine] ❌ completeOrder FAILED for ${order.orderNumber}:`, err.message, err.stack)
    return { success: false, error: err.message }
  }
}

// ═══════════════════════════════════════════════════════════════
// creditWallet — credit user's internal wallet on completion
// ═══════════════════════════════════════════════════════════════
async function creditWallet(order) {
  try {
    const Wallet      = require('../models/Wallet')
    const Transaction = require('../models/Transaction')

    if (!order.user) return { success: false, reason: 'no_user_linked' }

    const alreadyCredited = await Transaction.findOne({
      order: order._id, type: 'deposit', status: 'completed'
    })
    if (alreadyCredited) return { success: false, reason: 'already_credited' }

    const amountToAdd = parseFloat(order.exchangeRate?.finalAmountUSD)
    if (!amountToAdd || amountToAdd <= 0) return { success: false, reason: 'invalid_amount' }

    let wallet = await Wallet.findOne({ user: order.user })
    if (!wallet) wallet = await Wallet.create({ user: order.user })
    if (!wallet.isActive) return { success: false, reason: 'wallet_inactive' }

    const balanceBefore = wallet.balance
    wallet.balance += amountToAdd
    wallet.totalDeposited += amountToAdd
    await wallet.save()

    await Transaction.create({
      user: order.user, wallet: wallet._id, type: 'deposit',
      amount: amountToAdd, balanceBefore, balanceAfter: wallet.balance,
      status: 'completed', performedBy: 'admin:telegram', order: order._id,
      note: `إيداع تلقائي — طلب ${order.orderNumber} — TXID: ${order.payment?.txHash || 'N/A'}`
    })

    console.log(`[BalanceEngine] 💰 Wallet +${amountToAdd} USDT → user ${order.user} | balance: ${wallet.balance}`)
    return { success: true, amountAdded: amountToAdd, newBalance: wallet.balance }
  } catch (err) {
    console.error(`[BalanceEngine] ❌ creditWallet failed:`, err.message)
    return { success: false, reason: err.message }
  }
}

module.exports = {
  processTransaction,
  completeOrder,
  getCurrencies,
  ORDER_TYPE_CURRENCIES,
}
