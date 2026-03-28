// src/pages/admin/AdminPaymentMethods.jsx
// =============================================
// وسائل الدفع — الأدمن يتحكم في:
//   1. عنوان USDT (TRC20)
//   2. أرقام استلام المحافظ المصرية
//   3. تفعيل/إيقاف كل وسيلة
// =============================================

import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'

// ── Config الوسائل ────────────────────────────────────────
// key  = اسم الحقل في قاعدة البيانات
// هذا الترتيب هو نفسه الذي يظهر للمستخدم
const METHODS = [
  {
    key:         'vodafone',
    label:       'Vodafone Cash',
    icon:        '📱',
    color:       '#ef4444',
    bg:          'rgba(239,68,68,0.08)',
    border:      'rgba(239,68,68,0.2)',
    placeholder: '01XXXXXXXXX',
    fieldLabel:  'رقم Vodafone Cash للاستلام',
    desc:        'المستخدم يحوّل على هذا الرقم',
  },
  {
    key:         'orange',
    label:       'Orange Cash',
    icon:        '🟠',
    color:       '#f97316',
    bg:          'rgba(249,115,22,0.08)',
    border:      'rgba(249,115,22,0.2)',
    placeholder: '01XXXXXXXXX',
    fieldLabel:  'رقم Orange Cash للاستلام',
    desc:        'المستخدم يحوّل على هذا الرقم',
  },
  {
    key:         'instapay',
    label:       'InstaPay',
    icon:        '⚡',
    color:       '#8b5cf6',
    bg:          'rgba(139,92,246,0.08)',
    border:      'rgba(139,92,246,0.2)',
    placeholder: 'اسم المستخدم أو رقم الهاتف',
    fieldLabel:  'معرّف InstaPay',
    desc:        'اسم المستخدم أو رقم الهاتف المرتبط بـ InstaPay',
  },
  {
    key:         'fawry',
    label:       'Fawry',
    icon:        '🏪',
    color:       '#f59e0b',
    bg:          'rgba(245,158,11,0.08)',
    border:      'rgba(245,158,11,0.2)',
    placeholder: 'رقم Fawry',
    fieldLabel:  'رقم Fawry للاستلام',
    desc:        'رقم المستخدم على منصة Fawry',
  },
  {
    key:         'wepay',
    label:       'WE Pay',
    icon:        '📡',
    color:       '#06b6d4',
    bg:          'rgba(6,182,212,0.08)',
    border:      'rgba(6,182,212,0.2)',
    placeholder: '01XXXXXXXXX',
    fieldLabel:  'رقم WE Pay للاستلام',
    desc:        'المستخدم يحوّل على هذا الرقم',
  },
  {
    key:         'meeza',
    label:       'Meeza',
    icon:        '💳',
    color:       '#10b981',
    bg:          'rgba(16,185,129,0.08)',
    border:      'rgba(16,185,129,0.2)',
    placeholder: 'رقم بطاقة Meeza',
    fieldLabel:  'رقم بطاقة Meeza',
    desc:        'رقم بطاقة Meeza الخاصة بالاستلام',
  },
]

// ── Default state ──────────────────────────────────────────
const defaultData = () => ({
  // USDT
  usdtAddress:  '',
  usdtNetwork:  'TRC20',
  usdtEnabled:  true,
  // كل وسيلة لها: enabled + number
  ...Object.fromEntries(
    METHODS.flatMap(m => [
      [`${m.key}Enabled`, false],
      [`${m.key}Number`,  ''],
    ])
  ),
})

