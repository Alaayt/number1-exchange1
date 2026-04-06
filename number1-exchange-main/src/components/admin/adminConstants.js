// src/components/admin/adminConstants.js
// Shared constants for all admin pages

export const STATUS_CONFIG = {
  pending:     { label: 'انتظار',          color: '#d97706', bg: '#451a03' },
  verifying:   { label: 'تحقق',            color: '#7c3aed', bg: '#3b1f6e' },
  verified:    { label: 'تم التحقق',       color: '#2563eb', bg: '#1e3a5f' },
  processing:  { label: 'معالجة',          color: '#0891b2', bg: '#0c3547' },
  money_ready: { label: '💸 جاهز للاستلام', color: '#a78bfa', bg: '#2e1a6e' },
  completed:   { label: 'مكتمل',           color: '#059669', bg: '#064e3b' },
  rejected:    { label: 'مرفوض',           color: '#f85149', bg: '#3d0a0a' },
  cancelled:   { label: 'ملغي',            color: '#6e7681', bg: '#21262d' },
}

// Shared crypto network presets (used in AdminWallets + AdminPaymentMethods)
export const CRYPTO_PRESETS = [
  { coin: 'USDT', network: 'TRC20',   label: 'USDT TRC20', icon: '₮', color: '#26a17b' },
  { coin: 'USDT', network: 'BEP20',   label: 'USDT BEP20', icon: '₮', color: '#f0b90b' },
  { coin: 'USDT', network: 'ERC20',   label: 'USDT ERC20', icon: '₮', color: '#627eea' },
  { coin: 'BNB',  network: 'BEP20',   label: 'BNB BEP20',  icon: '◆', color: '#f0b90b' },
  { coin: 'BTC',  network: 'Bitcoin', label: 'Bitcoin',    icon: '₿', color: '#f7931a' },
  { coin: 'ETH',  network: 'ERC20',   label: 'ETH ERC20',  icon: 'Ξ', color: '#627eea' },
  { coin: 'TRX',  network: 'TRC20',   label: 'TRX TRC20',  icon: '◈', color: '#ff060a' },
  { coin: 'USDC', network: 'ERC20',   label: 'USDC ERC20', icon: '$', color: '#2775ca' },
]

// Unique ID generator (used in AdminWallets + AdminPaymentMethods)
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
