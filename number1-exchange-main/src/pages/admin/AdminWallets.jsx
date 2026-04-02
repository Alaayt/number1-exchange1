// ============================================
// src/pages/admin/AdminWallets.jsx
// إدارة محافظ المستخدمين
// ============================================
import { useEffect, useState, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { walletAPI } from '../../services/api'

const API      = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const getToken = () => localStorage.getItem('n1_token')

export default function AdminWallets() {
  const [wallets,    setWallets]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState(null)   // المحفظة المختارة للمودال
  const [modalMode,  setModalMode]  = useState('deposit') // 'deposit' | 'adjust'
  const [amount,     setAmount]     = useState('')
  const [adjustType, setAdjustType] = useState('add')  // 'add' | 'subtract'
  const [note,       setNote]       = useState('')
  const [loading2,   setLoading2]   = useState(false)
  const [msg,        setMsg]        = useState(null)

  const fetchWallets = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await walletAPI.getAllWallets()
      setWallets(data.wallets || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchWallets() }, [fetchWallets])

  const openModal = (wallet, mode) => {
    setSelected(wallet)
    setModalMode(mode)
    setAmount(''); setNote(''); setMsg(null); setAdjustType('add')
  }

  // ─── إيداع من الأدمن ─────────────────────
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !selected) return
    setLoading2(true); setMsg(null)
    try {
      await walletAPI.adminDeposit(selected.user._id, {
        amount: parseFloat(amount),
        note:   note || 'Admin deposit'
      })
      setMsg({ type: 'success', text: `تم إيداع ${amount} USDT بنجاح ✅` })
      setAmount(''); setNote('')
      await fetchWallets()
      setTimeout(() => { setSelected(null); setMsg(null) }, 2000)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'فشل الإيداع' })
    } finally { setLoading2(false) }
  }

  // ─── تعديل يدوي من الأدمن (+ أو -) ──────
  const handleAdjust = async () => {
    if (!amount || parseFloat(amount) <= 0 || !selected) return
    setLoading2(true); setMsg(null)
    try {
      const finalAmount = adjustType === 'subtract'
        ? -Math.abs(parseFloat(amount))
        :  Math.abs(parseFloat(amount))

      const res  = await fetch(`${API}/api/admin/wallets/${selected.user._id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ amount: finalAmount, note: note || `Admin adjust: ${finalAmount > 0 ? '+' : ''}${finalAmount}` })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setMsg({ type: 'success', text: `تم التعديل — الرصيد الجديد: ${data.balance?.toFixed(2)} USDT ✅` })
      setAmount(''); setNote('')
      await fetchWallets()
      setTimeout(() => { setSelected(null); setMsg(null) }, 2500)
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'فشل التعديل' })
    } finally { setLoading2(false) }
  }

  const handleToggle = async (userId) => {
    try {
      await walletAPI.toggleWallet(userId)
      await fetchWallets()
    } catch (err) { console.error(err) }
  }

  return (
    <AdminLayout>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>إدارة المحافظ</h2>
        <button style={s.refreshBtn} onClick={fetchWallets} title="تحديث">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
        </button>
      </div>

      <div style={s.card}>
        {loading ? (
          <div style={s.loading}>جاري التحميل...</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['المستخدم', 'الإيميل', 'الرصيد (USDT)', 'إجمالي الإيداع', 'إجمالي السحب', 'الحالة', 'إجراء'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wallets.length === 0 ? (
                <tr><td colSpan={7} style={s.empty}>لا يوجد محافظ</td></tr>
              ) : wallets.map(w => (
                <tr key={w._id}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={s.avatar}>{(w.user?.name || 'U')[0].toUpperCase()}</div>
                      {w.user?.name || '—'}
                    </div>
                  </td>
                  <td style={s.td}>{w.user?.email || '—'}</td>
                  <td style={s.td}>
                    <span style={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700 }}>
                      {w.balance?.toFixed(2)} USDT
                    </span>
                  </td>
                  <td style={s.td}><span style={{ color: '#00e5a0' }}>{w.totalDeposited?.toFixed(2)}</span></td>
                  <td style={s.td}><span style={{ color: '#f85149' }}>{w.totalWithdrawn?.toFixed(2)}</span></td>
                  <td style={s.td}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: w.isActive ? '#064e3b' : '#3d0a0a', color: w.isActive ? '#059669' : '#f85149' }}>
                      {w.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* إيداع */}
                      <button
                        style={s.depositBtn}
                        onClick={() => openModal(w, 'deposit')}
                        title="إيداع USDT"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      {/* تعديل */}
                      <button
                        style={s.adjustBtn}
                        onClick={() => openModal(w, 'adjust')}
                        title="تعديل الرصيد"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      {/* تعطيل/تفعيل */}
                      <button
                        style={w.isActive ? s.blockBtn : s.unblockBtn}
                        onClick={() => handleToggle(w.user._id)}
                        title={w.isActive ? 'تعطيل المحفظة' : 'تفعيل المحفظة'}
                      >
                        {w.isActive ? '🔒' : '🔓'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ══ المودال ══ */}
      {selected && (
        <div style={modal.overlay} onClick={() => setSelected(null)}>
          <div style={modal.box} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={modal.header}>
              <div>
                <span style={modal.title}>
                  {modalMode === 'deposit' ? '➕ إيداع USDT' : '✎ تعديل الرصيد'}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#6e7681', fontFamily: 'monospace', marginTop: 2 }}>
                  {selected.user?.name} — {selected.user?.email}
                </div>
              </div>
              <button style={modal.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            {/* الرصيد الحالي */}
            <div style={{ marginBottom: 16, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'monospace' }}>الرصيد الحالي: </span>
              <span style={{ fontWeight: 700, color: '#00d4ff', fontFamily: 'monospace', fontSize: '1.1rem' }}>{selected.balance?.toFixed(2)} USDT</span>
            </div>

            {/* ── وضع التعديل: اختار + أو - ── */}
            {modalMode === 'adjust' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { id: 'add',      label: '+ إضافة رصيد', color: '#00e5a0', bg: '#064e3b' },
                  { id: 'subtract', label: '- خصم رصيد',   color: '#f85149', bg: '#3d0a0a' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setAdjustType(opt.id)} style={{
                    padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                    fontFamily: "'Tajawal',sans-serif", fontSize: '0.9rem', fontWeight: 700,
                    border: adjustType === opt.id ? `1px solid ${opt.color}` : '1px solid #21262d',
                    background: adjustType === opt.id ? `${opt.bg}` : 'rgba(0,0,0,0.2)',
                    color: adjustType === opt.id ? opt.color : '#6e7681',
                    transition: 'all 0.2s'
                  }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* المبلغ */}
            <div style={{ marginBottom: 12 }}>
              <label style={modal.label}>المبلغ (USDT)</label>
              <input
                type="number" min="0.01" step="0.01"
                value={amount} onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={modal.input}
              />
            </div>

            {/* ملاحظة */}
            <div style={{ marginBottom: 16 }}>
              <label style={modal.label}>ملاحظة (اختياري)</label>
              <input
                type="text" value={note} onChange={e => setNote(e.target.value)}
                placeholder={modalMode === 'deposit' ? 'سبب الإيداع...' : 'سبب التعديل...'}
                style={{ ...modal.input, fontFamily: "'Tajawal',sans-serif" }}
              />
            </div>

            {/* رسالة نتيجة */}
            {msg && (
              <div style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: msg.type === 'success' ? '#064e3b' : '#3d0a0a', color: msg.type === 'success' ? '#00e5a0' : '#f85149', fontFamily: "'Tajawal',sans-serif", fontSize: '0.85rem', textAlign: 'center' }}>
                {msg.text}
              </div>
            )}

            {/* زر التنفيذ */}
            <button
              onClick={modalMode === 'deposit' ? handleDeposit : handleAdjust}
              disabled={loading2 || !amount || parseFloat(amount) <= 0}
              style={{
                width: '100%', padding: 12, border: 'none', borderRadius: 10,
                fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: '0.95rem',
                cursor: loading2 || !amount ? 'not-allowed' : 'pointer',
                opacity: loading2 || !amount ? 0.7 : 1,
                background: modalMode === 'deposit'
                  ? 'linear-gradient(135deg,#059669,#047857)'
                  : adjustType === 'add'
                    ? 'linear-gradient(135deg,#059669,#047857)'
                    : 'linear-gradient(135deg,#f85149,#c0392b)',
                color: '#fff'
              }}
            >
              {loading2
                ? '⏳ جاري التنفيذ...'
                : modalMode === 'deposit'
                  ? `إيداع ${amount || '0'} USDT`
                  : adjustType === 'add'
                    ? `إضافة ${amount || '0'} USDT`
                    : `خصم ${amount || '0'} USDT`
              }
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

const s = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle:  { fontSize: 20, fontWeight: 700, color: '#e6edf3', margin: 0 },
  refreshBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid #21262d', borderRadius: 8, background: '#161b22', color: '#8b949e', cursor: 'pointer' },
  card:       { backgroundColor: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' },
  loading:    { padding: 40, textAlign: 'center', color: '#6e7681' },
  table:      { width: '100%', borderCollapse: 'collapse' },
  th:         { textAlign: 'right', padding: '10px 14px', fontSize: 12, color: '#6e7681', borderBottom: '1px solid #21262d', fontWeight: 500 },
  td:         { padding: '11px 14px', fontSize: 13, color: '#c9d1d9', borderBottom: '1px solid #161b22' },
  empty:      { padding: 40, textAlign: 'center', color: '#6e7681' },
  avatar:     { width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 },
  depositBtn: { background: '#064e3b', border: 'none', color: '#059669', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  adjustBtn:  { background: '#2d2a1a', border: 'none', color: '#f59e0b', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  blockBtn:   { background: '#3d0a0a', border: 'none', color: '#f85149', borderRadius: 6, padding: '5px 8px', cursor: 'pointer' },
  unblockBtn: { background: '#064e3b', border: 'none', color: '#059669', borderRadius: 6, padding: '5px 8px', cursor: 'pointer' },
}

const modal = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  box:     { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: 14, padding: 24, width: '100%', maxWidth: 440 },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title:   { fontSize: 16, fontWeight: 700, color: '#e6edf3' },
  closeBtn:{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', fontSize: 18 },
  label:   { display: 'block', fontSize: '0.72rem', color: '#6e7681', fontFamily: 'monospace', marginBottom: 6 },
  input:   { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #21262d', borderRadius: 10, color: '#e6edf3', fontFamily: 'monospace', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', direction: 'ltr' },
}