// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'

// ── Stat Card ──────────────────────────────────
function StatCard({ icon, label, value, sub, color = '#00d2ff' }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.8)',
      border: `1px solid ${color}22`,
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}55`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${color}22`}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', marginBottom: 4, letterSpacing: 1 }}>{label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color, fontFamily: "'Orbitron',sans-serif", lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.4)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ── Order Row ──────────────────────────────────
function OrderRow({ order }) {
  const statusColor = {
    pending:    '#f59e0b',
    processing: '#3b82f6',
    completed:  '#22c55e',
    rejected:   '#ef4444',
  }

  const statusAr = {
    pending:    'معلّق',
    processing: 'قيد المعالجة',
    completed:  'مكتمل',
    rejected:   'مرفوض',
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr',
      gap: 12,
      padding: '14px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'center',
      fontSize: '0.82rem',
      transition: 'background 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: '#00d2ff', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.75rem' }}>
        #{order.orderNumber || order._id?.slice(-6)}
      </span>
      <span style={{ color: '#e2e8f0' }}>{order.user?.name || 'مجهول'}</span>
      <span style={{ color: '#94a3b8' }}>{order.fromAmount} {order.fromCurrency}</span>
      <span style={{ color: '#94a3b8' }}>{order.toAmount} {order.toCurrency}</span>
      <span style={{
        padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
        background: `${statusColor[order.status] || '#94a3b8'}18`,
        color: statusColor[order.status] || '#94a3b8',
        border: `1px solid ${statusColor[order.status] || '#94a3b8'}30`,
        display: 'inline-block',
      }}>
        {statusAr[order.status] || order.status}
      </span>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────
function AdminDashboard() {
  const [stats,  setStats]  = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getOrders({ limit: 8 }),
        ])
        setStats(statsRes.data)
        setOrders(ordersRes.data?.orders || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#00d2ff', fontSize: '1rem' }}>
        ⏳ جاري التحميل...
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.3rem', fontWeight: 900, color: '#e2e8f0', marginBottom: 6 }}>
          لوحة التحكم
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'rgba(148,163,184,0.5)' }}>
          مرحباً — إليك ملخص النشاط اليوم
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="📋" label="إجمالي الطلبات"   value={stats?.totalOrders   ?? 0} color="#00d2ff" />
        <StatCard icon="⏳" label="طلبات معلّقة"      value={stats?.pendingOrders ?? 0} color="#f59e0b" />
        <StatCard icon="✅" label="طلبات مكتملة"      value={stats?.completedOrders ?? 0} color="#22c55e" />
        <StatCard icon="👥" label="إجمالي المستخدمين" value={stats?.totalUsers    ?? 0} color="#a78bfa" />
      </div>

      {/* Recent Orders Table */}
      <div style={{
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid rgba(0,210,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,210,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, color: '#e2e8f0', fontSize: '0.9rem' }}>📋 آخر الطلبات</span>
          <button
            onClick={() => {}}
            style={{ background: 'transparent', border: '1px solid rgba(0,210,255,0.2)', borderRadius: 8, padding: '5px 12px', color: '#00d2ff', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
            عرض الكل
          </button>
        </div>

        {/* Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr',
          gap: 12, padding: '10px 16px',
          background: 'rgba(255,255,255,0.02)',
          fontSize: '0.7rem', color: 'rgba(148,163,184,0.4)',
          fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1,
        }}>
          <span>رقم الطلب</span>
          <span>العميل</span>
          <span>من</span>
          <span>إلى</span>
          <span>الحالة</span>
        </div>

        {/* Rows */}
        {orders.length > 0
          ? orders.map(o => <OrderRow key={o._id} order={o} />)
          : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(148,163,184,0.4)', fontSize: '0.85rem' }}>
              لا توجد طلبات بعد
            </div>
          )
        }
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard