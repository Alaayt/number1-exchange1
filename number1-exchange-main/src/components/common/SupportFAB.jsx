// src/components/common/SupportFAB.jsx — Cute Bot v3 + FAQ toggle
import { useState, useRef, useEffect, useCallback } from 'react'
import useLang from '../../context/useLang'

const WA_NUMBER = '9647XXXXXXXXX'
const TG_USER   = 'Number1Exchange'

const BOT_QS = {
  ar: [
    { id:'q1', text:'كيف أبدأ عملية التبادل؟' },
    { id:'q2', text:'ما هي الرسوم؟' },
    { id:'q3', text:'كم يستغرق التحويل؟' },
    { id:'q4', text:'هل بياناتي آمنة؟' },
    { id:'q5', text:'ما هي العملات المدعومة؟' },
  ],
  en: [
    { id:'q1', text:'How do I start an exchange?' },
    { id:'q2', text:'What are the fees?' },
    { id:'q3', text:'How long does it take?' },
    { id:'q4', text:'Is my data safe?' },
    { id:'q5', text:'Which currencies are supported?' },
  ],
}

const BOT_ANS = {
  ar: {
    q1:'اختر العملة التي تريد إرسالها، أدخل المبلغ، ثم أدخل بيانات المحفظة والبريد الإلكتروني واضغط **"إرسال طلب التبادل"**.',
    q2:'رسومنا تبدأ من **0.1% فقط** — من أقل الرسوم في السوق مع أفضل أسعار الصرف المتاحة.',
    q3:'معظم العمليات تتم خلال **1 إلى 5 دقائق** بعد تأكيد التحويل من طرفك.',
    q4:'نعم! نستخدم تشفير **AES-256** مع حماية متعددة الطبقات. بياناتك محمية بأعلى معايير الأمان.',
    q5:'ندعم: **فودافون كاش، إنستا باي، اتصالات كاش** ↔ **USDT TRC20 وMoneyGo USD**.',
  },
  en: {
    q1:'Choose the currency to send, enter the amount, fill in wallet details and email, then click **"Submit Exchange Request"**.',
    q2:'Our fees start from just **0.1%** — among the lowest in the market.',
    q3:'Most operations complete within **1 to 5 minutes** after you confirm.',
    q4:'Yes! We use **AES-256** encryption with multi-layer protection.',
    q5:'We support: **Vodafone Cash, Instapay, Etisalat Cash** ↔ **USDT TRC20 and MoneyGo USD**.',
  },
}

/* ─── CSS ─────────────────────────────────────────── */
const FAB_CSS = `
@keyframes n1Pulse{0%,100%{box-shadow:0 0 0 0 rgba(93,188,255,.7)}70%{box-shadow:0 0 0 16px rgba(93,188,255,0)}}
@keyframes n1Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes n1SlideUp{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
@keyframes n1MsgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes n1Dot{0%,80%,100%{transform:scale(.4);opacity:.25}40%{transform:scale(1);opacity:1}}
@keyframes n1BotIdle{0%,100%{transform:translateY(0) rotate(0deg)}38%{transform:translateY(-5px) rotate(-3deg)}72%{transform:translateY(-2px) rotate(2.5deg)}}
@keyframes n1BotWave{0%{transform:rotate(0) scale(1)}18%{transform:rotate(-22deg) scale(1.12)}42%{transform:rotate(14deg) scale(1.06)}62%{transform:rotate(-12deg) scale(1.09)}82%{transform:rotate(8deg) scale(1.04)}100%{transform:rotate(0) scale(1)}}
@keyframes n1BotTalk{0%,100%{transform:scale(1)}50%{transform:scale(1.05) translateY(-2px)}}
@keyframes n1Glow{0%,100%{opacity:.28;transform:translateX(-50%) scaleX(1)}50%{opacity:.75;transform:translateX(-50%) scaleX(1.4)}}
@keyframes n1Tip{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
@keyframes n1FaqIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes n1Beat{0%,100%{transform:scale(1)}30%{transform:scale(1.28)}55%{transform:scale(.9)}75%{transform:scale(1.12)}}
@keyframes n1Twinkle{0%,100%{opacity:.2;transform:scale(.5)}50%{opacity:1;transform:scale(1)}}

.n1sb::-webkit-scrollbar{width:3px}
.n1sb::-webkit-scrollbar-thumb{background:rgba(93,188,255,.18);border-radius:3px}
.n1sb{scrollbar-width:thin;scrollbar-color:rgba(93,188,255,.18) transparent}
`

