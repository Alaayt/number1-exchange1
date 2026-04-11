// services/balanceEngine.js
// ═══════════════════════════════════════════════════════════════
// Single source of truth for balance/liquidity updates.
// Replaces the old duplicated updateLiquidity() functions in
// server.js, admin.js, and the unused liquidity.js service.
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose')
const Rate     = require('../models/Rate')

// ── Order type → currency mapping ─────────────────────────────
const ORDER_TYPE_CURRENCIES = {
  EGP_TO_USDT:           { currencySent: 'EGP',  currencyRecv: 'USDT' },
  EGP_TO_MONEYGO:        { currencySent: 'EGP',  currencyRecv: 'MGO'  },
  EGP_WALLET_TO_MONEYGO: { currencySent: 'EGP',  currencyRecv: 'MGO'  },
  USDT_TO_MONEYGO:       { currencySent: 'USDT', currencyRecv: 'MGO'  },
  USDT_TO_WALLET:        { currencySent: 'USDT', currencyRecv: null   }, // internal — no outbound liquidity
  WALLET_TO_USDT:        { currencySent: null,   currencyRecv: 'USDT' }, // wallet → we send USDT outbound
  WALLET_TO_MONEYGO:     { currencySent: null,   currencyRecv: 'MGO'  }, // wallet → we send MGO outbound
  MONEYGO_TO_USDT:       { currencySent: 'MGO',  currencyRecv: 'USDT' },
  MONEYGO_TO_WALLET:     { currencySent: 'MGO',  currencyRecv: null   }, // internal — no outbound liquidity
}

/**
 * Resolve the send/receive currencies from an order's type.
 * Falls back to payment.currencySent if unmapped (with a warning).
 */
function getCurrencies(order) {
  const ot = order.orderType || ''
  const mapped = ORDER_TYPE_CURRENCIES[ot]
  if (mapped) return mapped

  // Fallback for unknown order types
  const currencySent = order.payment?.currencySent || 'USDT'
  console.warn(
    `[BalanceEngine] Unknown orderType "${ot}" for order ${order.orderNumber}. ` +
    `Falling back to currencySent=${currencySent}, currencyRecv=USDT.`
  )
  return { currencySent, currencyRecv: 'USDT' }
}

/**
 * Build the MongoDB $inc object for a completed order.
 * - Platform RECEIVES what the customer SENDS → balance goes UP
 * - Platform SENDS what the customer RECEIVES → balance goes DOWN
 */
function buildIncrement(currencySent, currencyRecv, amountSent, amountRecv) {
  const inc = {}

  // Customer sends → platform balance increases
  if (currencySent === 'EGP'  && amountSent > 0) inc.availableEgp  = (inc.availableEgp  || 0) + amountSent
  if (currencySent === 'USDT' && amountSent > 0) inc.availableUsdt = (inc.availableUsdt || 0) + amountSent
  if (currencySent === 'MGO'  && amountSent > 0) inc.availableMgo  = (inc.availableMgo  || 0) + amountSent

  // Customer receives → platform balance decreases
  if (currencyRecv === 'EGP'  && amountRecv > 0) inc.availableEgp  = (inc.availableEgp  || 0) - amountRecv
  if (currencyRecv === 'USDT' && amountRecv > 0) inc.availableUsdt = (inc.availableUsdt || 0) - amountRecv
  if (currencyRecv === 'MGO'  && amountRecv > 0) inc.availableMgo  = (inc.availableMgo  || 0) - amountRecv

  return inc
}

/**
 * processTransaction — atomically updates liquidity balances for a completed order.
 *
 * @param {Object}  order    - The completed Order document
 * @param {Object}  [opts]   - Options
 * @param {ClientSession} [opts.session] - Existing Mongoose session to join (for external transactions)
 * @returns {{ success: boolean, inc?: Object, error?: string }}
 */
async function processTransaction(order, opts = {}) {
  const { currencySent, currencyRecv } = getCurrencies(order)

  const amountSent = parseFloat(order.payment?.amountSent) || 0
  const amountRecv =
    parseFloat(order.moneygo?.amountUSD) ||
    parseFloat(order.exchangeRate?.finalAmountUSD) ||
    0

  // For internal-only transfers (both null), no liquidity change is needed
  const effectiveSent = currencySent ? amountSent : 0
  const effectiveRecv = currencyRecv ? amountRecv : 0

  if (effectiveSent <= 0 && effectiveRecv <= 0) {
    console.log(`[BalanceEngine] Order ${order.orderNumber} (${order.orderType}): no external liquidity change.`)
    return { success: true, inc: {} }
  }

  const inc = buildIncrement(currencySent, currencyRecv, effectiveSent, effectiveRecv)

  if (Object.keys(inc).length === 0) {
    console.log(`[BalanceEngine] Order ${order.orderNumber}: inc is empty, skipping.`)
    return { success: true, inc: {} }
  }

  try {
    // Use provided session (for parent transactions) or run standalone
    const updateOpts = opts.session ? { session: opts.session, new: true } : { new: true }
    await Rate.findOneAndUpdate({}, { $inc: inc }, updateOpts)

    console.log(
      `[BalanceEngine] ✅ ${order.orderNumber} (${order.orderType}) |`,
      currencySent ? `+${effectiveSent} ${currencySent}` : '(no send)',
      currencyRecv ? `-${effectiveRecv} ${currencyRecv}` : '(no recv)',
      '| $inc:', JSON.stringify(inc)
    )

    return { success: true, inc }
  } catch (err) {
    console.error(`[BalanceEngine] ❌ Failed for order ${order.orderNumber}:`, err.message)
    return { success: false, error: err.message }
  }
}

/**
 * completeOrder — Wraps the full "complete" workflow in a DB transaction:
 *  1. Mark order as completed
 *  2. Update liquidity balances
 *  3. Credit internal wallet (if USDT_TO_WALLET)
 *
 * @param {Object} order          - The Order document (must NOT already be completed)
 * @param {string} [completedBy]  - Actor string for the timeline (e.g. 'admin:telegram')
 * @param {string} [note]         - Optional timeline note
 * @returns {{ success: boolean, order?: Object, walletResult?: Object, error?: string }}
 */
async function completeOrder(order, completedBy = 'system', note = '') {
  // Guard: already completed
  if (order.status === 'completed') {
    console.warn(`[BalanceEngine] Order ${order.orderNumber} already completed — skipping.`)
    return { success: false, error: 'already_completed' }
  }

  const session = await mongoose.startSession()

  try {
    let walletResult = null

    await session.withTransaction(async () => {
      // 1. Update order status
      order.status = 'completed'
      order.moneygo.transferStatus = 'sent'
      order.addTimeline(
        'completed',
        note || `🎉 تم إتمام الطلب بنجاح via ${completedBy}`,
        completedBy
      )
      await order.save({ session })

      // 2. Update liquidity
      const balanceResult = await processTransaction(order, { session })
      if (!balanceResult.success) {
        throw new Error(`Liquidity update failed: ${balanceResult.error}`)
      }

      // 3. Credit internal wallet (USDT_TO_WALLET or MONEYGO_TO_WALLET)
      if (order.orderType === 'USDT_TO_WALLET' || order.orderType === 'MONEYGO_TO_WALLET') {
        walletResult = await creditWalletInTransaction(order, session)
      }
    })

    console.log(`[BalanceEngine] 🔥 Order ${order.orderNumber} completed atomically by ${completedBy}`)

    return { success: true, order, walletResult }
  } catch (err) {
    console.error(`[BalanceEngine] ❌ completeOrder failed for ${order.orderNumber}:`, err.message)
    return { success: false, error: err.message }
  } finally {
    await session.endSession()
  }
}

/**
 * Credit a user's internal wallet within an existing transaction session.
 * Only for USDT_TO_WALLET / MONEYGO_TO_WALLET order types.
 */
async function creditWalletInTransaction(order, session) {
  const Wallet      = require('../models/Wallet')
  const Transaction = require('../models/Transaction')

  if (!order.user) {
    return { success: false, reason: 'no_user_linked' }
  }

  // Idempotency: check if already credited
  const alreadyCredited = await Transaction.findOne({
    order: order._id,
    type: 'deposit',
    status: 'completed'
  }).session(session)

  if (alreadyCredited) {
    return { success: false, reason: 'already_credited' }
  }

  const amountToAdd = parseFloat(order.exchangeRate?.finalAmountUSD)
  if (!amountToAdd || amountToAdd <= 0) {
    return { success: false, reason: 'invalid_amount' }
  }

  let wallet = await Wallet.findOne({ user: order.user }).session(session)
  if (!wallet) {
    wallet = await Wallet.create([{ user: order.user }], { session })
    wallet = wallet[0] // .create with session returns an array
  }
  if (!wallet.isActive) {
    return { success: false, reason: 'wallet_inactive' }
  }

  const balanceBefore = wallet.balance
  wallet.balance        += amountToAdd
  wallet.totalDeposited += amountToAdd
  await wallet.save({ session })

  await Transaction.create([{
    user:          order.user,
    wallet:        wallet._id,
    type:          'deposit',
    amount:        amountToAdd,
    balanceBefore,
    balanceAfter:  wallet.balance,
    status:        'completed',
    performedBy:   'admin:telegram',
    order:         order._id,
    note:          `إيداع تلقائي — طلب ${order.orderNumber} — TXID: ${order.payment?.txHash || 'N/A'}`
  }], { session })

  console.log(
    `[BalanceEngine] 💰 Wallet credited +${amountToAdd} USDT for user ${order.user}`,
    `| New balance: ${wallet.balance}`
  )

  return { success: true, amountAdded: amountToAdd, newBalance: wallet.balance }
}

module.exports = {
  processTransaction,
  completeOrder,
  getCurrencies,
  ORDER_TYPE_CURRENCIES,
}
