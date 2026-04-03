// src/pages/admin/AdminRates.jsx
// =============================================
// Admin Rates - Control all exchange rates
// USDT/EGP + USDT/MoneyGo USD rates
// =============================================

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, RefreshCw, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

// ── Rate Fields Config ─────────────────────────────────
// Adjust these to match your DB fields exactly
const RATE_FIELDS = [
  {
    section: "USDT ↔ جنيه مصري (EGP)",
    color: "#2563eb",
    fields: [
      { key: "usdtBuyRate",   label: "سعر شراء USDT",   desc: "المستخدم يرسل USDT ← نعطيه EGP بهذا السعر",   unit: "EGP" },
      { key: "usdtSellRate",  label: "سعر بيع USDT",    desc: "المستخدم يرسل EGP ← نعطيه USDT بهذا السعر",   unit: "EGP" },
    ],
  },
  {
    section: "USDT ↔ MoneyGo USD",
    color: "#059669",
    fields: [
      { key: "moneygoRate",   label: "سعر USDT→MoneyGo", desc: "كم USDT يكافئ 1 دولار MoneyGo",               unit: "USDT" },
    ],
  },
  {
    section: "محافظ إلكترونية (EGP)",
    color: "#7c3aed",
    fields: [
      { key: "vodafoneBuyRate",  label: "Vodafone Cash شراء",  desc: "سعر شراء الجنيه عبر Vodafone Cash",   unit: "EGP" },
      { key: "instaPayRate",     label: "InstaPay",            desc: "سعر شراء الجنيه عبر InstaPay",        unit: "EGP" },
      { key: "fawryRate",        label: "Fawry",               desc: "سعر شراء الجنيه عبر Fawry",           unit: "EGP" },
      { key: "orangeRate",       label: "Orange Cash",         desc: "سعر شراء الجنيه عبر Orange Cash",     unit: "EGP" },
    ],
  },
  {
    section: "حدود المعاملات",
    color: "#d97706",
    fields: [
      { key: "minOrderUsdt",  label: "الحد الأدنى للطلب",  desc: "أقل مبلغ USDT مقبول لأي عملية",           unit: "USDT" },
      { key: "maxOrderUsdt",  label: "الحد الأقصى للطلب",  desc: "أعلى مبلغ USDT مقبول لأي عملية",          unit: "USDT" },
    ],
  },
];

export default function AdminRates() {
  const [rates,   setRates]   = useState({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => { fetchRates(); }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("n1_token");
      const res   = await fetch(`${API}/api/admin/rates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setRates(data || {});
    } catch (err) {
      console.error(err);
      setError("فشل تحميل الأسعار");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setRates((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("n1_token");
      const res   = await fetch(`${API}/api/admin/rates`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rates),
      });
      if (!res.ok) throw new Error("فشل الحفظ");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "فشل الحفظ");
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
          <h2 style={styles.pageTitle}>التحكم بالأسعار</h2>
          <p style={styles.pageSub}>تحديث أسعار الصرف لجميع العمليات</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.refreshBtn} onClick={fetchRates}>
            <RefreshCw size={15} />
          </button>
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? (
              <span>جاري الحفظ...</span>
            ) : (
              <><Save size={16} /><span>حفظ التغييرات</span></>
            )}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {saved && (
        <div style={styles.successBanner}>
          <CheckCircle size={16} /> تم حفظ الأسعار بنجاح
        </div>
      )}

      {/* Rate sections */}
      <div style={styles.sections}>
        {RATE_FIELDS.map((section) => (
          <div key={section.section} style={styles.card}>
            <div style={{ ...styles.sectionHeader, borderColor: section.color }}>
              <TrendingUp size={16} style={{ color: section.color }} />
              <span style={{ ...styles.sectionTitle, color: section.color }}>
                {section.section}
              </span>
            </div>

            <div style={styles.fieldsGrid}>
              {section.fields.map((field) => (
                <RateField
                  key={field.key}
                  label={field.label}
                  desc={field.desc}
                  unit={field.unit}
                  value={rates[field.key] ?? ""}
                  color={section.color}
                  onChange={(v) => handleChange(field.key, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button style={{ ...styles.saveBtn, padding: "12px 32px", fontSize: 15 }} onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : <><Save size={16} /><span>حفظ كل التغييرات</span></>}
        </button>
      </div>
    </AdminLayout>
  );
}

// ── RateField component ────────────────────────────────
function RateField({ label, desc, unit, value, color, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={field.wrap}>
      <div style={field.labelRow}>
        <span style={field.label}>{label}</span>
        <span style={{ ...field.unit, color, background: color + "22" }}>{unit}</span>
      </div>
      <p style={field.desc}>{desc}</p>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...field.input,
          borderColor: focused ? color : "#21262d",
          boxShadow: focused ? `0 0 0 3px ${color}22` : "none",
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
  refreshBtn:  {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 38, height: 38, border: "1px solid #21262d", borderRadius: 8,
    background: "#161b22", color: "#8b949e", cursor: "pointer",
  },
  saveBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "9px 20px", borderRadius: 8, border: "none",
    background: "#2563eb", color: "#fff", cursor: "pointer",
    fontSize: 14, fontWeight: 600,
  },
  errorBanner:   { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 8, background: "#3d0a0a", color: "#f85149", marginBottom: 16, fontSize: 14 },
  successBanner: { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 8, background: "#064e3b", color: "#059669", marginBottom: 16, fontSize: 14 },
  sections: { display: "flex", flexDirection: "column", gap: 16 },
  card: { backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 20 },
  sectionHeader: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, marginBottom: 16, borderBottom: "1px solid" },
  sectionTitle:  { fontSize: 15, fontWeight: 600 },
  fieldsGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
};

const field = {
  wrap:     { display: "flex", flexDirection: "column", gap: 6 },
  labelRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  label:    { fontSize: 14, fontWeight: 600, color: "#c9d1d9" },
  unit:     { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 },
  desc:     { fontSize: 12, color: "#484f58", margin: 0 },
  input:    {
    width: "100%",
    padding: "9px 12px",
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: 8,
    color: "#e6edf3",
    fontSize: 15,
    fontWeight: 600,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
};