export default function AdminPaymentMethods() {
  const [data,    setData]    = useState(defaultData())
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: res } = await adminAPI.getPaymentMethods()
      if (res) setData(prev => ({ ...prev, ...res }))
    } catch (e) {
      console.error(e)
      setError('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const set = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await adminAPI.savePaymentMethods(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e.response?.data?.message || 'فشل الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout title="وسائل الدفع">
      <div style={s.loading}>
        <div style={s.spinner} />
        <span>جاري التحميل...</span>
      </div>
    </AdminLayout>
  )

  const enabledCount = METHODS.filter(m => data[`${m.key}Enabled`]).length

  return (
    <AdminLayout title="وسائل الدفع">

      {/* ── Page Header ──────────────────────────── */}
      <div style={s.pageHeader}>
        <div>
          <p style={s.pageDesc}>
            تحكم في وسائل الدفع التي تظهر للمستخدمين وأرقام الاستلام الخاصة بك
          </p>
          <div style={s.statsRow}>
            <span style={s.statChip}>
              <span style={{ color: '#22c55e' }}>●</span>
              {enabledCount} وسيلة مفعّلة
            </span>
            <span style={s.statChip}>
              <span style={{ color: data.usdtEnabled ? '#22c55e' : '#64748b' }}>●</span>
              USDT {data.usdtEnabled ? 'مفعّل' : 'معطّل'}
            </span>
          </div>
        </div>
        <button
          style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><div style={s.btnSpinner} /> جاري الحفظ...</>
          ) : saved ? (
            <>✓ تم الحفظ</>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              حفظ التغييرات
            </>
          )}
        </button>
      </div>

      {/* Feedback */}
      {error && <div style={s.errorBanner}>⚠ {error}</div>}
      {saved && <div style={s.successBanner}>✓ تم حفظ جميع التغييرات بنجاح</div>}

      {/* ═══════════════════════════════════════ */}
      {/* SECTION 1 — USDT Wallet               */}
      {/* ═══════════════════════════════════════ */}
      <Section
        title="عنوان محفظة USDT"
        subtitle="عنوان الاستلام الخاص بك على شبكة TRC20"
        icon="₮"
        iconBg="linear-gradient(135deg,#22c55e,#16a34a)"
        enabled={data.usdtEnabled}
        onToggle={() => set('usdtEnabled', !data.usdtEnabled)}
        toggleLabel="قبول USDT"
      >
        <div style={s.usdtGrid}>
          {/* Address field */}
          <div style={{ flex: 1 }}>
            <label style={s.fieldLabel}>عنوان المحفظة (TRC20)</label>
            <div style={s.inputWithCopy}>
              <input
                style={{ ...s.input, fontFamily: 'monospace', fontSize: 13, direction: 'ltr', textAlign: 'left' }}
                placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={data.usdtAddress}
                onChange={e => set('usdtAddress', e.target.value)}
                disabled={!data.usdtEnabled}
              />
              {data.usdtAddress && (
                <button
                  style={s.copyBtn}
                  onClick={() => navigator.clipboard.writeText(data.usdtAddress)}
                  title="نسخ العنوان"
                >
                  نسخ
                </button>
              )}
            </div>
            <p style={s.fieldHint}>
              ⚠ تأكد من أن العنوان صحيح — هذا هو العنوان الذي سيحوّل إليه المستخدمون
            </p>
          </div>

          {/* Network */}
          <div style={{ minWidth: 160 }}>
            <label style={s.fieldLabel}>الشبكة</label>
            <select
              style={{ ...s.input, cursor: 'pointer' }}
              value={data.usdtNetwork}
              onChange={e => set('usdtNetwork', e.target.value)}
              disabled={!data.usdtEnabled}
            >
              <option value="TRC20">TRC20 (Tron)</option>
              <option value="ERC20">ERC20 (Ethereum)</option>
              <option value="BEP20">BEP20 (BSC)</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        {data.usdtAddress && data.usdtEnabled && (
          <div style={s.previewBox}>
            <div style={s.previewLabel}>معاينة — ما يراه المستخدم:</div>
            <div style={s.previewContent}>
              <span style={{ color: '#22c55e', fontSize: 13 }}>عنوان الاستلام ({data.usdtNetwork}):</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', direction: 'ltr' }}>
                {data.usdtAddress.slice(0, 8)}...{data.usdtAddress.slice(-8)}
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* SECTION 2 — Egyptian Wallets          */}
      {/* ═══════════════════════════════════════ */}
      <div style={s.sectionTitle}>
        <div style={s.sectionTitleIcon}>🇪🇬</div>
        <div>
          <h2 style={s.sectionTitleText}>المحافظ الإلكترونية المصرية</h2>
          <p style={s.sectionTitleDesc}>فعّل الوسائل التي تريد إظهارها وأضف رقم الاستلام لكل وسيلة</p>
        </div>
      </div>

      <div style={s.methodsGrid}>
        {METHODS.map((method) => (
          <MethodCard
            key={method.key}
            method={method}
            enabled={data[`${method.key}Enabled`]}
            number={data[`${method.key}Number`]}
            onToggle={() => set(`${method.key}Enabled`, !data[`${method.key}Enabled`])}
            onChange={val => set(`${method.key}Number`, val)}
          />
        ))}
      </div>

      {/* ── Bottom Save ──────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          style={{ ...s.saveBtn, padding: '12px 36px', fontSize: 15 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'جاري الحفظ...' : '← حفظ كل التغييرات'}
        </button>
      </div>

    </AdminLayout>
  )
}

// ── Section Component ──────────────────────────────────────
function Section({ title, subtitle, icon, iconBg, enabled, onToggle, toggleLabel, children }) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.cardHeaderLeft}>
          <div style={{ ...s.sectionIcon, background: iconBg }}>
            {icon}
          </div>
          <div>
            <h3 style={s.cardTitle}>{title}</h3>
            <p style={s.cardSubtitle}>{subtitle}</p>
          </div>
        </div>
        {/* Toggle */}
        <div style={s.toggleWrap}>
          <span style={{ fontSize: 13, color: enabled ? '#22c55e' : '#64748b', fontWeight: 600 }}>
            {toggleLabel}
          </span>
          <Toggle value={enabled} onChange={onToggle} color="#22c55e" />
        </div>
      </div>
      <div style={{ opacity: enabled ? 1 : 0.4, transition: 'opacity 0.2s', pointerEvents: enabled ? 'auto' : 'none' }}>
        {children}
      </div>
    </div>
  )
}

