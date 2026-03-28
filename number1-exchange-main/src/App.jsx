// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Navbar     from './components/common/Navbar'
import Footer     from './components/common/Footer'
import AuthModal  from './components/common/AuthModal'
import SupportFAB from './components/common/SupportFAB'

// Pages
import Home       from './pages/Home'
import Rates      from './pages/Rates'
import HowItWorks from './pages/HowItWorks'
import Reviews    from './pages/Reviews'
import Contact    from './pages/Contact'
import FAQ        from './pages/FAQ'
import About      from './pages/About'
import OrderTrack from './pages/OrderTrack'
import NotFound   from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import useAuth from './context/useAuth'
// Legal
import Terms   from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import AML     from './pages/legal/AML'
import Cookies from './pages/legal/Cookies'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/')
    }
  }, [user, loading])

  if (loading) return null
  if (!user || user.role !== 'admin') return null
  return children
}
function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab,  setAuthTab]  = useState('login')

  const openAuth = (tab = 'login') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ✅ لا Ticker — تم حذفه */}
      <Navbar onOpenAuth={openAuth} />

      <main style={{ flex: 1 }}>
        
        <Routes>
          <Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
          <Route path="/"             element={<Home onOpenAuth={openAuth} />} />
          <Route path="/rates"        element={<Rates />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/reviews"      element={<Reviews />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/faq"          element={<FAQ />} />
          <Route path="/about"        element={<About />} />
          <Route path="/track"        element={<OrderTrack />} />
          <Route path="/terms"        element={<Terms />} />
          <Route path="/privacy"      element={<Privacy />} />
          <Route path="/aml"          element={<AML />} />
          <Route path="/cookies"      element={<Cookies />} />
          <Route path="*"             element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        type={authTab}
        onClose={() => setAuthOpen(false)}
      />

      <SupportFAB />
    </div>
  )
}

export default App