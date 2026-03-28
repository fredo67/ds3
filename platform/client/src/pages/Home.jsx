import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, Bot, Building, Layers, DollarSign, TrendingUp, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, ROOT_DOMAIN_URL, DOMA_CLAIM_URL, DOMA_PLATFORM_URL } from '../lib/constants'

export default function Home() {
  const { config } = useSiteConfig()
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const displayName = config?.['site.display_name'] || domain.toUpperCase()
  const tagline = config?.['copy.hero_tagline'] || config?.['site.tagline'] || 'The namespace for the future'
  const subtitle = config?.['copy.hero_subtitle'] || config?.['site.subtitle'] || ''

  useEffect(() => {
    api.getListings({ featured: 'true', limit: 6 }).then(data => {
      setCompanies(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grid-pattern">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6">
            <span className="text-white">{displayName.split('.')[0]}</span>
            <span className="text-primary glow-cyan">.{displayName.split('.')[1] || 'AI'}</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            {tagline}
          </p>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/companies"
              className="px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Explore Companies
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/get-listed"
              className="px-8 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors"
            >
              Get Listed
            </Link>
            <a
              href={ROOT_DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-2"
            >
              Acquire This Domain
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Three Revenue Layers Section */}
      {config?.['features.three_layer_model'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full text-success text-sm mb-6">
                <Layers className="w-4 h-4" />
                Revenue Engine
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                From Locked Asset to Cash Machine
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Three stacking revenue layers that transform {domain} from a parked domain into a compounding asset
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs text-primary font-mono mb-2">LAYER 1</div>
                <h3 className="font-bold text-xl text-white mb-3">Traffic Revenue</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Keep your existing parking provider. We don't touch root traffic — your parking revenue stays yours.
                </p>
                <div className="text-xs text-gray-500">
                  <span className="text-success">UNCHANGED</span> — compatible with all providers
                </div>
              </div>

              <div className="bg-background p-6 rounded-xl border border-border hover:border-secondary/30 transition-colors">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-xs text-secondary font-mono mb-2">LAYER 2</div>
                <h3 className="font-bold text-xl text-white mb-3">Subdomain Revenue</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sell verified presences via DOMA. Companies claim [company].{domain} for microsites or redirects.
                </p>
                <div className="text-xs text-gray-500">
                  <span className="text-secondary">NEW/ADDITIVE</span> — powered by DOMA
                </div>
              </div>

              <div className="bg-background p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div className="text-xs text-accent font-mono mb-2">LAYER 3</div>
                <h3 className="font-bold text-xl text-white mb-3">Fractional Trading</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sell up to 49% via DOMA token. Earn basis points on every trade. BIN preserved.
                </p>
                <div className="text-xs text-gray-500">
                  <span className="text-accent">NEW/ADDITIVE</span> — tokenized equity
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <a
                href={DOMA_PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
              >
                Learn more about DOMA's domain revenue stack
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Ready to monetize your domain?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            DS3 turns any domain into a multi-layer revenue generator. Connect via Micro Vault, pick a template, and go live in minutes.
          </p>
          <a
            href="https://app.doma.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started on DOMA
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  )
}
