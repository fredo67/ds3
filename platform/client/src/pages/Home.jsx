import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Shield, Globe, Bot, Building, Layers, DollarSign,
  TrendingUp, ExternalLink, Zap, Users, Cpu, FileText
} from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import {
  DOMAIN_CONFIG, ROOT_DOMAIN_URL, DOMA_CLAIM_URL, DOMA_PLATFORM_URL,
  DOMA_APP_URL, buildRootDomainUrl, buildDomaClaimUrl
} from '../lib/constants'
import StatCounter from '../components/StatCounter'
import CompanyCard from '../components/CompanyCard'
import SubdomainCard from '../components/SubdomainCard'
import AgentCard from '../components/AgentCard'
import ArticleCard from '../components/ArticleCard'

export default function Home() {
  const { config } = useSiteConfig()
  const [companies, setCompanies] = useState([])
  const [subdomains, setSubdomains] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const displayName = config?.['site.display_name'] || domain.toUpperCase()
  const tagline = config?.['copy.hero_tagline'] || config?.['site.tagline'] || 'The namespace for the future'
  const subtitle = config?.['copy.hero_subtitle'] || config?.['site.subtitle'] || ''
  const vertical = config?.['site.vertical'] || 'generic'
  const rootDomainUrl = buildRootDomainUrl(domain)
  const claimUrl = buildDomaClaimUrl(domain)

  // Parse stats from config
  const statsItems = config?.['stats.items'] ? JSON.parse(config['stats.items']) : []

  // Parse company types from config
  const companyTypes = config?.['vertical.company_types']
    ? JSON.parse(config['vertical.company_types'])
    : [{ value: 'enterprise', label: 'Enterprise' }, { value: 'startup', label: 'Startup' }]

  useEffect(() => {
    Promise.all([
      api.getListings({ limit: 6 }),
      api.getSubdomains({ limit: 8 }),
      api.getArticles({ limit: 4 })
    ]).then(([companiesData, subdomainsData, articlesData]) => {
      setCompanies(companiesData || [])
      setSubdomains(subdomainsData || [])
      setArticles(articlesData || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Split companies by type for "Who Should Own" section
  const companiesByType = companyTypes.reduce((acc, type) => {
    acc[type.value] = companies.filter(c => c.company_type === type.value)
    return acc
  }, {})

  // Get agents (subdomains with type 'agent')
  const agents = subdomains.filter(s => s.type === 'agent')
  const regularSubdomains = subdomains.filter(s => s.type !== 'agent')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Domain Name with Glow */}
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6">
            <span className="text-white">{displayName.split('.')[0]}</span>
            <span className="text-primary drop-shadow-[0_0_30px_var(--color-primary)]">
              .{displayName.split('.')[1] || 'AI'}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            {tagline}
          </p>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTAs */}
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
              href={rootDomainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-2"
            >
              Acquire This Domain
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Stats Bar */}
          {config?.['design.show_stats_bar'] !== 'false' && statsItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-8 border-t border-border">
              {statsItems.map((stat, i) => (
                <StatCounter key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Companies Section */}
      {config?.['features.directory'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-primary text-sm font-mono mb-2">
                  <Building className="w-4 h-4" />
                  DIRECTORY
                </div>
                <h2 className="font-display font-bold text-3xl text-white">
                  Featured Companies
                </h2>
              </div>
              <Link
                to="/companies"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface rounded-xl border border-border p-6 animate-pulse">
                    <div className="h-12 w-12 bg-border rounded-xl mb-4" />
                    <div className="h-6 bg-border rounded w-3/4 mb-3" />
                    <div className="h-4 bg-border rounded w-full mb-2" />
                    <div className="h-4 bg-border rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : companies.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.slice(0, 6).map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No companies listed yet</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Namespace Section (Subdomains) */}
      {config?.['features.subdomains'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm mb-4">
                <Globe className="w-4 h-4" />
                Namespace
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                The {domain} Namespace
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Verified presences on {domain}. Claim your subdomain to establish your presence in this namespace.
              </p>
            </div>

            {regularSubdomains.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {regularSubdomains.slice(0, 8).map(sub => (
                  <SubdomainCard key={sub.id} subdomain={sub} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 mb-8">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No subdomains claimed yet. Be the first!</p>
              </div>
            )}

            <div className="text-center">
              <a
                href={claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Claim Your Subdomain
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Three Revenue Layers Section */}
      {config?.['features.three_layer_model'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
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
                Ownership and usage are separate. Three stacking revenue layers transform {domain} from a parked domain into a compounding asset.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Layer 1 */}
              <div className="bg-surface p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
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

              {/* Layer 2 */}
              <div className="bg-surface p-6 rounded-xl border border-border hover:border-secondary/30 transition-colors">
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

              {/* Layer 3 */}
              <div className="bg-surface p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
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

      {/* Agent Identities Section */}
      {config?.['features.agent_namespace'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm mb-4">
                <Bot className="w-4 h-4" />
                Agentic Web
              </div>
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Agent Identities on {domain}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                AI agents don't just visit / and www. They hit api., llm., agent. subdomains. The next parking revolution: serving machines, not just humans.
              </p>
            </div>

            {agents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {agents.slice(0, 6).map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder agent cards */}
                {['api', 'llm', 'agent'].map(name => (
                  <div key={name} className="bg-surface rounded-xl border border-dashed border-border p-5 text-center">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Cpu className="w-5 h-5 text-secondary/50" />
                    </div>
                    <div className="font-mono text-gray-400">{name}.{domain}</div>
                    <div className="text-xs text-gray-500 mt-2">Available for agent registration</div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              <Link
                to="/get-listed"
                className="text-secondary hover:underline flex items-center gap-1 justify-center"
              >
                Register an agent identity <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Who Should Own Section */}
      {config?.['features.who_should_own'] !== 'false' && companyTypes.length >= 2 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Who Should Own {domain}?
              </h2>
              <p className="text-gray-400">
                Two paths to domain ownership — which one fits your strategy?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {companyTypes.slice(0, 2).map((type, idx) => (
                <div key={type.value} className="bg-surface rounded-xl border border-border p-6">
                  <div className={`text-sm font-mono mb-4 ${idx === 0 ? 'text-primary' : 'text-accent'}`}>
                    {idx === 0 ? 'DISRUPTORS' : 'INCUMBENTS'}
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">{type.label}</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {idx === 0
                      ? `Companies born in the ${vertical === 'generic' ? '' : vertical + ' '}AI era. Need the namespace to cement authority.`
                      : 'Industry titans that need to signal AI transformation. Own the category-defining domain.'
                    }
                  </p>
                  {companiesByType[type.value]?.length > 0 ? (
                    <div className="space-y-2">
                      {companiesByType[type.value].slice(0, 4).map(company => (
                        <Link
                          key={company.id}
                          to={`/companies/${company.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-border transition-colors"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <Building className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-white text-sm">{company.company_name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Companies in this category could claim {domain}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Intelligence Section */}
      {config?.['features.intelligence'] !== 'false' && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface/50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 text-primary text-sm font-mono mb-2">
                  <FileText className="w-4 h-4" />
                  INTELLIGENCE
                </div>
                <h2 className="font-display font-bold text-3xl text-white">
                  Latest News & Analysis
                </h2>
              </div>
              <Link
                to="/intelligence"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="space-y-4">
                {articles.slice(0, 4).map(article => (
                  <ArticleCard key={article.id} article={article} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No articles yet</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Get Listed CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-4">
              Is your company in the {vertical === 'generic' ? 'industry' : vertical} space?
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Get listed on {domain}. Join the directory, claim your subdomain, and establish your presence in this namespace.
            </p>
            <Link
              to="/get-listed"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get Listed
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Domain Acquisition Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/30 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
                  {domain} is available
                </h2>
                <p className="text-gray-400 max-w-xl">
                  Acquire the entire namespace or participate fractionally. Secured by {DOMAIN_CONFIG.registrar} — ICANN-accredited (IANA #{DOMAIN_CONFIG.ianaId}).
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={rootDomainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  Direct Offer
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={DOMA_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-accent text-accent font-bold rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-center gap-2"
                >
                  Fractional on DOMA
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
