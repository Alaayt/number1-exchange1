// src/components/common/Navbar.jsx
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useTheme    from '../../context/useTheme'
import useLang     from '../../context/useLang'
import { AuthContext } from '../../context/AuthContext'
const NAV_ITEMS = [
  { path: '/',             ar: 'الرئيسية',         en: 'Home'         },
  { path: '/rates',        ar: 'الأسعار',           en: 'Rates'        },
  { path: '/how-it-works', ar: 'كيف تعمل',          en: 'How It Works' },
  { path: '/reviews',      ar: 'التقييمات',         en: 'Reviews'      },
  { path: '/faq',          ar: 'الأسئلة الشائعة',   en: 'FAQ'          },
  { path: '/contact',      ar: 'تواصل معنا',         en: 'Contact'      },
]

// ── Original Logo (unchanged) ──────────────────────────────
function Logo({ onClick }) {
  return (
    <a onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:12, textDecoration:'none', cursor:'pointer', userSelect:'none', flexShrink:0 }}>
      <div style={{ position:'relative', width:40, height:48, perspective:260 }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', width:56, height:56, transform:'translate(-50%,-50%) rotateX(80deg)', borderRadius:'50%', border:'1.5px solid rgba(0,210,255,0.28)', animation:'ringPulse 2.2s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',sans-serif", fontWeight:900, fontSize:'2.6rem', background:'linear-gradient(160deg,#00eeff,#008fb3)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 14px rgba(0,210,255,0.9))', animation:'n1float 4s ease-in-out infinite' }}>1</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', lineHeight:1, gap:3 }}>
        <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'1.3rem', fontWeight:900, color:'var(--cyan)', letterSpacing:2, textShadow:'0 0 18px rgba(0,210,255,0.55)' }}>NUMBER 1</span>
        <span style={{ fontSize:'0.6rem', color:'var(--text-3)', letterSpacing:3, textTransform:'uppercase', fontFamily:"'JetBrains Mono',monospace" }}>EXCHANGE PLATFORM</span>
      </div>
    </a>
  )
}

// ── Theme Toggle ───────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button onClick={onToggle} title="Toggle theme"
      style={{ width:46, height:26, borderRadius:13, position:'relative', cursor:'pointer', background: isDark?'linear-gradient(135deg,#1a2a4a,#0d1a2e)':'linear-gradient(135deg,#87ceeb,#4da6d9)', border:'1.5px solid var(--border-1)', transition:'all 0.4s', flexShrink:0, overflow:'hidden', padding:0 }}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5px', pointerEvents:'none', fontSize:'0.7rem' }}>
        <span style={{ opacity:isDark?1:0.3, transition:'opacity 0.3s' }}>🌙</span>
        <span style={{ opacity:isDark?0.3:1, transition:'opacity 0.3s' }}>☀️</span>
      </div>
      <div style={{ position:'absolute', top:3, right:isDark?3:'auto', left:isDark?'auto':3, width:18, height:18, borderRadius:'50%', background: isDark?'radial-gradient(circle at 35% 35%,#e8f4ff,#a0c4e8)':'radial-gradient(circle at 35% 35%,#fffde0,#ffd700)', boxShadow: isDark?'0 2px 6px rgba(0,0,0,0.4)':'0 2px 8px rgba(255,200,0,0.5)', transition:'all 0.4s' }} />
    </button>
  )
}

// ── Lang Toggle ────────────────────────────────────────────
function LangToggle({ lang, onToggle }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onToggle} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:9, border:`1px solid ${hov?'var(--border-2)':'var(--border-1)'}`, background:hov?'var(--cyan-dim)':'transparent', cursor:'pointer', transition:'all 0.22s', flexShrink:0 }}>
      <span style={{ fontSize:'0.85rem' }}>{lang==='ar'?'🇬🇧':'🇸🇦'}</span>
      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.72rem', fontWeight:700, color:hov?'var(--cyan)':'var(--text-2)', letterSpacing:1, transition:'color 0.22s' }}>{lang==='ar'?'EN':'AR'}</span>
    </button>
  )
}

