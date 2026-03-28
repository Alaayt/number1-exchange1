// src/pages/admin/settings/TabNotifications.jsx
import { S, Toggle, Field, SectionCard } from './SettingsShared'
import { useState } from 'react'

export default function TabNotifications({ settings, set }) {
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [showBotToken, setShowBotToken] = useState(false)

  return (
    <div style={S.tabWrap}>

      {/* ── تفعيل الإشعارات ──────────────────── */}
      <SectionCard title="قنوات الإشعارات" icon="🔔">
        <Toggle
          label="إشعارات Telegram"
          desc="إرسال تنبيهات للطلبات الجديدة عبر Telegram Bot"
          value={settings.telegramNotifications}
          onChange={() => set('telegramNotifications', !settings.telegramNotifications)}
          color="#3b82f6"
        />
        <Toggle
          label="إشعارات البريد الإلكتروني"
          desc="إرسال تأكيدات الطلبات عبر البريد (SMTP)"
          value={settings.emailNotifications}
          onChange={() => set('emailNotifications', !settings.emailNotifications)}
          color="#3b82f6"
        />
      </SectionCard>

      {/* ── Telegram Bot ─────────────────────── */}
      <SectionCard title="إعدادات Telegram Bot" icon="✈️">
        <div style={S.fieldsGrid}>
          <Field label="Bot Token">
            <div style={S.secretField}>
              <input
                style={{ ...S.input, direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', fontSize: 12 }}
                type={showBotToken ? 'text' : 'password'}
                value={settings.telegramBotToken}
                onChange={e => set('telegramBotToken', e.target.value)}
                placeholder="123456789:AAF..."
              />
              <button style={S.eyeBtn} onClick={() => setShowBotToken(v => !v)}>
                {showBotToken ? '🙈' : '👁'}
              </button>
            </div>
          </Field>
          <Field label="Chat ID">
            <input
              style={{ ...S.input, direction: 'ltr', textAlign: 'left', fontFamily: 'monospace' }}
              value={settings.telegramChatId}
              onChange={e => set('telegramChatId', e.target.value)}
              placeholder="-100XXXXXXXXXX"
            />
          </Field>
        </div>
        <div style={S.hint}>
          💡 ابحث عن @BotFather في Telegram لإنشاء Bot جديد والحصول على التوكن
        </div>
      </SectionCard>

      {/* ── SMTP ─────────────────────────────── */}
      <SectionCard title="إعدادات SMTP للبريد" icon="📧">
        <div style={S.fieldsGrid}>
          <Field label="SMTP Host">
            <input
              style={{ ...S.input, direction: 'ltr', textAlign: 'left' }}
              value={settings.smtpHost}
              onChange={e => set('smtpHost', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </Field>
          <Field label="SMTP Port">
            <input
              style={{ ...S.input, direction: 'ltr', textAlign: 'left' }}
              type="number"
              value={settings.smtpPort}
              onChange={e => set('smtpPort', Number(e.target.value))}
              placeholder="587"
            />
          </Field>
          <Field label="SMTP Email">
            <input
              style={{ ...S.input, direction: 'ltr', textAlign: 'left' }}
              type="email"
              value={settings.smtpEmail}
              onChange={e => set('smtpEmail', e.target.value)}
              placeholder="noreply@number1.com"
            />
          </Field>
          <Field label="SMTP Password">
            <div style={S.secretField}>
              <input
                style={{ ...S.input, direction: 'ltr', textAlign: 'left', fontFamily: 'monospace' }}
                type={showSmtpPass ? 'text' : 'password'}
                value={settings.smtpPassword}
                onChange={e => set('smtpPassword', e.target.value)}
                placeholder="••••••••••••"
              />
              <button style={S.eyeBtn} onClick={() => setShowSmtpPass(v => !v)}>
                {showSmtpPass ? '🙈' : '👁'}
              </button>
            </div>
          </Field>
        </div>
      </SectionCard>

    </div>
  )
}