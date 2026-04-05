// src/components/auth/UserPanel.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'

function UserPanel({ onOpenSettings }) {
  const { user, logout } = useAuth()
  const [open, setOpen]  = useState(false)
  const ref              = useRef(null)
  const navigate         = useNavigate()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const menuItems = [
    {
      label: 'طلباتي',
      icon: '📋',
      onClick: () => { setOpen(false); navigate('/my-orders') }
    },
      {
    label: 'محفظتي',
    icon: '💰',
    onClick: () => { setOpen(false); navigate('/wallet') }
  },
    {
      label: 'الإعدادات والحساب',
      icon: '⚙️',
      onClick: () => { setOpen(false); onOpenSettings() }
    },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{ display:'flex', alignItems:'center', gap:9, padding:'5px 11px 5px 5px', background: open ? 'var(--cyan-dim)' : 'transparent', border:`1px solid ${open ? 'var(--border-2)' : 'var(--border-1)'}`, borderRadius:12, cursor:'pointer', transition:'all 0.22s' }}
        onMouseEnter={e => { e.currentTarget.style.background='var(--cyan-dim)'; e.currentTarget.style.borderColor='var(--border-2)' }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='var(--border-1)' } }}
      >
        <div style={{ width:32, height:32, borderRadius:9, overflow:'hidden', border:'2px solid rgba(0,210,255,0.3)', flexShrink:0 }}>
          {user.avatar?.url
            ? <img src={user.avatar.url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ width:'100%', height:'100%', background:'var(--cyan-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'var(--cyan)', fontSize:'0.85rem' }}>{user.name?.[0] || user.fullName?.[0]}</div>
          }
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-1)', lineHeight:1.2, maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {user.name || user.fullName}
          </div>
          <div style={{ fontSize:'0.63rem', color:'var(--green)', fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>● نشط</div>
        </div>
        <img src="https://cdn-icons-png.flaticon.com/32/271/271228.png" alt="arrow" style={{ width:10, height:10, opacity:0.4, transition:'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, minWidth:210, background:'var(--drop-bg)', border:'1px solid var(--border-1)', borderRadius:14, boxShadow:'0 20px 50px rgba(0,0,0,0.5)', zIndex:200, overflow:'hidden' }}>

          {/* User info */}
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:11, overflow:'hidden', border:'2px solid rgba(0,210,255,0.25)', flexShrink:0 }}>
              {user.avatar?.url
                ? <img src={user.avatar.url} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', background:'var(--cyan-dim)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'var(--cyan)' }}>{user.name?.[0] || user.fullName?.[0]}</div>
              }
            </div>
            <div>
              <div style={{ fontSize:'0.83rem', fontWeight:700, color:'var(--text-1)' }}>{user.name || user.fullName}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>{user.email}</div>
            </div>
          </div>

          {/* Menu items */}
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:'transparent', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontSize:'0.85rem', color:'var(--text-2)', transition:'all 0.15s', textAlign:'right' }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--cyan-dim)'; e.currentTarget.style.color='var(--text-1)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-2)' }}
            >
              <span style={{ fontSize:'1rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Logout */}
          <div style={{ borderTop:'1px solid var(--border-1)' }}>
            <button
              onClick={() => { logout(); setOpen(false) }}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:'transparent', border:'none', cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontSize:'0.85rem', color:'var(--red)', transition:'all 0.15s', textAlign:'right' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,61,90,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <img src="https://cdn-icons-png.flaticon.com/32/1484/1484860.png" alt="logout" style={{ width:16, height:16, filter:'brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(500%) hue-rotate(330deg)' }} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPanel