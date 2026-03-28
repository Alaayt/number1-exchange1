// src/pages/admin/AdminUsers.jsx
// =============================================
// Admin Users - View, search, block/unblock users
// =============================================

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Search, UserCheck, UserX, Eye,
  RefreshCw, ChevronLeft, ChevronRight, Shield,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("");   // "" | "active" | "blocked" | "admin"
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected,   setSelected]   = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const LIMIT = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token  = localStorage.getItem("token");
      const params = new URLSearchParams({
        page,
        limit: LIMIT,
        ...(search && { search }),
        ...(filter && { status: filter }),
      });
      const res  = await fetch(`${API}/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Toggle block status ───────────────────────────
  const toggleBlock = async (userId, isBlocked) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      await fetchUsers();
      if (selected?._id === userId) {
        setSelected((prev) => ({ ...prev, isBlocked: !isBlocked }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const FILTER_TABS = [
    { value: "",        label: "الكل"      },
    { value: "active",  label: "نشطون"     },
    { value: "blocked", label: "محظورون"   },
    { value: "admin",   label: "مشرفون"    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>إدارة المستخدمين</h2>
        <button style={styles.refreshBtn} onClick={fetchUsers}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {FILTER_TABS.map((t) => (
          <button
            key={t.value}
            style={{ ...styles.tab, ...(filter === t.value ? styles.tabActive : {}) }}
            onClick={() => { setFilter(t.value); setPage(1); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={styles.searchRow}>
        <div style={styles.searchBox}>
          <Search size={15} style={{ color: "#6e7681" }} />
          <input
            style={styles.searchInput}
            placeholder="ابحث بالاسم أو الإيميل..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.loading}>جاري التحميل...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {["المستخدم", "الإيميل", "تاريخ التسجيل", "الطلبات", "الدور", "الحالة", "إجراء"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.empty}>لا يوجد مستخدمون</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{(user.name || "U")[0].toUpperCase()}</div>
                        <span>{user.name || "—"}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.orderCount}>{user.orderCount ?? 0}</span>
                    </td>
                    <td style={styles.td}>
                      {user.role === "admin" ? (
                        <span style={styles.adminBadge}><Shield size={12} /> مشرف</span>
                      ) : (
                        <span style={styles.userBadge}>مستخدم</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={user.isBlocked ? styles.blockedBadge : styles.activeBadge}>
                        {user.isBlocked ? "محظور" : "نشط"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={styles.viewBtn} onClick={() => setSelected(user)} title="عرض">
                          <Eye size={14} />
                        </button>
                        <button
                          style={user.isBlocked ? styles.unblockBtn : styles.blockBtn}
                          onClick={() => toggleBlock(user._id, user.isBlocked)}
                          title={user.isBlocked ? "رفع الحظر" : "حظر"}
                        >
                          {user.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronRight size={16} />
            </button>
            <span style={styles.pageInfo}>{page} / {totalPages}</span>
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selected && (
        <UserDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onToggleBlock={toggleBlock}
          loading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}

// ── UserDetailModal ────────────────────────────────────
function UserDetailModal({ user, onClose, onToggleBlock, loading }) {
  const rows = [
    ["الاسم",           user.name     || "—"],
    ["الإيميل",         user.email    || "—"],
    ["رقم الهاتف",      user.phone    || "—"],
    ["تاريخ التسجيل",   new Date(user.createdAt).toLocaleString("ar-EG")],
    ["إجمالي الطلبات",  user.orderCount ?? 0],
    ["الدور",           user.role     || "user"],
    ["الحالة",          user.isBlocked ? "محظور" : "نشط"],
  ];

  return (
    <div style={modal.overlay} onClick={onClose}>
      <div style={modal.box} onClick={(e) => e.stopPropagation()}>
        <div style={modal.header}>
          <span style={modal.title}>تفاصيل المستخدم</span>
          <button style={modal.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={modal.bigAvatar}>{(user.name || "U")[0].toUpperCase()}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3", marginTop: 8 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: "#6e7681" }}>{user.email}</div>
        </div>

        <div style={modal.infoGrid}>
          {rows.map(([label, value]) => (
            <div key={label} style={modal.infoRow}>
              <span style={modal.infoLabel}>{label}</span>
              <span style={modal.infoValue}>{value}</span>
            </div>
          ))}
        </div>

        {/* Block / Unblock */}
        {user.role !== "admin" && (
          <button
            style={user.isBlocked ? modal.unblockBtn : modal.blockBtn}
            disabled={loading}
            onClick={() => onToggleBlock(user._id, user.isBlocked)}
          >
            {user.isBlocked ? (
              <><UserCheck size={16} /> رفع الحظر</>
            ) : (
              <><UserX size={16} /> حظر المستخدم</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = {
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  pageTitle:  { fontSize: 20, fontWeight: 700, color: "#e6edf3", margin: 0 },
  refreshBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid #21262d", borderRadius: 8, background: "#161b22", color: "#8b949e", cursor: "pointer" },
  tabs:       { display: "flex", gap: 4, marginBottom: 16 },
  tab:        { padding: "7px 16px", borderRadius: 8, border: "1px solid #21262d", background: "none", color: "#8b949e", cursor: "pointer", fontSize: 13 },
  tabActive:  { background: "#1e3a5f", color: "#2563eb", borderColor: "#2563eb" },
  searchRow:  { marginBottom: 16 },
  searchBox:  { display: "flex", alignItems: "center", gap: 8, background: "#161b22", border: "1px solid #21262d", borderRadius: 8, padding: "8px 14px", maxWidth: 400 },
  searchInput:{ background: "none", border: "none", outline: "none", color: "#e6edf3", fontSize: 14, flex: 1 },
  card:       { backgroundColor: "#161b22", border: "1px solid #21262d", borderRadius: 12, overflow: "hidden" },
  loading:    { padding: 40, textAlign: "center", color: "#6e7681" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { textAlign: "right", padding: "10px 14px", fontSize: 12, color: "#6e7681", borderBottom: "1px solid #21262d", fontWeight: 500 },
  td:         { padding: "11px 14px", fontSize: 13, color: "#c9d1d9", borderBottom: "1px solid #161b22" },
  tr:         {},
  empty:      { padding: 40, textAlign: "center", color: "#6e7681" },
  userCell:   { display: "flex", alignItems: "center", gap: 10 },
  avatar:     { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 },
  orderCount: { background: "#21262d", padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600 },
  adminBadge:  { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#d97706", background: "#451a03", padding: "2px 8px", borderRadius: 10 },
  userBadge:   { fontSize: 11, color: "#6e7681", background: "#21262d", padding: "2px 8px", borderRadius: 10 },
  activeBadge: { fontSize: 11, color: "#059669", background: "#064e3b", padding: "2px 8px", borderRadius: 10, fontWeight: 600 },
  blockedBadge:{ fontSize: 11, color: "#f85149", background: "#3d0a0a", padding: "2px 8px", borderRadius: 10, fontWeight: 600 },
  viewBtn:    { background: "#21262d", border: "none", color: "#8b949e", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  blockBtn:   { background: "#3d0a0a", border: "none", color: "#f85149", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  unblockBtn: { background: "#064e3b", border: "none", color: "#059669", borderRadius: 6, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: 16 },
  pageBtn:    { background: "#21262d", border: "none", color: "#8b949e", borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  pageInfo:   { fontSize: 13, color: "#8b949e" },
};

const modal = {
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  box:     { backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: 24, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" },
  header:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title:   { fontSize: 16, fontWeight: 700, color: "#e6edf3" },
  closeBtn:{ background: "none", border: "none", color: "#6e7681", cursor: "pointer", fontSize: 18 },
  bigAvatar: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 auto" },
  infoGrid:  { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 },
  infoRow:   { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #21262d", paddingBottom: 8 },
  infoLabel: { fontSize: 13, color: "#6e7681" },
  infoValue: { fontSize: 13, color: "#e6edf3", fontWeight: 500 },
  blockBtn:  { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 11, borderRadius: 8, border: "none", background: "#3d0a0a", color: "#f85149", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  unblockBtn:{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 11, borderRadius: 8, border: "none", background: "#064e3b", color: "#059669", cursor: "pointer", fontSize: 14, fontWeight: 600 },
};