/* ─── Cute round robot ─────────────────────────────────── */
function Bot({ size = 52, anim = 'idle', glow = true }) {
  const anims = {
    idle:    'n1BotIdle 3.2s ease-in-out infinite',
    wave:    'n1BotWave .8s ease-in-out 2',
    blink:   'n1BotIdle .4s ease-in-out 1',
    talking: 'n1BotTalk .55s ease-in-out infinite',
  }
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 80 80"
        style={{ animation:anims[anim]||anims.idle, transformOrigin:'center 90%',
                 filter:'drop-shadow(0 4px 12px rgba(93,188,255,.55))' }}>

        {/* ── sparkles ── */}
        <circle cx="10" cy="14" r="2.2" fill="#fde68a" style={{animation:'n1Twinkle 2.2s .0s infinite'}}/>
        <circle cx="70" cy="18" r="1.6" fill="#fde68a" style={{animation:'n1Twinkle 2.8s .5s infinite'}}/>
        <circle cx="8"  cy="52" r="1.4" fill="#bae6fd" style={{animation:'n1Twinkle 3.0s 1s infinite'}}/>
        <circle cx="72" cy="55" r="1.2" fill="#bae6fd" style={{animation:'n1Twinkle 2.5s .8s infinite'}}/>

        {/* ── antenna ── */}
        <line x1="40" y1="11" x2="40" y2="4"  stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="40" cy="3.5" r="3.5" fill="#38bdf8"/>
        <circle cx="40" cy="3.5" r="1.8" fill="#fff" opacity=".6"/>

        {/* ── head — very round friendly ── */}
        <rect x="10" y="12" width="60" height="38" rx="22" fill="#dbeafe"/>
        {/* subtle top sheen */}
        <rect x="10" y="12" width="60" height="18" rx="22" fill="rgba(255,255,255,0.38)"/>

        {/* ── cheeks ── */}
        <ellipse cx="18" cy="44" rx="5.5" ry="3.5" fill="#fca5a5" opacity=".55"/>
        <ellipse cx="62" cy="44" rx="5.5" ry="3.5" fill="#fca5a5" opacity=".55"/>

        {/* ── eye whites ── */}
        <ellipse cx="30" cy="30" rx="9"   ry="9.5" fill="#fff"/>
        <ellipse cx="50" cy="30" rx="9"   ry="9.5" fill="#fff"/>
        {/* irises */}
        <ellipse cx="30" cy="31" rx="6"   ry="6.5" fill="#38bdf8"/>
        <ellipse cx="50" cy="31" rx="6"   ry="6.5" fill="#38bdf8"/>
        {/* pupils */}
        <circle  cx="30" cy="31" r="3.2"  fill="#1e3a5f"/>
        <circle  cx="50" cy="31" r="3.2"  fill="#1e3a5f"/>
        {/* sparkle in eyes */}
        <circle  cx="32" cy="28.5" r="1.7" fill="#fff" opacity=".92"/>
        <circle  cx="52" cy="28.5" r="1.7" fill="#fff" opacity=".92"/>
        <circle  cx="28.5" cy="32.5" r=".8" fill="#fff" opacity=".5"/>
        <circle  cx="48.5" cy="32.5" r=".8" fill="#fff" opacity=".5"/>

        {/* ── smile ── */}
        <path d="M26 45 Q40 55 54 45" stroke="#38bdf8" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        {/* tiny teeth */}
        <path d="M30 48 Q40 53 50 48" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity=".7"/>

        {/* ── ears ── */}
        <ellipse cx="10" cy="32" rx="5"   ry="6.5" fill="#bfdbfe"/>
        <ellipse cx="70" cy="32" rx="5"   ry="6.5" fill="#bfdbfe"/>
        <ellipse cx="10" cy="32" rx="2.8" ry="3.8" fill="#93c5fd"/>
        <ellipse cx="70" cy="32" rx="2.8" ry="3.8" fill="#93c5fd"/>

        {/* ── body ── */}
        <rect x="20" y="52" width="40" height="26" rx="13" fill="#bfdbfe"/>
        {/* belly */}
        <ellipse cx="40" cy="64" rx="11" ry="7.5" fill="#fff" opacity=".5"/>
        {/* heart */}
        <path d="M37 63 C37 61.2 34.5 59.5 34.5 62 C34.5 63.8 37 66.2 37 66.2 C37 66.2 39.5 63.8 39.5 62 C39.5 59.5 37 61.2 37 63Z"
          fill="#f87171" opacity=".9" style={{animation:'n1Beat 1.6s ease-in-out infinite'}}/>
        {/* dots */}
        <circle cx="43.5" cy="63" r="1.5" fill="#38bdf8" opacity=".75"/>
        <circle cx="47"   cy="63" r="1.5" fill="#38bdf8" opacity=".55"/>

        {/* ── arms ── */}
        <rect x="5"  y="53" width="14" height="18" rx="7" fill="#bfdbfe"/>
        <rect x="61" y="53" width="14" height="18" rx="7" fill="#bfdbfe"/>
        {/* paws */}
        <ellipse cx="12"  cy="73" rx="6.5" ry="4"   fill="#93c5fd"/>
        <ellipse cx="68"  cy="73" rx="6.5" ry="4"   fill="#93c5fd"/>
      </svg>
      {glow && (
        <div style={{
          position:'absolute', bottom:-7, left:'50%',
          width:size*.72, height:8,
          background:'radial-gradient(ellipse,rgba(93,188,255,.45),transparent 70%)',
          borderRadius:'50%', filter:'blur(4px)',
          animation:'n1Glow 2s ease-in-out infinite',
          transform:'translateX(-50%)',
        }}/>
      )}
    </div>
  )
}

