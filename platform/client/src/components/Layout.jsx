import { Outlet, Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, ROOT_DOMAIN_URL, DOMA_CLAIM_URL } from '../lib/constants'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { config } = useSiteConfig()

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const displayName = config?.['site.display_name'] || domain.toUpperCase()

  // Build nav links based on enabled features
  const allNavLinks = [
    { path: '/', label: 'Home', always: true },
    { path: '/companies', label: 'Directory', feature: 'directory' },
    { path: '/subdomains', label: 'Namespace', feature: 'subdomains' },
    { path: '/intelligence', label: 'Intelligence', feature: 'intelligence' },
    { path: '/get-listed', label: 'Get Listed', always: true },
  ]

  const navLinks = allNavLinks.filter(link =>
    link.always || config?.[`features.${link.feature}`] !== 'false'
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Context Banner */}
      <div className="bg-accent/10 border-b border-accent/30 py-1.5 px-4 text-center">
        <p className="text-xs text-accent">
          You're viewing <span className="font-mono">www2.{domain}</span> —
          <a href={ROOT_DOMAIN_URL} target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-white">
            Acquire {domain}
          </a> or
          <a href={DOMA_CLAIM_URL} target="_blank" rel="noopener noreferrer" className="underline ml-1 hover:text-white">
            claim a subdomain
          </a>
        </p>
      </div>

      {/* Navigation */}
      <nav className="fixed top-7 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-white">{displayName.split('.')[0]}</span>
                <span className="text-primary">.{displayName.split('.')[1] || 'AI'}</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={ROOT_DOMAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-accent hover:text-white transition-colors flex items-center gap-1"
              >
                Acquire Domain
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-border">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-sm font-medium py-2 ${
                    location.pathname === link.path ? 'text-primary' : 'text-gray-400'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="pt-24">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-lg">
                  <span className="text-white">{displayName.split('.')[0]}</span>
                  <span className="text-primary">.{displayName.split('.')[1] || 'AI'}</span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm max-w-md">
                {config?.['site.subtitle'] || 'Domain monetization platform powered by DS3'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Directory</h4>
              <ul className="space-y-2">
                <li><Link to="/companies" className="text-gray-500 hover:text-primary text-sm">Companies</Link></li>
                <li><Link to="/subdomains" className="text-gray-500 hover:text-primary text-sm">Subdomains</Link></li>
                <li><Link to="/intelligence" className="text-gray-500 hover:text-primary text-sm">Intelligence</Link></li>
                <li><Link to="/get-listed" className="text-gray-500 hover:text-primary text-sm">Get Listed</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="https://app.doma.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary text-sm">DOMA Platform</a></li>
                <li><a href="https://doma.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary text-sm">About DOMA</a></li>
                <li><a href="https://interstellar.xyz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary text-sm">Interstellar Registrar</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              Powered by DS3 — DomainSponsor 3.0
            </p>
            <p className="text-gray-600 text-xs">
              <a href="https://doma.xyz" className="text-primary hover:underline">DOMA</a> |
              <a href="https://d3.com" className="text-primary hover:underline ml-1">D3.com</a> |
              <a href="https://interstellar.xyz" className="text-primary hover:underline ml-1">Interstellar.xyz</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
