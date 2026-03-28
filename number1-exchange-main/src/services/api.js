// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── Helper ───────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('n1_token') // ← المفتاح الصحيح

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    // نرمي error بنفس شكل axios عشان AuthContext يقدر يقرأه
    const error = new Error(data.message || 'Something went wrong')
    error.response = { data }
    throw error
  }

  // نرجع بنفس شكل axios: { data }
  return { data }
}

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),
}

// ─── Orders ───────────────────────────────────────────────────
export const ordersAPI = {
  create:     (body)       => request('/orders',                   { method: 'POST', body: JSON.stringify(body) }),
  track:      (orderNum)   => request(`/orders/track/${orderNum}`),
  myOrders:   ()           => request('/orders/my'),
  verifyUSDT: (id, txHash) => request(`/orders/${id}/verify-usdt`, { method: 'POST', body: JSON.stringify({ txHash }) }),
}

// ─── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getOrders:    (params = {}) => request(`/admin/orders?${new URLSearchParams(params)}`),
  getOrder:     (id)          => request(`/admin/orders/${id}`),
  updateStatus: (id, body)    => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  getStats:     ()            => request('/admin/stats'),
  getUsers:     ()            => request('/admin/users'),
}