/* ─── Typing dots ─────────────────────────────────────── */
function Dots() {
  return (
    <div style={{ display:'flex', gap:5, padding:'5px 2px', alignItems:'center' }}>
      {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#5dbcff', animation:`n1Dot 1s ease-in-out ${i*.16}s infinite` }}/>)}
    </div>
  )
}

/* ─── Message bubble ──────────────────────────────────── */
function Msg({ text, isUser, time, anim }) {
  const html = (text||'')
    .replace(/\*\*(.*?)\*\*/g,'<strong style="color:#38bdf8">$1</strong>')
    .replace(/\n/g,'<br/>')
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, justifyContent:isUser?'flex-start':'flex-end', marginBottom:10, animation:'n1MsgIn .2s ease' }}>
      {!isUser && <Bot size={28} anim={anim||'idle'} glow={false}/>}
      <div style={{
        maxWidth:'76%', padding:'10px 13px',
        borderRadius:isUser?'16px 4px 16px 16px':'4px 16px 16px 16px',
        background:isUser
          ? 'linear-gradient(135deg,rgba(56,189,248,.15),rgba(14,116,168,.2))'
          : 'var(--card)',
        border:`1px solid ${isUser?'rgba(56,189,248,.28)':'var(--border-1)'}`,
        fontSize:'.83rem', color:'var(--text-1)', lineHeight:1.65, direction:'rtl',
      }}>
        <div dangerouslySetInnerHTML={{ __html:html }}/>
        {time && <div style={{ fontSize:'.57rem', color:'var(--text-3)', marginTop:4, fontFamily:"'JetBrains Mono',monospace", textAlign:isUser?'right':'left' }}>{time}</div>}
      </div>
    </div>
  )
}