// ── Nav Link ───────────────────────────────────────────────
function NavLink({ label, isActive, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ fontSize:'0.88rem', color: isActive?'var(--cyan)':hov?'var(--text-1)':'var(--text-2)', background:hov&&!isActive?'var(--cyan-dim)':'transparent', border:'none', padding:'7px 13px', borderRadius:8, cursor:'pointer', fontFamily:"'Tajawal',sans-serif", fontWeight:700, position:'relative', overflow:'hidden', transition:'color 0.2s, background 0.2s', whiteSpace:'nowrap' }}>
      {label}
      {isActive && <span style={{ position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)', width:18, height:2, background:'var(--cyan)', borderRadius:2, boxShadow:'0 0 8px var(--cyan)', display:'block' }} />}
    </button>
  )
}

// ── Mobile Drawer ──────────────────────────────────────────
function MobileDrawer({ isOpen, items, currentPath, onNavigate, onClose, isAr }) {
  if (!isOpen) return null
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', top:0, left:0, right:0, background:'var(--card)', borderBottom:'1px solid var(--border-1)', padding:'20px 22px', display:'flex', flexDirection:'column', gap:4 }}>
        {items.map(item => (
          <button key={item.path} onClick={()=>{ onNavigate(item.path); onClose() }}
            style={{ textAlign:isAr?'right':'left', padding:'12px 16px', borderRadius:10, border:'none', background:currentPath===item.path?'var(--cyan-dim)':'transparent', color:currentPath===item.path?'var(--cyan)':'var(--text-1)', fontFamily:"'Tajawal',sans-serif", fontSize:'1rem', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
            {isAr ? item.ar : item.en}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── User Menu (when logged in) ─────────────────────────────
function UserMenu({ user, onLogout, isAr }) {
  const [open, setOpen] = useState(false)
  const [hov,  setHov]  = useState(false)

  // أول كلمة من الاسم كـ avatar placeholder
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div style={{ position:'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: hov ? 'var(--cyan-dim)' : 'transparent',
          border: `1px solid ${hov ? 'var(--border-2)' : 'var(--border-1)'}`,
          borderRadius: 10, padding: '6px 12px 6px 8px',
          cursor: 'pointer', transition: 'all 0.22s',
        }}
      >
        {/* Avatar circle */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00b8d9,#0086b3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Tajawal',sans-serif", fontSize: '0.82rem',
          fontWeight: 800, color: '#fff', flexShrink: 0,
          boxShadow: '0 0 10px rgba(0,210,255,0.35)',
        }}>
          {initial}
        </div>

        {/* Name */}
        <span style={{
          fontFamily: "'Tajawal',sans-serif", fontSize: '0.85rem',
          fontWeight: 700, color: 'var(--text-1)',
          maxWidth: 90, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user?.name?.split(' ')[0] || (isAr ? 'حسابي' : 'Account')}
        </span>

        {/* Chevron */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98 }} />

          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            right: isAr ? 'auto' : 0, left: isAr ? 0 : 'auto',
            minWidth: 180, zIndex: 99,
            background: 'var(--card)',
            border: '1px solid var(--border-1)',
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
            animation: 'auth-fade 0.18s ease',
          }}>
            {/* User info */}
            <div style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--border-1)',
            }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: 800,
                color: 'var(--text-1)', fontFamily: "'Tajawal',sans-serif",
              }}>
                {user?.name}
              </div>
              <div style={{
                fontSize: '0.7rem', color: 'var(--text-3)',
                fontFamily: "'JetBrains Mono',monospace",
                marginTop: 2, direction: 'ltr', textAlign: isAr ? 'right' : 'left',
              }}>
                {user?.email}
              </div>
            </div>

            {/* Orders link */}
            <button
              onClick={() => setOpen(false)}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'transparent', border: 'none',
                textAlign: isAr ? 'right' : 'left',
                fontFamily: "'Tajawal',sans-serif", fontSize: '0.85rem',
                fontWeight: 700, color: 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--cyan-dim)'; e.currentTarget.style.color = 'var(--cyan)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {isAr ? 'طلباتي' : 'My Orders'}
            </button>

            {/* Logout */}
            <button
              onClick={() => { onLogout(); setOpen(false) }}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'transparent',
                borderTop: '1px solid var(--border-1)', border: 'none',
                borderTop: '1px solid var(--border-1)',
                textAlign: isAr ? 'right' : 'left',
                fontFamily: "'Tajawal',sans-serif", fontSize: '0.85rem',
                fontWeight: 700, color: '#ef4444',
                cursor: 'pointer', transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {isAr ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}


