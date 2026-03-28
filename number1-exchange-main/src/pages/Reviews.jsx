// src/pages/Reviews.jsx
import { useState, useEffect } from 'react'

const REVIEWS = [
  { id:1,  name:'أحمد محمد',    country:'🇸🇦', rating:5, date:'مارس 2025',    amount:'500 USDT → MoneyGo',  text:'خدمة ممتازة! التحويل تم خلال 10 دقائق فقط. السعر أفضل مما وجدته في أي مكان آخر. سأستخدم المنصة دائماً.' },
  { id:2,  name:'محمود علي',    country:'🇪🇬', rating:5, date:'مارس 2025',    amount:'200 USDT → فودافون',  text:'تعاملت معهم مرات عديدة ودائماً الخدمة سريعة وأمينة. فريق الدعم متجاوب جداً على تيليغرام.' },
  { id:3,  name:'خالد العمري', country:'🇸🇦', rating:4, date:'فبراير 2025',   amount:'1000 USDT → MoneyGo', text:'تجربة جيدة جداً. انتظرت 20 دقيقة بسبب ازدحام لكن المبلغ وصل كاملاً. أنصح بهم.' },
  { id:4,  name:'ياسمين حسن',  country:'🇪🇬', rating:5, date:'فبراير 2025',   amount:'300 USDT → إنستاباي', text:'أول تعامل معهم وكان رائعاً. الموقع واضح وسهل، والتحويل وصل بسرعة. شكراً!' },
  { id:5,  name:'عمر الزهراني', country:'🇸🇦', rating:5, date:'يناير 2025',    amount:'750 USDT → MoneyGo',  text:'من أفضل منصات الصرف التي استخدمتها. شفافية كاملة في الأسعار وسرعة في التنفيذ.' },
  { id:6,  name:'نورة القحطاني',country:'🇸🇦', rating:4, date:'يناير 2025',    amount:'150 USDT → فودافون',  text:'الخدمة ممتازة والفريق محترف. السعر منافس جداً مقارنة بالبدائل الأخرى.' },
  { id:7,  name:'مصطفى إبراهيم',country:'🇪🇬', rating:5, date:'ديسمبر 2024',  amount:'2000 USDT → MoneyGo', text:'أثق بهم بمبالغ كبيرة منذ سنة. لم يخذلوني أبداً. الدعم متاح على مدار الساعة.' },
  { id:8,  name:'سارة الأنصاري',country:'🇸🇦', rating:5, date:'ديسمبر 2024',  amount:'400 USDT → إنستاباي', text:'تحويل سلس ومريح. الموقع جميل ومنظم. استمروا هكذا 👍' },
]

const STATS = [
  { value: '10,000+', label: 'صفقة منجزة',   icon: '🔄' },
  { value: '4.9/5',   label: 'متوسط التقييم', icon: '⭐' },
  { value: '98%',     label: 'رضا العملاء',   icon: '😊' },
  { value: '<15 دق',  label: 'متوسط التحويل', icon: '⚡' },
]

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize: '0.8rem', color: s <= rating ? '#f59e0b' : 'var(--border-1)' }}>★</span>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.transform = 'translateY(0)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar placeholder */}
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), #006e9e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: "'Tajawal',sans-serif", flexShrink: 0 }}>
            {review.name[0]}
          </div>
          <div>
            <div style={{ fontFamily: "'Tajawal',sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)' }}>
              {review.name} <span style={{ fontSize: '0.85rem' }}>{review.country}</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace" }}>{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Review text */}
      <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-2)', lineHeight: 1.75, fontFamily: "'Tajawal',sans-serif" }}>
        "{review.text}"
      </p>

      {/* Transaction badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', alignSelf: 'flex-start' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace" }}>✓ {review.amount}</span>
      </div>
    </div>
  )
}

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const filtered = filter === 'all' ? REVIEWS : REVIEWS.filter(r => r.rating === Number(filter))

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 1100, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>CUSTOMER REVIEWS</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 16px' }}>
          ماذا يقول عملاؤنا؟
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-3)', maxWidth: 450, margin: '0 auto', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.8 }}>
          آلاف العملاء يثقون بنا يومياً. اقرأ تجاربهم الحقيقية.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.3rem', fontWeight: 900, color: 'var(--cyan)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: "'Tajawal',sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[{ v:'all', label:'الكل' }, { v:'5', label:'⭐⭐⭐⭐⭐' }, { v:'4', label:'⭐⭐⭐⭐' }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            style={{ padding: '6px 16px', borderRadius: 10, border: `1px solid ${filter === f.v ? 'var(--cyan)' : 'var(--border-1)'}`, background: filter === f.v ? 'var(--cyan-dim)' : 'transparent', color: filter === f.v ? 'var(--cyan)' : 'var(--text-2)', fontFamily: "'Tajawal',sans-serif", fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 48 }}>
        {filtered.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>

      {/* BestChange badge */}
      <div style={{ textAlign: 'center', padding: '28px', background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 18 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace", marginBottom: 8, letterSpacing: 1 }}>VERIFIED ON</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.1rem', color: 'var(--cyan)', fontWeight: 700, marginBottom: 8 }}>BestChange.com</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', margin: 0, fontFamily: "'Tajawal',sans-serif" }}>
          منصتنا مسجلة ومراجعة على BestChange — أكبر مجمع لمقارنة أسعار الصرافات
        </p>
      </div>
    </div>
  )
}