/* ─── Support links ───────────────────────────────────── */
function SupportLinks({ ar }) {
  const items = [
    { href:`https://wa.me/${WA_NUMBER}`, bg:'rgba(37,211,102,.09)', border:'rgba(37,211,102,.35)', iconBg:'#25d366', col:'#25d366', name:ar?'واتساب':'WhatsApp', sub:ar?'تواصل فوري · 24/7':'Instant chat · 24/7',
      icon:<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.05 2C6.495 2 2 6.495 2 12.05c0 1.86.484 3.61 1.332 5.131L2 22l4.948-1.298A9.953 9.953 0 0012.05 22C17.605 22 22 17.505 22 11.95 22 6.495 17.505 2 12.05 2zm0 18.1a8.048 8.048 0 01-4.104-1.126l-.294-.175-3.056.802.817-2.977-.192-.306A8.053 8.053 0 013.9 11.95C3.9 7.54 7.54 3.9 12.05 3.9c4.41 0 8.05 3.64 8.05 8.05 0 4.41-3.64 8.15-8.05 8.15z"/></svg>},
    { href:`https://t.me/${TG_USER}`, bg:'rgba(0,136,204,.09)', border:'rgba(0,136,204,.35)', iconBg:'#0088cc', col:'#0088cc', name:ar?'تيليجرام':'Telegram', sub:`@${TG_USER}`,
      icon:<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>},
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:9, animation:'n1MsgIn .3s ease' }}>
      <div style={{ fontSize:'.62rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", textAlign:'center', letterSpacing:1, marginBottom:2 }}>
        {ar?'— تواصل مع الفريق مباشرة —':'— Direct team contact —'}
      </div>
      {items.map((l,i) => (
        <a key={i} href={l.href} target="_blank" rel="noreferrer"
          style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 13px', borderRadius:14, background:l.bg, border:`1px solid ${l.border}`, textDecoration:'none', transition:'all .2s' }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 6px 18px ${l.col}22`}}
          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
          <div style={{ width:40, height:40, borderRadius:12, background:l.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 3px 12px ${l.col}44` }}>{l.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, fontSize:'.87rem', color:l.col }}>{l.name}</div>
            <div style={{ fontSize:'.69rem', color:'var(--text-3)', marginTop:2, fontFamily:"'JetBrains Mono',monospace" }}>{l.sub}</div>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={l.col} strokeWidth="2.5" strokeLinecap="round" style={{opacity:.5}}><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      ))}
    </div>
  )
}

/* ─── FAQ dropdown ────────────────────────────────────── */
function FaqDropdown({ qs, onPick, ar }) {
  return (
    <div style={{
      borderTop:'1px solid var(--border-1)',
      background:'var(--card)',
      padding:'10px 11px',
      display:'flex', flexDirection:'column', gap:5,
      animation:'n1FaqIn .18s ease',
    }}>
      <div style={{ fontSize:'.6rem', color:'var(--text-3)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.2, marginBottom:2, paddingRight:2 }}>
        {ar?'— أسئلة شائعة —':'— Frequently Asked —'}
      </div>
      {qs.map((q,i) => (
        <button key={q.id} onClick={()=>onPick(q.id, q.text)}
          style={{ padding:'8px 11px', borderRadius:9, background:'var(--cyan-dim)', border:'1px solid var(--border-1)', color:'var(--text-1)', fontSize:'.8rem', cursor:'pointer', textAlign:'right', fontFamily:"'Tajawal',sans-serif", transition:'all .16s', display:'flex', alignItems:'center', gap:7 }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(56,189,248,.14)';e.currentTarget.style.borderColor='rgba(56,189,248,.35)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='var(--cyan-dim)';e.currentTarget.style.borderColor='var(--border-1)'}}>
          <span style={{ color:'#5dbcff', fontSize:'.66rem', fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>?</span>
          {q.text}
        </button>
      ))}
    </div>
  )
}

/* ─── Chat Panel ──────────────────────────────────────── */
function Panel({ onClose, lang }) {
  const ar  = lang === 'ar'
  const qs  = BOT_QS[ar?'ar':'en']

  const [tab,      setTab]      = useState('chat')
  const [messages, setMessages] = useState([])
  const [showSup,  setShowSup]  = useState(false)
  const [typing,   setTyping]   = useState(false)
  const [input,    setInput]    = useState('')
  const [botAnim,  setBotAnim]  = useState('idle')
  const [greeted,  setGreeted]  = useState(false)
  const [faqOpen,  setFaqOpen]  = useState(false)   // ← FAQ optional toggle

  const bottomRef = useRef(null)

  const now = () => { const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }
  const addMsg = useCallback((text,isUser,anim)=>{
    setMessages(p=>[...p,{id:Date.now()+Math.random(),text,isUser,time:now(),anim}])
  },[])

  // Greeting — no auto-show opts
  useEffect(()=>{
    if(greeted||tab!=='chat') return
    setGreeted(true); setBotAnim('wave'); setTyping(true)
    setTimeout(()=>{
      setTyping(false)
      addMsg(
        ar ? 'أهلاً! أنا **N1-BOT** مساعدك الذكي ✦\nكيف أقدر أساعدك اليوم؟'
           : 'Hey there! I\'m **N1-BOT** your friendly assistant ✦\nHow can I help you today?',
        false, 'wave'
      )
      setTimeout(()=>setBotAnim('idle'), 700)
    }, 1000)
  },[tab])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[messages,typing,showSup,faqOpen])

  // Random blink
  useEffect(()=>{
    const t = setInterval(()=>{
      if(botAnim==='idle'){ setBotAnim('blink'); setTimeout(()=>setBotAnim('idle'),380) }
    }, 4500+Math.random()*3000)
    return ()=>clearInterval(t)
  },[botAnim])

  const pickFaq=(id,text)=>{
    setFaqOpen(false); setShowSup(false); addMsg(text,true)
    setTyping(true); setBotAnim('talking')
    setTimeout(()=>{
      setTyping(false); setBotAnim('idle')
      addMsg(BOT_ANS[ar?'ar':'en'][id], false, 'idle')
      setTimeout(()=> addMsg(ar?'هل هناك شيء آخر؟':'Anything else I can help with?', false, 'blink'), 600)
    }, 900+Math.random()*400)
  }

  const sendFree=()=>{
    if(!input.trim()) return
    const txt=input.trim(); setInput(''); setFaqOpen(false); setShowSup(false)
    addMsg(txt,true); setTyping(true); setBotAnim('talking')
    setTimeout(()=>{
      setTyping(false); setBotAnim('wave')
      addMsg(ar?'شكراً! تواصل مع فريق الدعم مباشرة:':'Thanks! Contact support directly:', false,'wave')
      setTimeout(()=>{ setShowSup(true); setBotAnim('idle') }, 300)
    }, 900)
  }

  const TABS=[
    { id:'chat',    ar:'المساعد الذكي', en:'AI Chat',
      icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>},
    { id:'support', ar:'الدعم المباشر',  en:'Live Support',
      icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>},
  ]

  return (
    <div style={{ position:'fixed', bottom:92, left:22, zIndex:500, width:350, maxHeight:560, background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:22, overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(93,188,255,.07)', display:'flex', flexDirection:'column', animation:'n1SlideUp .26s cubic-bezier(.22,1,.36,1)' }}>

      {/* top accent */}
      <div style={{ position:'absolute', top:0, left:16, right:16, height:2, background:'linear-gradient(90deg,transparent,#5dbcff 40%,#a78bfa,transparent)', borderRadius:2, zIndex:1 }}/>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0f2744,#091830)', padding:'13px 15px', display:'flex', alignItems:'center', gap:11, flexShrink:0, position:'relative', overflow:'hidden' }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ position:'absolute', width:3, height:3, borderRadius:'50%', background:'rgba(93,188,255,.45)', left:`${18+i*22}%`, bottom:0, animation:`n1Float ${1.5+i*.3}s ease-out ${i*.2}s infinite`, pointerEvents:'none' }}/>
        ))}
        <Bot size={50} anim={botAnim} glow/>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:900, fontSize:'.9rem', color:'#e8f4ff', letterSpacing:.4, fontFamily:"'Orbitron',sans-serif" }}>N1-BOT</div>
          <div style={{ fontSize:'.64rem', color:'rgba(200,225,255,.65)', display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#86efac', boxShadow:'0 0 5px #86efac', flexShrink:0 }}/>
            {ar?'مساعدك الذكي · 24/7':'Your smart assistant · 24/7'}
          </div>
        </div>
        <button onClick={onClose}
          style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(200,220,255,.5)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .17s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,90,90,.18)';e.currentTarget.style.color='#ff7070'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.07)';e.currentTarget.style.color='rgba(200,220,255,.5)'}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'var(--cyan-dim)', borderBottom:'1px solid var(--border-1)', flexShrink:0 }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:1, padding:'9px 0', background:'transparent', border:'none', borderBottom:`2px solid ${tab===t.id?'#5dbcff':'transparent'}`, color:tab===t.id?'#5dbcff':'var(--text-3)', cursor:'pointer', fontSize:'.76rem', fontWeight:700, fontFamily:"'Tajawal',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all .18s' }}>
            {t.icon}{ar?t.ar:t.en}
          </button>
        ))}
      </div>

      {/* Chat tab */}
      {tab==='chat' && (
        <>
          <div className="n1sb" style={{ flex:1, overflowY:'auto', padding:'14px 12px 8px', display:'flex', flexDirection:'column', minHeight:0, background:'var(--bg)' }}>
            {messages.map(m=><Msg key={m.id} {...m}/>)}

            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8, justifyContent:'flex-end', marginBottom:10, animation:'n1MsgIn .2s ease' }}>
                <Bot size={28} anim="talking" glow={false}/>
                <div style={{ padding:'10px 13px', borderRadius:'4px 16px 16px 16px', background:'var(--card)', border:'1px solid var(--border-1)' }}><Dots/></div>
              </div>
            )}

            {showSup && !typing && (
              <div style={{ marginBottom:10 }}>
                <SupportLinks ar={ar}/>
                <button onClick={()=>setShowSup(false)}
                  style={{ marginTop:8, width:'100%', padding:'7px', background:'transparent', border:'1px solid var(--border-1)', borderRadius:9, color:'var(--text-3)', fontSize:'.75rem', cursor:'pointer', fontFamily:"'Tajawal',sans-serif" }}>
                  {ar?'← رجوع':'← Back'}
                </button>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* FAQ dropdown — shows ONLY when faqOpen */}
          {faqOpen && <FaqDropdown qs={qs} onPick={pickFaq} ar={ar}/>}

          {/* Input bar */}
          <div style={{ padding:'9px 11px', borderTop:'1px solid var(--border-1)', background:'var(--card)', flexShrink:0, display:'flex', gap:6, alignItems:'center' }}>

            {/* ← FAQ toggle button (small, optional) */}
            <button
              onClick={()=>setFaqOpen(v=>!v)}
              title={ar?'أسئلة شائعة':'FAQ'}
              style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:faqOpen?'rgba(93,188,255,.18)':'var(--cyan-dim)', border:`1px solid ${faqOpen?'rgba(93,188,255,.45)':'var(--border-1)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .17s', color:faqOpen?'#5dbcff':'var(--text-3)' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(93,188,255,.14)';e.currentTarget.style.color='#5dbcff'}}
              onMouseLeave={e=>{ if(!faqOpen){e.currentTarget.style.background='var(--cyan-dim)';e.currentTarget.style.color='var(--text-3)'} }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>

            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&sendFree()}
              onFocus={()=>setFaqOpen(false)}
              placeholder={ar?'اكتب رسالتك...':'Type your message...'}
              style={{ flex:1, padding:'9px 12px', background:'var(--cyan-dim)', border:'1px solid var(--border-1)', borderRadius:11, color:'var(--text-1)', fontSize:'.84rem', outline:'none', fontFamily:"'Tajawal',sans-serif", direction:ar?'rtl':'ltr', transition:'border-color .18s' }}
              onFocus={e=>{ e.target.style.borderColor='rgba(93,188,255,.4)'; setFaqOpen(false) }}
              onBlur={e=>e.target.style.borderColor='var(--border-1)'}/>

            <button onClick={sendFree}
              style={{ width:34, height:34, borderRadius:11, background:'linear-gradient(135deg,#38bdf8,#0284c7)', border:'none', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s', boxShadow:'0 3px 10px rgba(56,189,248,.35)' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.1)';e.currentTarget.style.boxShadow='0 5px 18px rgba(56,189,248,.55)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 3px 10px rgba(56,189,248,.35)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </>
      )}

      {/* Support tab */}
      {tab==='support' && (
        <div style={{ flex:1, padding:'20px 14px', overflowY:'auto', background:'var(--bg)' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
              <Bot size={58} anim="wave" glow/>
            </div>
            <div style={{ fontWeight:800, fontSize:'.9rem', color:'var(--text-1)', marginBottom:4 }}>
              {ar?'فريق الدعم البشري':'Human Support Team'}
            </div>
            <div style={{ fontSize:'.73rem', color:'var(--text-3)', lineHeight:1.65, maxWidth:220, margin:'0 auto' }}>
              {ar?'فريقنا جاهز للمساعدة على مدار الساعة':'Our team is ready to help 24/7'}
            </div>
          </div>
          <SupportLinks ar={ar}/>
          <div style={{ marginTop:14, padding:'10px 12px', borderRadius:11, background:'var(--cyan-dim)', border:'1px solid var(--border-1)', display:'flex', alignItems:'center', gap:9 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div style={{ fontSize:'.72rem', color:'var(--text-2)' }}>
              {ar?'متوسط وقت الرد: أقل من 5 دقائق':'Avg response time: under 5 minutes'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── FAB button ──────────────────────────────────────── */
export default function SupportFAB() {
  const { lang } = useLang()
  const ar = lang === 'ar'
  const [open,    setOpen]    = useState(false)
  const [unread,  setUnread]  = useState(1)
  const [tooltip, setTooltip] = useState(true)

  useEffect(()=>{ const t=setTimeout(()=>setTooltip(false),5000); return()=>clearTimeout(t) },[])

  const toggle=()=>{ setOpen(o=>!o); setUnread(0); setTooltip(false) }

  return (
    <>
      <style>{FAB_CSS}</style>

      {/* tooltip bubble */}
      {!open && tooltip && (
        <div style={{ position:'fixed', bottom:100, left:24, zIndex:499, background:'var(--card)', border:'1px solid var(--border-1)', borderRadius:14, padding:'9px 13px', fontSize:'.79rem', color:'var(--text-1)', whiteSpace:'nowrap', boxShadow:'0 6px 24px rgba(0,0,0,.4)', animation:'n1Tip .3s ease', display:'flex', alignItems:'center', gap:8 }}>
          <Bot size={26} anim="wave" glow={false}/>
          <span>{ar?'مرحباً! كيف أقدر أساعدك؟':'Hello! How can I help?'}</span>
        </div>
      )}

      {open && <Panel onClose={toggle} lang={lang}/>}

      {/* FAB */}
      <div style={{ position:'fixed', bottom:24, left:22, zIndex:500 }}>
        <button onClick={toggle} style={{
          width:60, height:60, borderRadius:'50%',
          background:open?'linear-gradient(135deg,#ff6b8a,#c0003a)':'linear-gradient(135deg,#38bdf8,#0369a1)',
          border:'2.5px solid rgba(255,255,255,.2)',
          cursor:'pointer', padding:0,
          boxShadow:open?'0 6px 22px rgba(255,90,120,.55)':'0 6px 22px rgba(56,189,248,.55)',
          animation:!open?'n1Pulse 2.5s infinite':'none',
          transition:'background .28s, box-shadow .28s',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          {open
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <div style={{ animation:'n1Float 2.8s ease-in-out infinite' }}><Bot size={48} anim="idle" glow={false}/></div>
          }
          {!open && unread>0 && (
            <div style={{ position:'absolute', top:-2, right:-2, width:19, height:19, borderRadius:'50%', background:'#f43f5e', color:'#fff', fontSize:'.6rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid var(--bg)', fontFamily:"'JetBrains Mono',monospace" }}>{unread}</div>
          )}
        </button>
      </div>
    </>
  )
}