// ── Main Navbar ────────────────────────────────────────────
function Navbar({ onOpenAuth }) {
  const { isDark, toggleTheme } = useTheme()
  const { lang, toggleLang }    = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled,   setScrolled]   = useState(false)
  const [lHov,       setLHov]       = useState(false)
  const [rHov,       setRHov]       = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
const { user, logout } = useContext(AuthContext)
  const isAr    = lang === 'ar'
  const curPath = location.pathname

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [curPath])

  const isActive = (path) =>
    path === '/' ? curPath === '/' : curPath.startsWith(path)

  return (
    <>
      <style>{`
        .nav-links { display:flex; align-items:center; gap:2px; }
        .nav-hamburger { display:none !important; }
        @media (max-width:900px) {
          .nav-links { display:none !important; }
          .nav-hamburger { display:flex !important; }
        }
      `}</style>

      <nav style={{ position:'sticky', top:0, zIndex:100, padding:'11px 0', backdropFilter:'blur(28px) saturate(180%)', background:'var(--nav-bg)', borderBottom:'1px solid var(--border-1)', transition:'box-shadow 0.3s', boxShadow:scrolled?'0 4px 40px rgba(0,210,255,0.07)':'none', direction:isAr?'rtl':'ltr' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

          {/* Logo */}
          <Logo onClick={() => navigate('/')} />

          {/* Desktop nav links */}
          <div className="nav-links" style={{ flex:1, justifyContent:'center' }}>
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                label={isAr ? item.ar : item.en}
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

{/* Right controls */}
<div style={{ display:'flex', gap:9, alignItems:'center', flexShrink:0 }}>
  <LangToggle lang={lang} onToggle={toggleLang} />
  <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

  {user ? (
    // ── مسجّل دخول ──────────────────────────────
    <UserMenu user={user} onLogout={logout} isAr={isAr} />
  ) : (
    // ── غير مسجّل ───────────────────────────────
    <>
      <button onClick={() => onOpenAuth('login')}
        onMouseEnter={() => setLHov(true)} onMouseLeave={() => setLHov(false)}
        style={{ background:lHov?'var(--cyan-dim)':'transparent', border:`1px solid ${lHov?'var(--border-2)':'var(--border-1)'}`, color:lHov?'var(--text-1)':'var(--text-2)', padding:'9px 20px', borderRadius:9, fontFamily:"'Tajawal',sans-serif", fontSize:'0.88rem', fontWeight:700, cursor:'pointer', transition:'all 0.22s', whiteSpace:'nowrap' }}>
        {isAr ? 'تسجيل الدخول' : 'Login'}
      </button>

      <button onClick={() => onOpenAuth('register')}
        onMouseEnter={() => setRHov(true)} onMouseLeave={() => setRHov(false)}
        style={{ background:'linear-gradient(135deg,#00b8d9,#0086b3)', border:'none', color:'#fff', padding:'9px 20px', borderRadius:9, fontFamily:"'Tajawal',sans-serif", fontSize:'0.88rem', fontWeight:700, cursor:'pointer', transform:rHov?'translateY(-2px)':'translateY(0)', boxShadow:rHov?'0 6px 26px rgba(0,210,255,0.38)':'0 0 18px rgba(0,210,255,0.18)', transition:'all 0.22s', whiteSpace:'nowrap' }}>
        {isAr ? 'إنشاء حساب' : 'Sign Up'}
      </button>
    </>
  )}

  <button onClick={() => setMobileOpen(v => !v)} className="nav-hamburger"
    style={{ background:'transparent', border:'1px solid var(--border-1)', borderRadius:8, padding:'6px 10px', cursor:'pointer', color:'var(--text-1)', fontSize:'1.2rem' }}>
    ☰
  </button>
</div>
        </div>
      </nav>

      <MobileDrawer
        isOpen={mobileOpen}
        items={NAV_ITEMS}
        currentPath={curPath}
        onNavigate={navigate}
        onClose={() => setMobileOpen(false)}
        isAr={isAr}
      />
    </>
  )
}

export default Navbar