// ── MethodCard ─────────────────────────────────────────────
function MethodCard({ method, enabled, number, onToggle, onChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{
      ...s.methodCard,
      borderColor: enabled ? method.border : '#1e293b',
      background: enabled ? method.bg : '#1e293b',
    }}>
      {/* Header */}
      <div style={s.methodHeader}>
        <div style={s.methodInfo}>
          <span style={s.methodIcon}>{method.icon}</span>
          <span style={{ ...s.methodLabel, color: enabled ? method.color : '#64748b' }}>
            {method.label}
          </span>
        </div>
        <Toggle value={enabled} onChange={onToggle} color={method.color} />
      </div>

      {/* Number field */}
      <div style={{ marginTop: 14 }}>
        <label style={{ ...s.fieldLabel, color: enabled ? '#94a3b8' : '#475569' }}>
          {method.fieldLabel}
        </label>
        <input
          style={{
            ...s.input,
            borderColor: focused && enabled ? method.color : '#334155',
            boxShadow: focused && enabled ? `0 0 0 3px ${method.color}22` : 'none',
            opacity: enabled ? 1 : 0.4,
            direction: 'ltr',
            textAlign: 'left',
          }}
          placeholder={enabled ? method.placeholder : 'معطّل'}
          value={number}
          onChange={e => onChange(e.target.value)}
          disabled={!enabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {enabled && number && (
          <p style={{ ...s.fieldHint, color: method.color }}>
            ✓ {method.desc}
          </p>
        )}
        {enabled && !number && (
          <p style={{ ...s.fieldHint, color: '#f59e0b' }}>
            ⚠ أدخل الرقم عشان يظهر للمستخدمين
          </p>
        )}
      </div>

      {/* Status indicator */}
      <div style={s.methodStatus}>
        <div style={{
          ...s.statusDot,
          background: enabled && number ? '#22c55e' : enabled ? '#f59e0b' : '#475569',
          boxShadow: enabled && number ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
        }} />
        <span style={{ fontSize: 11, color: '#64748b' }}>
          {!enabled           ? 'معطّل — لا يظهر للمستخدمين'
           : !number          ? 'مفعّل — ينقص رقم الاستلام'
           :                    'جاهز — يظهر للمستخدمين'}
        </span>
      </div>
    </div>
  )
}

