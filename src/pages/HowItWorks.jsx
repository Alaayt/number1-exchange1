// src/pages/HowItWorks.jsx
import { useEffect } from 'react'

const STEPS = [
  {
    num: '01',
    icon: '🧮',
    title: 'اختر العملة والمبلغ',
    desc: 'حدد العملة التي تريد إرسالها والعملة التي تريد استقبالها. سيظهر لك السعر الحالي والمبلغ الذي ستحصل عليه بشكل فوري.',
    color: '#00d4ff',
  },
  {
    num: '02',
    icon: '📋',
    title: 'أدخل بيانات المستلم',
    desc: 'أدخل رقم المحفظة أو العنوان الذي تريد إرسال المبلغ إليه. تأكد من صحة البيانات قبل المتابعة.',
    color: '#00e5a0',
  },
  {
    num: '03',
    icon: '💸',
    title: 'أرسل الدفعة',
    desc: 'أرسل المبلغ المطلوب إلى عنوان الدفع الظاهر. للـ USDT: انسخ عنوان TRC-20 وأرسل المبلغ مباشرة.',
    color: '#a78bfa',
  },
  {
    num: '04',
    icon: '📸',
    title: 'أرفع إيصال الدفع',
    desc: 'بعد إتمام الدفع، ارفع صورة الإيصال أو أرسل رقم المعاملة. سيتم مراجعتها من قِبل فريقنا خلال دقائق.',
    color: '#f59e0b',
  },
  {
    num: '05',
    icon: '✅',
    title: 'استقبل أموالك',
    desc: 'بعد التأكيد، يتم تحويل المبلغ فوراً إلى حسابك. ستصلك رسالة تأكيد برقم الطلب لمتابعته.',
    color: '#00e5a0',
  },
]

const METHODS = [
  { icon: '⬡', name: 'USDT TRC-20', desc: 'تحويل آلي فوري', badge: 'تلقائي', color: '#26a17b' },
  { icon: '💳', name: 'فودافون كاش', desc: 'تحويل شبه فوري', badge: 'يدوي', color: '#e40613' },
  { icon: '📱', name: 'إنستاباي',    desc: 'تحويل سريع',     badge: 'يدوي', color: '#6c35de' },
  { icon: '🏦', name: 'MoneyGo USD', desc: 'الاستقبال الرئيسي', badge: 'استقبال', color: '#00b8d9' },
]

const FAQS_MINI = [
  { q: 'كم يستغرق التحويل؟',      a: 'من 5 دقائق إلى 30 دقيقة حسب طريقة الدفع.' },
  { q: 'هل هناك رسوم خفية؟',      a: 'لا. السعر المعروض هو السعر النهائي شامل جميع الرسوم.' },
  { q: 'ما الحد الأدنى للتحويل؟',  a: 'الحد الأدنى 10 USDT أو ما يعادلها.' },
  { q: 'هل تحويلاتي آمنة؟',       a: 'نعم. نستخدم TronGrid API ونتحقق من كل معاملة يدوياً.' },
]

export default function HowItWorks() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 900, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 20, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 2 }}>HOW IT WORKS</span>
        </div>
        <h1 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: 'var(--text-1)', margin: '0 0 16px' }}>
          كيف تعمل المنصة؟
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-3)', maxWidth: 500, margin: '0 auto', fontFamily: "'Tajawal',sans-serif", lineHeight: 1.8 }}>
          5 خطوات بسيطة تفصلك عن إتمام عملية التحويل بأمان وسرعة
        </p>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 64, position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', top: 40, bottom: 40, right: 28, width: 2, background: 'linear-gradient(180deg, var(--cyan), transparent)', opacity: 0.18, zIndex: 0 }} />

        {STEPS.map((step, i) => (
          <div key={step.num} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '20px 0', position: 'relative', zIndex: 1 }}>
            {/* Number circle */}
            <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: '50%', border: `2px solid ${step.color}`, background: `${step.color}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${step.color}25` }}>
              <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
            </div>
            {/* Content */}
            <div style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 16, padding: '18px 22px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = step.color + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-1)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', color: step.color, letterSpacing: 1 }}>STEP {step.num}</span>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Tajawal',sans-serif" }}>{step.title}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-3)', lineHeight: 1.75, fontFamily: "'Tajawal',sans-serif" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment methods */}
      <div style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 24px', letterSpacing: 1 }}>
          طرق الدفع المقبولة
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {METHODS.map(m => (
            <div key={m.name} style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 14, padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontFamily: "'Tajawal',sans-serif", fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9rem', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 8 }}>{m.desc}</div>
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 6, background: `${m.color}20`, color: m.color, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>{m.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini FAQ */}
      <div>
        <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', margin: '0 0 20px', letterSpacing: 1 }}>
          أسئلة سريعة
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS_MINI.map(f => (
            <div key={f.q} style={{ background: 'var(--card)', border: '1px solid var(--border-1)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Tajawal',sans-serif", fontSize: '0.9rem', marginBottom: 6 }}>❓ {f.q}</div>
              <div style={{ color: 'var(--text-3)', fontFamily: "'Tajawal',sans-serif", fontSize: '0.84rem', lineHeight: 1.7 }}>← {f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}