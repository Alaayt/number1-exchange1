// src/pages/admin/AdminSettings.jsx
// =============================================
// Admin Settings - Platform on/off toggles + config
// =============================================

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, AlertCircle, CheckCircle, Power, Bell, Shield, Globe } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // Platform toggles
    platformEnabled:      true,
    maintenanceMode:      false,
    registrationEnabled:  true,
    // Order toggles
    usdtOrdersEnabled:    true,
    walletOrdersEnabled:  true,
    // Notifications
    telegramNotifications: true,
    emailNotifications:   true,
    // Display
    platformNameAr:       "نمبر ون",
    platformNameEn:       "Number1",
    supportEmail:         "",
    supportTelegram:      "",
  });

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data) setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleText = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div style={{ padding: 80, textAlign: "center", color: "#6e7681" }}>جاري التحميل...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>الإعدادات العامة</h2>
          <p style={styles.pageSub}>التحكم في المنصة والخيارات العامة</p>
        </div>
        <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div style={styles.errorBanner}><AlertCircle size={16} /> {error}</div>
      )}
      {saved && (
        <div style={styles.successBanner}><CheckCircle size={16} /> تم الحفظ بنجاح ✓</div>
      )}

      {/* ── Section: Platform ──────────────────────── */}
      <SettingsSection icon={<Power size={16} />} title="حالة المنصة" color="#2563eb">
        <ToggleRow
          label="تفعيل المنصة"
          desc="إيقاف هذا سيمنع جميع العمليات الجديدة"
          value={settings.platformEnabled}
          onChange={() => handleToggle("platformEnabled")}
          color="#059669"
          danger={!settings.platformEnabled}
        />
        <ToggleRow
          label="وضع الصيانة"
          desc="يعرض رسالة صيانة للمستخدمين ويوقف الموقع"
          value={settings.maintenanceMode}
          onChange={() => handleToggle("maintenanceMode")}
          color="#d97706"
          danger={settings.maintenanceMode}
        />
        <ToggleRow
          label="تسجيل مستخدمين جدد"
          desc="السماح بإنشاء حسابات جديدة"
          value={settings.registrationEnabled}
          onChange={() => handleToggle("registrationEnabled")}
          color="#059669"
        />
      </SettingsSection>

      {/* ── Section: Order Types ───────────────────── */}
      <SettingsSection icon={<Globe size={16} />} title="أنواع الطلبات" color="#7c3aed">
        <ToggleRow
          label="طلبات USDT"
          desc="قبول طلبات الدفع بـ USDT (TRC20)"
          value={settings.usdtOrdersEnabled}
          onChange={() => handleToggle("usdtOrdersEnabled")}
          color="#059669"
        />
        <ToggleRow
          label="طلبات المحافظ الإلكترونية"
          desc="قبول طلبات Vodafone Cash / InstaPay / Fawry وغيرها"
          value={settings.walletOrdersEnabled}
          onChange={() => handleToggle("walletOrdersEnabled")}
          color="#059669"
        />
      </SettingsSection>

      {/* ── Section: Notifications ─────────────────── */}
      <SettingsSection icon={<Bell size={16} />} title="الإشعارات" color="#d97706">
        <ToggleRow
          label="إشعارات Telegram"
          desc="إرسال تنبيهات للطلبات الجديدة عبر Telegram Bot"
          value={settings.telegramNotifications}
          onChange={() => handleToggle("telegramNotifications")}
          color="#2563eb"
        />
        <ToggleRow
          label="إشعارات البريد الإلكتروني"
          desc="إرسال تأكيدات الطلبات عبر البريد (Resend)"
          value={settings.emailNotifications}
          onChange={() => handleToggle("emailNotifications")}
          color="#2563eb"
        />
      </SettingsSection>

      {/* ── Section: Info ──────────────────────────── */}
      <SettingsSection icon={<Shield size={16} />} title="معلومات المنصة" color="#059669">
        <div style={styles.textFieldsGrid}>
          <TextField
            label="اسم المنصة (عربي)"
            value={settings.platformNameAr}
            onChange={(v) => handleText("platformNameAr", v)}
          />
          <TextField
            label="اسم المنصة (إنجليزي)"
            value={settings.platformNameEn}
            onChange={(v) => handleText("platformNameEn", v)}
          />
          <TextField
            label="إيميل الدعم"
            type="email"
            placeholder="support@..."
            value={settings.supportEmail}
            onChange={(v) => handleText("supportEmail", v)}
          />
          <TextField
            label="Telegram الدعم"
            placeholder="@username"
            value={settings.supportTelegram}
            onChange={(v) => handleText("supportTelegram", v)}
          />
        </div>
      </SettingsSection>

      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button style={{ ...styles.saveBtn, padding: "12px 32px", fontSize: 15 }} onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "جاري الحفظ..." : "حفظ كل الإعدادات"}
        </button>
      </div>
    </AdminLayout>
  );
}

// ── SettingsSection ────────────────────────────────────
function SettingsSection({ icon, title, color, children }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.sectionHeader, borderColor: color }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ ...styles.sectionTitle, color }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

// ── ToggleRow ──────────────────────────────────────────
function ToggleRow({ label, desc, value, onChange, color, danger }) {
  return (
    <div style={{ ...toggle.row, ...(danger ? toggle.dangerRow : {}) }}>
      <div style={{ flex: 1 }}>
        <div style={toggle.label}>{label}</div>
        <div style={toggle.desc}>{desc}</div>
      </div>
      <button
        style={{
          ...toggle.btn,
          background: value ? color : "#21262d",
          boxShadow: value ? `0 0 0 3px ${color}33` : "none",
        }}
        onClick={onChange}
        role="switch"
        aria-checked={value}
      >
        <span
          style={{
            ...toggle.thumb,
            transform: value ? "translateX(20px)" : "translateX(2px)",
          }}
        />
      </button>
    </div>
  );
}

// ── TextField ──────────────────────────────────────────
function TextField({ label, value, onChange, type = "text", placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...styles.fieldInput,
          borderColor: focused ? "#2563eb" : "#21262d",
          boxShadow: focused ? "0 0 0 3px #2563eb22" : "none",
        }}
      />
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  pageHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  pageTitle:   { fontSize: 20, fontWeight: 700, color: "#e6edf3", margin: 0 },
  pageSub:     { fontSize: 13, color: "#6e7681", marginTop: 4 },
  saveBtn:     { display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  errorBanner:   { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 8, background: "#3d0a0a", color: "#f85149", marginBottom: 16, fontSize: 14 },
  successBanner: { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 8, background: "#064e3b", color: "#059669", marginBottom: 16, fontSize: 14 },
  card:          { backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20, marginBottom: 16 },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, marginBottom: 16, borderBottom: "1px solid" },
  sectionTitle:  { fontSize: 15, fontWeight: 600 },
  textFieldsGrid:{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  fieldLabel:    { display: "block", fontSize: 13, fontWeight: 600, color: "#c9d1d9", marginBottom: 6 },
  fieldInput:    { width: "100%", padding: "9px 12px", background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 14, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box" },
};

const toggle = {
  row:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #21262d" },
  dangerRow:{ background: "#1a0a0a", marginInline: -20, paddingInline: 20, borderRadius: 8 },
  label:    { fontSize: 14, fontWeight: 600, color: "#c9d1d9" },
  desc:     { fontSize: 12, color: "#6e7681", marginTop: 3 },
  btn:      { width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative", transition: "background 0.25s, box-shadow 0.25s", flexShrink: 0 },
  thumb:    { position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "transform 0.2s", display: "block" },
};