// src/pages/OrderTrack.jsx
import { useState, useEffect } from 'react'

// Demo orders for testing
const DEMO_ORDERS = {
  'N1-2025-001': { id:'N1-2025-001', status:'completed',  amount:'500 USDT', receive:'MoneyGo USD', created:'2025-03-20 14:32', updated:'2025-03-20 14:47', steps: [true,true,true,true] },
  'N1-2025-002': { id:'N1-2025-002', status:'processing', amount:'200 USDT', receive:'فودافون كاش', created:'2025-03-26 10:05', updated:'2025-03-26 10:18', steps: [true,true,true,false] },
  'N1-2025-003': { id:'N1-2025-003', status:'pending',    amount:'150 USDT', receive:'إنستاباي',    created:'2025-03-26 11:50', updated:'2025-03-26 11:50', steps: [true,false,false,false] },
}

const STATUS_CONFIG = {
  pending:    { label:'في الانتظار',    color:'#f59e0b', icon:'⏳', desc:'في انتظار استلام دفعتك' },
  reviewing:  { label:'قيد المراجعة',  color:'#a78bfa', icon:'🔍', desc:'يراجع الفريق طلبك' },
  processing: { label:'قيد المعالجة',  color:'#00b8d9', icon:'⚡', desc:'جاري إرسال المبلغ' },
  completed:  { label:'مكتمل',         color:'#00e5a0', icon:'✅', desc:'تم إرسال المبلغ بنجاح' },
  failed:     { label:'فشل',           color:'#f43f5e', icon:'❌', desc:'حدث خطأ، تواصل مع الدعم' },
}

const TRACK_STEPS = ['استلام الدفعة', 'مراجعة الطلب', 'معالجة التحويل', 'اكتمال الإرسال']

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, background: cfg.color + '18', border:`1px solid ${cfg.color}40`, fontSize:'0.8rem', fontFamily:"'Tajawal',sans-serif", fontWeight:700, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

function ProgressTracker({ steps }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginTop:24 }}>
      {TRACK_STEPS.map((label, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', flex: i < TRACK_STEPS.length-1 ? 1 : 'unset' }}>
          {/* Circle */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flexShrink:0 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background: steps[i] ? 'var(--cyan)' : 'var(--border-1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', color: steps[i] ? '#000' : 'var(--text-3)', fontWeight:700, transition:'all 0.3s', boxShadow: steps[i] ? '0 0 14px rgba(0,212,255,0.5)' : 'none' }}>
              {steps[i] ? '✓' : i+1}
            </div>
            <span style={{ fontSize:'0.65rem', color: steps[i] ? 'var(--cyan)' : 'var(--text-3)', fontFamily:"'Tajawal',sans-serif", textAlign:'center', whiteSpace:'nowrap', maxWidth:70, lineHeight:1.3 }}>{label}</span>
          </div>
          {/* Line between circles */}
          {i < TRACK_STEPS.length-1 && (
            <div style={{ flex:1, height:2, background: steps[i] && steps[i+1] ? 'var(--cyan)' : 'var(--border-1)', margin:'0 4px', marginBottom:22, transition:'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrderTrack() {
  const [orderId, setOrderId] = useState('')
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Read ?id= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) { setOrderId(id); doSearch(id) }
  }, [])

  const doSearch = (id) => {
    const clean = (id || orderId).trim().toUpperCase()
    setLoading(true); setResult(null); setNotFound(false)
    setTimeout(() => {
      setLoading(false)
      if (DEMO_ORDERS[clean]) { setResult(DEMO_ORDERS[clean]) }
      else { setNotFound(true) }
    }, 900)
  }

  const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.pending) : null

  return (
    <div style={{ minHeight: '80vh', padding: '60px 24px', maxWidth: 700, margin: '0 auto', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:48 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:20, border:'1px solid rgba(0,212,255,0.3)', background:'rgba(0,212,255,0.06)', marginBottom:20 }}>
          <span style={{ fontSize:'0.7rem', color:'var(--cyan)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:2 }}>ORDER TRACKING</span>
        </div>
        <h1 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:900, color:'var(--text-1)', margin:'0 0 16px' }}>
          تتبع طلبك
        </h1>
        <p style={{ fontSize:'1rem', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", lineHeight:1.8, maxWidth:380, margin:'0 auto' }}>
          أدخل رقم طلبك لمعرفة الحالة الحالية
        </p>
      </div>

      {/* Search box */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:20, padding:'28px 24px', marginBottom:28 }}>
        <label style={{ display:'block', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:10, letterSpacing:1 }}>رقم الطلب</label>
        <div style={{ display:'flex', gap:10 }}>
          <input value={orderId} onChange={e => setOrderId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="N1-2025-XXXX"
            style={{ flex:1, padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--border-1)', borderRadius:11, color:'var(--text-1)', fontFamily:"'JetBrains Mono',monospace", fontSize:'1rem', outline:'none', direction:'ltr', letterSpacing:1 }}
            onFocus={e => e.target.style.borderColor='var(--cyan)'}
            onBlur={e => e.target.style.borderColor='var(--border-1)'} />
          <button onClick={() => doSearch()} disabled={!orderId.trim() || loading}
            style={{ padding:'12px 24px', background:'linear-gradient(135deg,#009fc0,#006e9e)', border:'none', borderRadius:11, color:'#fff', fontFamily:"'Tajawal',sans-serif", fontSize:'0.95rem', fontWeight:700, cursor:'pointer', opacity: !orderId.trim() ? 0.5 : 1, transition:'opacity 0.2s' }}>
            {loading ? '⏳' : 'بحث'}
          </button>
        </div>
        <p style={{ margin:'10px 0 0', fontSize:'0.72rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace" }}>
          للتجربة: N1-2025-001 / N1-2025-002 / N1-2025-003
        </p>
      </div>

      {/* Not found */}
      {notFound && (
        <div style={{ textAlign:'center', padding:'32px', background:'var(--card)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:16 }}>
          <div style={{ fontSize:'2rem', marginBottom:12 }}>🔍</div>
          <h3 style={{ fontFamily:"'Tajawal',sans-serif", color:'var(--text-1)', margin:'0 0 8px' }}>الطلب غير موجود</h3>
          <p style={{ color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif", fontSize:'0.86rem' }}>تأكد من رقم الطلب أو تواصل مع <a href="/contact" style={{ color:'var(--cyan)' }}>الدعم</a></p>
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div style={{ background:'var(--card)', border:`1px solid ${cfg.color}40`, borderRadius:20, padding:'28px 24px' }}>
          {/* Order header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>ORDER ID</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.1rem', fontWeight:700, color:'var(--text-1)' }}>{result.id}</div>
            </div>
            <StatusBadge status={result.status} />
          </div>

          {/* Progress tracker */}
          <ProgressTracker steps={result.steps} />

          {/* Details */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:24 }}>
            {[
              { label:'المبلغ المرسل', value: result.amount },
              { label:'طريقة الاستقبال', value: result.receive },
              { label:'تاريخ الطلب', value: result.created },
              { label:'آخر تحديث', value: result.updated },
            ].map(d => (
              <div key={d.label} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid var(--border-1)', borderRadius:10, padding:'12px 14px' }}>
                <div style={{ fontSize:'0.68rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", marginBottom:4, letterSpacing:1 }}>{d.label}</div>
                <div style={{ fontFamily:"'Tajawal',sans-serif", fontWeight:700, color:'var(--text-1)', fontSize:'0.9rem' }}>{d.value}</div>
              </div>
            ))}
          </div>

          {/* Status message */}
          <div style={{ marginTop:18, padding:'12px 16px', borderRadius:12, background: cfg.color + '10', border:`1px solid ${cfg.color}25` }}>
            <span style={{ fontSize:'0.85rem', color: cfg.color, fontFamily:"'Tajawal',sans-serif" }}>{cfg.icon} {cfg.desc}</span>
          </div>

          {/* Contact if pending/issue */}
          {result.status !== 'completed' && (
            <p style={{ margin:'16px 0 0', textAlign:'center', fontSize:'0.8rem', color:'var(--text-3)', fontFamily:"'Tajawal',sans-serif" }}>
              هل تحتاج مساعدة؟ <a href="/contact" style={{ color:'var(--cyan)', textDecoration:'none' }}>تواصل مع الدعم</a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}