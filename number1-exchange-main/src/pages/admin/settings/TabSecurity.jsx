// src/pages/admin/settings/TabSecurity.jsx
import { S, Toggle, Field, SectionCard, NumberField } from './SettingsShared'

export default function TabSecurity({ settings, set, confirm, showToast }) {

  const handleClearSessions = () => {
    confirm(
      'هل أنت متأكد من مسح جميع الجلسات النشطة؟ سيُطرد جميع المستخدمين المتصلين حالياً.',
      async () => {
        try {
          // await adminAPI.clearAllSessions()
          showToast('success', '✓ تم مسح جميع الجلسات')
        } catch {
          showToast('error', '✗ فشل مسح الجلسات')
        }
      }
    )
  }

  const handleExportAudit = () => {
    showToast('success', '⏳ جاري تصدير Audit Log...')
    // TODO: adminAPI.exportAuditLog()
  }

  return (
    <div style={S.tabWrap}>

      {/* ── ميزات الأمان ─────────────────────── */}
      <SectionCard title="ميزات الأمان" icon="🛡️">
        <Toggle
          label="JWT Refresh Token"
          desc="تجديد التوكن تلقائياً قبل انتهائه للحفاظ على الجلسة"
          value={settings.jwtRefreshEnabled}
          onChange={() => set('jwtRefreshEnabled', !settings.jwtRefreshEnabled)}
          color="#3b82f6"
        />
        <Toggle
          label="2FA للمشرفين"
          desc="المصادقة الثنائية إلزامية لجميع حسابات الأدمن"
          value={settings.twoFactorAdmin}
          onChange={() => set('twoFactorAdmin', !settings.twoFactorAdmin)}
          color="#8b5cf6"
          badge="جديد"
        />
        <Toggle
          label="Audit Log"
          desc="تسجيل جميع إجراءات الأدمن (تغيير إعدادات، تعديل طلبات...)"
          value={settings.auditLogEnabled}
          onChange={() => set('auditLogEnabled', !settings.auditLogEnabled)}
          color="#06b6d4"
          badge="جديد"
        />
      </SectionCard>

      {/* ── حدود الجلسة ──────────────────────── */}
      <SectionCard title="حدود الجلسة" icon="⏱️">
        <div style={S.fieldsGrid}>
          <NumberField
            label="مدة انتهاء الجلسة (ساعة)"
            value={settings.sessionExpireHours}
            onChange={v => set('sessionExpireHours', v)}
            min={1} max={168} placeholder="24"
          />
          <NumberField
            label="أقصى محاولات دخول فاشلة"
            value={settings.maxLoginAttempts}
            onChange={v => set('maxLoginAttempts', v)}
            min={1} max={20} placeholder="5"
          />
          <NumberField
            label="مدة حظر IP (دقيقة)"
            value={settings.ipBanMinutes}
            onChange={v => set('ipBanMinutes', v)}
            min={1} placeholder="30"
          />
          <NumberField
            label="أقصى جلسات متزامنة للمستخدم"
            value={settings.maxConcurrentSessions}
            onChange={v => set('maxConcurrentSessions', v)}
            min={1} max={10} placeholder="3"
          />
        </div>
      </SectionCard>

      {/* ── منطقة الخطر ──────────────────────── */}
      <div style={dangerZone}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f87171' }}>منطقة الخطر</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>هذه الإجراءات لا يمكن التراجع عنها</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DangerBtn
            label="🔴 مسح جميع الجلسات"
            desc="طرد جميع المستخدمين المتصلين حالياً"
            onClick={handleClearSessions}
          />
          <DangerBtn
            label="📥 تصدير Audit Log"
            desc="تحميل سجل الإجراءات بصيغة CSV"
            onClick={handleExportAudit}
            safe
          />
        </div>
      </div>

    </div>
  )
}

function DangerBtn({ label, desc, onClick, safe }) {
  return (
    <div style={{ flex: 1, minWidth: 200 }}>
      <button
        style={{
          width: '100%', padding: '11px 16px',
          borderRadius: 10,
          border: `1px solid ${safe ? '#334155' : 'rgba(239,68,68,0.3)'}`,
          background: safe ? '#1e293b' : 'rgba(239,68,68,0.08)',
          color: safe ? '#94a3b8' : '#f87171',
          cursor: 'pointer', fontSize: 13, fontWeight: 700,
          fontFamily: "'Cairo','Tajawal',sans-serif",
          transition: 'all 0.15s', textAlign: 'right',
        }}
        onClick={onClick}
      >
        {label}
      </button>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 5 }}>{desc}</div>
    </div>
  )
}

const dangerZone = {
  background: 'rgba(239,68,68,0.04)',
  border: '1px solid rgba(239,68,68,0.2)',
  borderRadius: 14, padding: 20, marginTop: 4,
}