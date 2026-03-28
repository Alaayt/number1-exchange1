// src/components/admin/AdminLayout.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../context/useAuth'

const MENU = [
  { path: '/admin',          icon: '📊', ar: 'لوحة التحكم',    en: 'Dashboard'    },
  { path: '/admin/orders',   icon: '📋', ar: 'الطلبات',        en: 'Orders'       },
  { path: '/admin/users',    icon: '👥', ar: 'المستخدمون',     en: 'Users'        },
  { path: '/admin/rates',    icon: '💱', ar: 'الأسعار',        en: 'Rates'        },
  { path: '/admin/payments', icon: '💳', ar: 'وسائل الدفع',    en: 'Payments'     },
  { path: '/admin/liquidity',icon: '💰', ar: 'السيولة',        en: 'Liquidity'    },
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#080e1a',
      fontFamily: "'Tajawal', sans-serif",
      direction: 'rtl',
    }}>

      {/* ── Sidebar ─────────────────────────────── */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background: 'rgba(15,23,42,0.95)',
        borderLeft: '1px solid rgba(0,210,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '20px 16px',
          borderBottom: '1px solid rgba(0,210,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
        }}>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '0.8rem', fontWeight: 900, color: '#00d2ff', letterSpacing: 2 }}>NUMBER 1</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(148,163,184,0.5)', letterSpacing: 3 }}>ADMIN PANEL</div>
            </div>
          )}
          <button onClick={() => setCollapsed(v => !v)}
            style={{ background: 'transparent', border: 'none', color: 'rgba(148,163,184,0.5)', cursor: 'pointer', fontSize: '1rem', padding: 4, flexShrink: 0 }}>
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {MENU.map(item => {
            const isActive = location.pathname === item.path
            return (
              <button key={item.path}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.ar : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '10px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'rgba(0,210,255,0.1)' : 'transparent',
                  color: isActive ? '#00d2ff' : 'rgba(148,163,184,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: "'Tajawal',sans-serif",
                  borderRight: isActive ? '2px solid #00d2ff' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.ar}</span>}
              </button>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(0,210,255,0.08)' }}>
          {!collapsed && (
            <div style={{ padding: '8px 12px', marginBottom: 6 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>{user?.name}</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(148,163,184,0.4)', fontFamily: "'JetBrains Mono',monospace" }}>ADMIN</div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{
              width: '100%', padding: collapsed ? '10px 0' : '9px 12px',
              display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8, borderRadius: 10, border: 'none',
              background: 'transparent', color: '#ef4444',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
              fontFamily: "'Tajawal',sans-serif", transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🚪</span>
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout