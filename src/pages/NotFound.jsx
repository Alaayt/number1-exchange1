// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', direction: 'rtl' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(4rem,15vw,7rem)', fontWeight: 900, color: 'var(--cyan)', opacity: 0.18, lineHeight: 1, marginBottom: 16 }}>404</div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 14px' }}>الصفحة غير موجودة</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.8, marginBottom: 28 }}>
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/')}
            style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#009fc0,#006e9e)', border: 'none', borderRadius: 10, color: '#fff', fontFamily: "'Tajawal',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            الرئيسية
          </button>
          <button onClick={() => navigate('/contact')}
            style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--border-1)', borderRadius: 10, color: 'var(--text-2)', fontFamily: "'Tajawal',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            تواصل معنا
          </button>
        </div>
      </div>
    </div>
  )
}