// ── Toggle Component ───────────────────────────────────────
function Toggle({ value, onChange, color = '#3b82f6' }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: 'pointer',
        background: value ? color : '#334155',
        position: 'relative',
        transition: 'background 0.25s',
        flexShrink: 0,
        boxShadow: value ? `0 0 8px ${color}44` : 'none',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3,
        right: value ? 3 : 'auto',
        left: value ? 'auto' : 3,
        width: 18, height: 18,
        borderRadius: '50%',
        background: '#fff',
        transition: 'all 0.2s',
        display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

// ── Styles ────────────────────────────────────────────────
const s = {
  loading: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 16, padding: 80, color: '#64748b',
  },
  spinner: {
    width: 32, height: 32, borderRadius: '50%',
    border: '3px solid #1e293b',
    borderTop: '3px solid #3b82f6',
    animation: 'spin 0.8s linear infinite',
  },
  btnSpinner: {
    width: 14, height: 14, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    animation: 'spin 0.8s linear infinite',
  },

  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24,
  },
  pageDesc: { fontSize: 14, color: '#64748b', margin: '4px 0 10px' },
  statsRow: { display: 'flex', gap: 10 },
  statChip: {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, fontWeight: 600, color: '#94a3b8',
    background: '#1e293b', border: '1px solid #334155',
    borderRadius: 8, padding: '4px 12px',
  },

  saveBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', borderRadius: 10,
    border: 'none', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    color: '#fff', cursor: 'pointer',
    fontSize: 14, fontWeight: 700,
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
    transition: 'all 0.2s',
  },

  errorBanner:   { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', marginBottom: 16, fontSize: 14, fontWeight: 600 },
  successBanner: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', marginBottom: 16, fontSize: 14, fontWeight: 600 },

  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 14,
    padding: 22,
    marginBottom: 16,
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  cardHeaderLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  sectionIcon: {
    width: 42, height: 42, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0,
  },
  cardTitle:    { fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: 0 },
  cardSubtitle: { fontSize: 12, color: '#64748b', margin: '3px 0 0' },
  toggleWrap:   { display: 'flex', alignItems: 'center', gap: 10 },

  usdtGrid: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' },

  sectionTitle: {
    display: 'flex', alignItems: 'center', gap: 14,
    margin: '28px 0 16px',
  },
  sectionTitleIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: '#1e293b', border: '1px solid #334155',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, flexShrink: 0,
  },
  sectionTitleText: { fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0 },
  sectionTitleDesc: { fontSize: 12, color: '#64748b', margin: '3px 0 0' },

  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 14,
  },
  methodCard: {
    background: '#1e293b',
    border: '1px solid',
    borderRadius: 14,
    padding: 18,
    transition: 'all 0.2s',
  },
  methodHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  methodInfo:   { display: 'flex', alignItems: 'center', gap: 10 },
  methodIcon:   { fontSize: 22 },
  methodLabel:  { fontSize: 14, fontWeight: 800, transition: 'color 0.2s' },
  methodStatus: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 },
  statusDot:    { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },

  fieldLabel: {
    display: 'block',
    fontSize: 12, fontWeight: 600,
    color: '#64748b', marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 9,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: "'Cairo', 'Tajawal', sans-serif",
  },
  inputWithCopy: { position: 'relative' },
  copyBtn: {
    position: 'absolute',
    left: 8, top: '50%', transform: 'translateY(-50%)',
    padding: '4px 10px', borderRadius: 6,
    border: '1px solid #334155',
    background: '#1e293b', color: '#3b82f6',
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
  },
  fieldHint: { fontSize: 11, color: '#64748b', margin: '5px 0 0' },

  previewBox: {
    marginTop: 16,
    background: '#0f172a',
    border: '1px dashed #334155',
    borderRadius: 10,
    padding: '12px 16px',
  },
  previewLabel:   { fontSize: 11, color: '#475569', marginBottom: 6, fontWeight: 600 },
  previewContent: { display: 'flex', alignItems: 'center', gap: 10 },
}