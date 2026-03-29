// src/pages/Contact.jsx
import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const IcTelegram = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IcWhatsApp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
const IcMail    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const IcCheckCircle = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>

export default function Contact() {
  const [form,     setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [sent,     setSent]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [contacts, setContacts] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    // ── جلب بيانات التواصل من الـ API ──────────
    fetch(`${API}/api/public/settings`)
      .then(r => r.json())
      .then(data => { if (data.success) setContacts(data) })
      .catch(() => {})
  }, [])

  // ── بيانات التواصل — API أو fallback ──────────
  const CHANNELS = [
    {
      icon:  <IcTelegram />,
      name:  'تيليغرام',
      value: contacts?.contactTelegram || '@Number1Exchange',
      link:  `https://t.me/${(contacts?.contactTelegram || 'Number1Exchange').replace('@', '')}`,
      note:  'رد خلال دقائق',
      color: '#2aabee'
    },
    {
      icon:  <IcWhatsApp />,
      name:  'واتساب',
      value: contacts?.contactWhatsapp || '+XXX XXX XXXX',
      link:  `https://wa.me/${(contacts?.contactWhatsapp || '').replace(/\D/g, '')}`,
      note:  'للاستفسارات السريعة',
      color: '#25d366'
    },
    {
      icon:  <IcMail />,
      name:  'البريد الإلكتروني',
      value: contacts?.contactEmail || 'support@number1exchange.com',
      link:  `mailto:${contacts?.contactEmail || 'support@number1exchange.com'}`,
      note:  'رد خلال 24 ساعة',
      color: '#00b8d9'
    },
  ]

  const inp = {
    width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-1)', borderRadius: 10, color: 'var(--text-1)',
    fontFamily: "'Tajawal',sans-serif", fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box', textAlign: 'right',
  }

  const handle = () => {
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1200)
  }

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 900, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>CONTACT US</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 16px' }}>
          تواصل معنا
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-3)', maxWidth: 420, margin: '0 auto', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.8 }}>
          فريق الدعم متاح على مدار الساعة للإجابة على استفساراتك ومساعدتك
        </p>
      </div>

      {/* Contact channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 48 }}>
        {CHANNELS.map(ch => (
          <a key={ch.name} href={ch.link} target="_blank" rel="noopener noreferrer"
            style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 16, padding: '22px 20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 8, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ch.color + '60'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: ch.color + '20', border: `1px solid ${ch.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ch.color, flexShrink: 0 }}>{ch.icon}</div>
              <div>
                <div style={{ fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>{ch.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace" }}>{ch.note}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: ch.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{ch.value}</div>
          </a>
        ))}
      </div>

      {/* Contact form */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 20, padding: '32px 28px' }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 24px', letterSpacing: 1 }}>
          أرسل رسالة مباشرة
        </h2>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ color: 'var(--green)', marginBottom: 16 }}><IcCheckCircle /></div>
            <h3 style={{ fontFamily: "'Tajawal',sans-serif", color: 'var(--text-1)', margin: '0 0 8px' }}>تم إرسال رسالتك!</h3>
            <p style={{ color: 'var(--text-3)', fontFamily: "'Tajawal',sans-serif", fontSize: '0.9rem' }}>سنرد عليك خلال 24 ساعة على أقصى تقدير.</p>
            <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
              style={{ marginTop: 16, padding: '9px 24px', borderRadius: 10, border: '1px solid var(--border-1)', background: 'transparent', color: 'var(--cyan)', fontFamily: "'Tajawal',sans-serif", cursor: 'pointer' }}>
              إرسال رسالة أخرى
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, letterSpacing: 1 }}>الاسم *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="اسمك الكامل" style={inp}
                  onFocus={e => e.target.style.borderColor='var(--cyan)'} onBlur={e => e.target.style.borderColor='var(--border-1)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, letterSpacing: 1 }}>البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="email@example.com" style={{...inp, direction:'ltr', textAlign:'left'}}
                  onFocus={e => e.target.style.borderColor='var(--cyan)'} onBlur={e => e.target.style.borderColor='var(--border-1)'} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, letterSpacing: 1 }}>الموضوع</label>
              <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} placeholder="موضوع رسالتك" style={inp}
                onFocus={e => e.target.style.borderColor='var(--cyan)'} onBlur={e => e.target.style.borderColor='var(--border-1)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 6, letterSpacing: 1 }}>الرسالة *</label>
              <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="اكتب رسالتك هنا..." rows={4}
                style={{...inp, resize:'vertical', minHeight: 100}}
                onFocus={e => e.target.style.borderColor='var(--cyan)'} onBlur={e => e.target.style.borderColor='var(--border-1)'} />
            </div>
            <button onClick={handle} disabled={loading || !form.name || !form.email || !form.message}
              style={{ padding: '12px', background: 'linear-gradient(135deg,#009fc0,#006e9e)', border: 'none', borderRadius: 11, color: '#fff', fontFamily: "'Tajawal',sans-serif", fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', opacity: (!form.name || !form.email || !form.message) ? 0.5 : 1 }}>
              {loading ? 'جاري الإرسال...' : 'إرسال الرسالة ←'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}