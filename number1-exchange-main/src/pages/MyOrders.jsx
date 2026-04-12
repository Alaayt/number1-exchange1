// src/pages/MyOrders.jsx
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import useAuth                 from '../context/useAuth'

const API = import.meta.env.VITE_API_URL

const STATUS_CONFIG = {
  pending:    { label: 'انتظار',    color: '#f59e0b', bg: '#451a03' },
  verifying:  { label: 'تحقق',     color: '#a78bfa', bg: '#3b1f6e' },
  verified:   { label: 'تم التحقق', color: '#60a5fa', bg: '#1e3a5f' },
  processing: { label: 'معالجة',   color: '#00b8d9', bg: '#0c3547' },
  completed:  { label: 'مكتمل',    color: '#00e5a0', bg: '#064e3b' },
  rejected:   { label: 'مرفوض',   color: '#f43f5e', bg: '#3d0a0a' },
  cancelled:  { label: 'ملغي',     color: '#6e7681', bg: '#21262d' },
  expired:    { label: 'منتهي',    color: '#9ca3af', bg: '#1f2937' },
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth()
  const navigate          = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (authLoading) return
    window.scrollTo(0, 0)
    if (!user) { navigate('/'); return }
    fetchOrders()
  }, [user, authLoading])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('n1_token')
      const res   = await fetch(`${API}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data  = await res.json()
      if (data.success) setOrders(data.orders || [])
      else setError(data.message || 'حدث خطأ')
    } catch {
      setError('تعذر الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'80vh', padding:'60px 24px', maxWidth:800, margin:'0 auto', direction:'rtl' }}>

      {/* Header */}
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Tajawal',sans-serif", fontSize:'1.8rem', fontWeight:900, color:'var(--text-1)', margin:'0 0 6px' }}>
          📋 طلباتي
        </h1>
        <p style={{ color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", margin:0 }}>
          جميع طلبات الصرافة الخاصة بك
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:60, color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif" }}>
          ⏳ جاري التحميل...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding:20, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:12, color:'#f43f5e', fontFamily:"'Tajawal',sans-serif", textAlign:'center' }}>
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign:'center', padding:60, background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:20 }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
          <h3 style={{ fontFamily:"'Tajawal',sans-serif", color:'var(--text-1)', margin:'0 0 8px' }}>لا يوجد طلبات بعد</h3>
          <p style={{ color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", fontSize:'0.9rem', marginBottom:20 }}>
            ابدأ أول عملية صرافة الآن
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ padding:'10px 24px', background:'linear-gradient(135deg,#009fc0,#006e9e)', border:'none', borderRadius:10, color:'#fff', fontFamily:"'Tajawal',sans-serif", fontWeight:700, cursor:'pointer' }}
          >
            ابدأ الآن
          </button>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.map((order) => {
        const s = STATUS_CONFIG[order.status] || { label: order.status, color:'#8b949e', bg:'#21262d' }
        return (
          <div key={order._id} style={{ background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:16, padding:'20px 24px', marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>

            {/* Left: order info */}
            <div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.9rem', fontWeight:700, color:'var(--cyan)', marginBottom:6 }}>
                {order.orderNumber}
              </div>
              <div style={{ fontFamily:"'Tajawal',sans-serif", fontSize:'0.85rem', color:'var(--text-2)', marginBottom:4 }}>
                {order.payment?.amountSent} {order.payment?.currencySent} → {order.moneygo?.amountUSD} USD
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', color:'var(--text-3)' }}>
                {new Date(order.createdAt).toLocaleString('ar-EG')}
              </div>
            </div>

            {/* Right: status + action */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
              <span style={{ padding:'4px 12px', borderRadius:20, fontSize:'0.78rem', fontWeight:700, background: s.bg, color: s.color, fontFamily:"'Tajawal',sans-serif" }}>
                {s.label}
              </span>
              <button
                onClick={() => navigate(`/track?id=${order.orderNumber}`)}
                style={{ padding:'6px 16px', background:'transparent', border:'1px solid var(--border-1)', borderRadius:8, color:'var(--text-2)', fontFamily:"'Tajawal',sans-serif", fontSize:'0.8rem', cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--cyan)'; e.currentTarget.style.color='var(--cyan)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-1)'; e.currentTarget.style.color='var(--text-2)' }}
              >
                تتبع الطلب ←
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}