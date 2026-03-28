import { Routes, Route } from 'react-router-dom'
import { useSiteConfig } from './hooks/useSiteConfig'

// Layout
import Layout from './components/Layout'

// Public Pages
import Home from './pages/Home'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import SubdomainDirectory from './pages/SubdomainDirectory'
import SubdomainSite from './pages/SubdomainSite'
import GetListed from './pages/GetListed'
import Acquire from './pages/Acquire'
import Intelligence from './pages/Intelligence'
import Contact from './pages/Contact'

// Admin Pages
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import Leads from './admin/Leads'
import Listings from './admin/Listings'
import AdminSubdomains from './admin/Subdomains'
import Acquisitions from './admin/Acquisitions'
import Outbound from './admin/Outbound'
import Analytics from './admin/Analytics'
import OwnerDashboard from './admin/OwnerDashboard'

export default function App() {
  const { loading } = useSiteConfig()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/:slug" element={<CompanyDetail />} />
        <Route path="subdomains" element={<SubdomainDirectory />} />
        <Route path="subdomain/:subdomain" element={<SubdomainSite />} />
        <Route path="get-listed" element={<GetListed />} />
        <Route path="acquire" element={<Acquire />} />
        <Route path="intelligence" element={<Intelligence />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="listings" element={<Listings />} />
        <Route path="subdomains" element={<AdminSubdomains />} />
        <Route path="acquisitions" element={<Acquisitions />} />
        <Route path="outbound" element={<Outbound />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="owner" element={<OwnerDashboard />} />
      </Route>
    </Routes>
  )
}
