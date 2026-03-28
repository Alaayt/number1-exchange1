// src/pages/admin/settings/SettingsShared.jsx
// =============================================
// مكونات مشتركة بين جميع Tabs
// =============================================

// ── Shared Styles ─────────────────────────────────────────
export const S = {
  tabWrap: { display: 'flex', flexDirection: 'column', gap: 16 },

  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 14, padding: 20,
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 10,
    paddingBottom: 16, marginBottom: 16,
    borderBottom: '1px solid #334155',
  },
  cardIcon:  { fontSize: 18 },
  cardTitle: { fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: 0 },

  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 14,
  },

  input: {
    width: '100%', padding: '10px 12px',
    background: '#0f172a', border: '1px solid #334155',
    borderRadius: 9, color: '#e2e8f0', fontSize: 13,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Cairo','Tajawal',sans-serif",
    transition: 'border-color 0.2s',
  },

  label: {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: '#64748b', marginBottom: 6, letterSpacing: 0.3,
  },

  hint: {
    fontSize: 12, color: '#64748b', marginTop: 10,
    lineHeight: 1.6,
  },

  toggleRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #1e293b',
  },
  toggleLabel: { fontSize: 14, fontWeight: 600, color: '#cbd5e1' },
  toggleDesc:  { fontSize: 12, color: '#64748b', marginTop: 3 },

  secretField: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', left: 8, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 14, padding: 2,
  },
}

// ── SectionCard ────────────────────────────────────────────
export function SectionCard({ title, icon, children }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <span style={S.cardIcon}>{icon}</span>
        <h3 style={S.cardTitle}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

// ── Toggle ─────────────────────────────────────────────────
export function Toggle({ label, desc, value, onChange, color = '#3b82f6', danger, badge }) {
  return (
    <div style={{
      ...S.toggleRow,
      ...(danger ? { background: 'rgba(239,68,68,0.04)', marginInline: -20, paddingInline: 20, borderRadius: 8 } : {}),
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={S.toggleLabel}>{label}</span>
          {badge && (
            <span style={{ fontSize: 9, fontWeight: 800, color: '#3b82f6', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, padding: '1px 6px' }}>
              {badge}
            </span>
          )}
        </div>
        {desc && <div style={S.toggleDesc}>{desc}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12,
          border: 'none', cursor: 'pointer',
          background: value ? color : '#334155',
          position: 'relative', transition: 'background 0.25s',
          flexShrink: 0, marginRight: 8,
          boxShadow: value ? `0 0 8px ${color}44` : 'none',
        }}
      >
        <span style={{
          position: 'absolute', top: 3,
          right: value ? 3 : 'auto',
          left:  value ? 'auto' : 3,
          width: 18, height: 18,
          borderRadius: '50%', background: '#fff',
          transition: 'all 0.2s', display: 'block',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )
}

// ── Field ──────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  )
}

// ── NumberField ────────────────────────────────────────────
export function NumberField({ label, value, onChange, min, max, placeholder }) {
  return (
    <Field label={label}>
      <input
        style={{ ...S.input, direction: 'ltr', textAlign: 'left' }}
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min} max={max}
        placeholder={placeholder}
      />
    </Field>
  )
}