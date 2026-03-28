// src/components/common/Footer.jsx
import { useNavigate } from 'react-router-dom'
import useLang from '../../context/useLang'

function Footer() {
  const { t, lang } = useLang()
  const navigate = useNavigate()

  const isAr = lang === 'ar'

  const companyLinks = [
    { label: isAr ? 'من نحن'       : 'About Us',     path: '/about'        },
    { label: isAr ? 'كيف تعمل'     : 'How It Works',  path: '/how-it-works'  },
    { label: isAr ? 'التقييمات'    : 'Reviews',       path: '/reviews'      },
    { label: isAr ? 'تواصل معنا'   : 'Contact Us',    path: '/contact'      },
    { label: isAr ? 'الأسئلة الشائعة' : 'FAQ',        path: '/faq'          },
  ]

  const legalLinks = [
    { label: isAr ? 'شروط الخدمة'     : 'Terms of Service', path: '/terms'   },
    { label: isAr ? 'سياسة الخصوصية'  : 'Privacy Policy',   path: '/privacy' },
    { label: 'AML / KYC Policy',                              path: '/aml'     },
    { label: isAr ? 'سياسة الكوكيز'   : 'Cookie Policy',    path: '/cookies' },
  ]

  const supportLinks = [
    { label: isAr ? 'الأسعار'      : 'Rates',        path: '/rates'   },
    { label: isAr ? 'تتبع الطلب'   : 'Track Order',  path: '/track'   },
    { label: isAr ? 'الدعم الفني'  : 'Help Center',  path: '/contact' },
  ]

  const LinkItem = ({ label, path }) => (
    <button onClick={() => navigate(path)}
      style={{ display: 'block', width: '100%', textAlign: isAr ? 'right' : 'left', background: 'none', border: 'none', fontSize: '0.82rem', color: 'var(--text-3)', cursor: 'pointer', padding: '3px 0', fontFamily: "'Tajawal',sans-serif", transition: 'color 0.2s', marginBottom: 6 }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
      {label}
    </button>
  )

  const ColTitle = ({ text }) => (
    <h4 style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--cyan)', margin: '0 0 14px', paddingBottom: 8, borderBottom: '1px solid var(--border-1)' }}>
      {text}
    </h4>
  )

  return (
    <footer style={{ background: 'var(--card)', borderTop: '1px solid var(--border-1)', padding: '48px 0 22px', direction: isAr ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 40, marginBottom: 36 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.15rem', fontWeight: 900, color: 'var(--cyan)', letterSpacing: 2 }}>NUMBER 1</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>EXCHANGE</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.8, margin: '0 0 16px', maxWidth: 250, fontFamily: "'Tajawal',sans-serif" }}>
              {t('footer_desc')}
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: '✈️', label: 'Telegram', href: 'https://t.me/' },
                { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/' },
                { icon: '📧', label: 'Email',    href: 'mailto:support@number1.exchange' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--border-1)', color: 'var(--text-3)', fontSize: '0.72rem', textDecoration: 'none', fontFamily: "'JetBrains Mono',monospace", transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.color = 'var(--text-3)' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <ColTitle text={isAr ? 'الشركة' : 'Company'} />
            {companyLinks.map(l => <LinkItem key={l.path} {...l} />)}
          </div>

          {/* Legal */}
          <div>
            <ColTitle text={isAr ? 'قانوني' : 'Legal'} />
            {legalLinks.map(l => <LinkItem key={l.path} {...l} />)}
          </div>

          {/* Support */}
          <div>
            <ColTitle text={isAr ? 'الدعم' : 'Support'} />
            {supportLinks.map(l => <LinkItem key={l.path} {...l} />)}
            <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace', letterSpacing: 1, marginBottom: 3" }}>SUPPORT EMAIL</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontFamily: "'JetBrains Mono',monospace" }}>support@number1.exchange</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border-1)', paddingTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace" }}>
            {t('footer_copy')} — ALL RIGHTS RESERVED
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Terms',   path: '/terms'   },
              { label: 'Privacy', path: '/privacy' },
              { label: 'AML',     path: '/aml'     },
              { label: 'Cookies', path: '/cookies' },
            ].map(l => (
              <button key={l.path} onClick={() => navigate(l.path)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", padding: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer