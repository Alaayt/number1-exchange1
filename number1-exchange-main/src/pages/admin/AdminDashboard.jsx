// src/pages/admin/AdminDashboard.jsx
// =============================================
// Admin Dashboard - Stats Cards + Recent Orders + Chart
// =============================================

import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  ArrowLeftRight,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ── API call ──────────────────────────────────────────
const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [stats, setStats]         = useState(null);
  const [recentOrders, setRecent] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats + recent orders in parallel
      const [statsRes, ordersRes] = await Promise.all([
        fetch(`${API}/api/admin/stats`, { headers }),
        fetch(`${API}/api/admin/orders?limit=5&sort=newest`, { headers }),
      ]);

      const statsData  = await statsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setRecent(ordersData.orders || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>جاري التحميل...</div>
    </AdminLayout>
  );

  // ── Stat cards config ────────────────────────────
  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: stats?.totalOrders ?? "—",
      icon: ArrowLeftRight,
      color: "#2563eb",
      bg:   "#1e3a5f",
      sub:  `${stats?.todayOrders ?? 0} اليوم`,
    },
    {
      title: "المستخدمون",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "#7c3aed",
      bg:   "#3b1f6e",
      sub:  `${stats?.newUsersToday ?? 0} جديد اليوم`,
    },
    {
      title: "حجم التداول (USDT)",
      value: stats?.totalVolumeUsdt ? `$${Number(stats.totalVolumeUsdt).toLocaleString()}` : "—",
      icon: DollarSign,
      color: "#059669",
      bg:   "#064e3b",
      sub:  "إجمالي كل الوقت",
    },
    {
      title: "معدل الإتمام",
      value: stats?.completionRate ? `${stats.completionRate}%` : "—",
      icon: TrendingUp,
      color: "#d97706",
      bg:   "#451a03",
      sub:  "طلبات مكتملة / إجمالي",
    },
  ];

  return (
    <AdminLayout>
      {/* ── Stat Cards ────────────────────────────── */}
      <div style={styles.statsGrid}>
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Two columns: Recent Orders + Quick Summary ── */}
      <div style={styles.bottomGrid}>
        {/* Recent Orders */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>أحدث الطلبات</span>
            <a href="/admin/orders" style={styles.viewAll}>عرض الكل</a>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                {["#", "المستخدم", "النوع", "المبلغ", "الحالة", "التاريخ"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: "center", color: "#6e7681" }}>
                    لا يوجد طلبات حتى الآن
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                    </td>
                    <td style={styles.td}>{order.userId?.email || "—"}</td>
                    <td style={styles.td}>
                      <span style={styles.typeBadge}>{order.type || "USDT→EGP"}</span>
                    </td>
                    <td style={styles.td}>{order.amount} {order.currency}</td>
                    <td style={styles.td}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={styles.td}>
                      {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Summary */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>ملخص الحالات</span>
          </div>
          <div style={styles.summaryList}>
            <SummaryRow
              icon={<Clock size={16} />}
              label="قيد الانتظار"
              value={stats?.pendingOrders ?? 0}
              color="#d97706"
            />
            <SummaryRow
              icon={<AlertCircle size={16} />}
              label="قيد المراجعة"
              value={stats?.reviewOrders ?? 0}
              color="#7c3aed"
            />
            <SummaryRow
              icon={<CheckCircle size={16} />}
              label="مكتملة"
              value={stats?.completedOrders ?? 0}
              color="#059669"
            />
            <SummaryRow
              icon={<XCircle size={16} />}
              label="مرفوضة"
              value={stats?.rejectedOrders ?? 0}
              color="#f85149"
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={styles.cardTitle}>الطرق المفضّلة</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {(stats?.methodBreakdown || [
                { method: "USDT", pct: 55 },
                { method: "Vodafone Cash", pct: 25 },
                { method: "InstaPay", pct: 12 },
                { method: "أخرى", pct: 8 },
              ]).map((m) => (
                <ProgressRow key={m.method} label={m.method} pct={m.pct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Sub-components ─────────────────────────────────────

function StatCard({ title, value, icon: Icon, color, bg, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, backgroundColor: bg, color }}>
        <Icon size={22} />
      </div>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.statSub}>{sub}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   { label: "انتظار",  color: "#d97706", bg: "#451a03" },
    reviewing: { label: "مراجعة", color: "#7c3aed", bg: "#3b1f6e" },
    completed: { label: "مكتمل",  color: "#059669", bg: "#064e3b" },
    rejected:  { label: "مرفوض", color: "#f85149", bg: "#3d0a0a" },
  };
  const s = map[status] || { label: status, color: "#8b949e", bg: "#21262d" };
  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: s.bg,
      color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function SummaryRow({ icon, label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #21262d" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
        {icon}
        <span style={{ fontSize: 14, color: "#c9d1d9" }}>{label}</span>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function ProgressRow({ label, pct }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#8b949e", marginBottom: 4 }}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#21262d", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  loading: { display: "flex", justifyContent: "center", padding: 80, color: "#8b949e", fontSize: 18 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#161b22",
    border: "1px solid #21262d",
    borderRadius: 12,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statValue: { fontSize: 24, fontWeight: 700, color: "#e6edf3" },
  statTitle: { fontSize: 13, color: "#8b949e", marginTop: 2 },
  statSub:   { fontSize: 11, color: "#484f58", marginTop: 2 },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 16,
  },
  card: {
    backgroundColor: "#161b22",
    border: "1px solid #21262d",
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  cardTitle:  { fontSize: 15, fontWeight: 600, color: "#e6edf3" },
  viewAll:    { fontSize: 13, color: "#2563eb", textDecoration: "none" },
  table:  { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "right", padding: "8px 12px", fontSize: 12, color: "#6e7681", borderBottom: "1px solid #21262d", fontWeight: 500 },
  td: { padding: "10px 12px", fontSize: 13, color: "#c9d1d9", borderBottom: "1px solid #21262d" },
  tr: { transition: "background 0.15s" },
  orderId:   { fontFamily: "monospace", color: "#8b949e", fontSize: 12 },
  typeBadge: { fontSize: 11, color: "#2563eb", background: "#1e3a5f", padding: "2px 8px", borderRadius: 10, fontWeight: 600 },
  summaryList: { display: "flex", flexDirection: "column" },
};