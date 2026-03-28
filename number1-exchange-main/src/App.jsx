// src/App.jsx
import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar     from './components/common/Navbar'
import Footer     from './components/common/Footer'
import AuthModal  from './components/common/AuthModal'
import SupportFAB from './components/common/SupportFAB'

// Public Pages
import Home       from './pages/Home'
import Rates      from './pages/Rates'
import HowItWorks from './pages/HowItWorks'
import Reviews    from './pages/Reviews'
import Contact    from './pages/Contact'
import FAQ        from './pages/FAQ'
import About      from './pages/About'
import OrderTrack from './pages/OrderTrack'
import NotFound   from './pages/NotFound'

// Admin Pages
import AdminDashboard      from './pages/admin/AdminDashboard'
import AdminOrders         from './pages/admin/AdminOrders'
import AdminRates          from './pages/admin/AdminRates'
import AdminPaymentMethods from './pages/admin/AdminPaymentMethods'
import AdminUsers          from './pages/admin/AdminUsers'
import AdminSettings       from './pages/admin/AdminSettings'

import useAuth from './context/useAuth'

// Legal
import Terms   from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import AML     from './pages/legal/AML'
import Cookies from './pages/legal/Cookies'

// ── Admin Route Guard ──────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// ── App ────────────────────────────────────────────────────
function App() {
  const location    = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  const [authOpen, setAuthOpen] = useState(false)
  const [authTab,  setAuthTab]  = useState('login')

  const openAuth = (tab = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  // ══════════════════════════════════════════
  // ADMIN — معزول تماماً بدون Navbar/Footer
  // ══════════════════════════════════════════
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin"                 element={<AdminRoute><AdminDashboard      /></AdminRoute>} />
        <Route path="/admin/orders"          element={<AdminRoute><AdminOrders         /></AdminRoute>} />
        <Route path="/admin/rates"           element={<AdminRoute><AdminRates          /></AdminRoute>} />
        <Route path="/admin/payment-methods" element={<AdminRoute><AdminPaymentMethods /></AdminRoute>} />
        <Route path="/admin/users"           element={<AdminRoute><AdminUsers          /></AdminRoute>} />
        <Route path="/admin/settings"        element={<AdminRoute><AdminSettings       /></AdminRoute>} />
      </Routes>
    )
  }

  // ══════════════════════════════════════════
  // PUBLIC — Navbar + Footer كالمعتاد
  // ══════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAuth={openAuth} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/"             element={<Home onOpenAuth={openAuth} />} />
          <Route path="/rates"        element={<Rates />}      />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/reviews"      element={<Reviews />}    />
          <Route path="/contact"      element={<Contact />}    />
          <Route path="/faq"          element={<FAQ />}        />
          <Route path="/about"        element={<About />}      />
          <Route path="/track"        element={<OrderTrack />} />
          <Route path="/terms"        element={<Terms />}      />
          <Route path="/privacy"      element={<Privacy />}    />
          <Route path="/aml"          element={<AML />}        />
          <Route path="/cookies"      element={<Cookies />}    />
          <Route path="*"             element={<NotFound />}   />
        </Routes>
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} type={authTab} onClose={() => setAuthOpen(false)} />
      <SupportFAB />
    </div>
  )
}

export default App