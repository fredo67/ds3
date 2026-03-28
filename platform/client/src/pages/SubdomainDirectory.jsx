import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Globe, Search, ExternalLink, CheckCircle, Clock } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, DOMA_CLAIM_URL } from '../lib/constants'

export default function SubdomainDirectory() {
  const { config } = useSiteConfig()
  const [subdomains, setSubdomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    api.getSubdomains().then(data => {
      setSubdomains(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = subdomains.filter(s =>
    s.subdomain.toLowerCase().includes(search.toLowerCase()) ||
    (s.owner_name && s.owner_name.toLowerCase().includes(search.toLowerCase()))
  )

  const claimed = filtered.filter(s => s.status === 'claimed')
  const available = filtered.filter(s => s.status === 'available')

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-4">
            Subdomain Directory
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Verified presences on {domain}. Claim your subdomain through DOMA.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search subdomains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-white"
            />
          </div>
          <a
            href={DOMA_CLAIM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Claim a Subdomain
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border p-4 animate-pulse">
                <div className="h-5 bg-border rounded w-2/3 mb-2" />
                <div className="h-4 bg-border rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {claimed.length > 0 && (
              <div className="mb-12">
                <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Claimed ({claimed.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {claimed.map(sub => (
                    <div
                      key={sub.id}
                      className="bg-surface rounded-lg border border-success/30 p-4 hover:border-success/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-success" />
                        <span className="font-mono text-white">
                          {sub.subdomain}.{domain}
                        </span>
                      </div>
                      {sub.owner_name && (
                        <p className="text-gray-400 text-sm">{sub.owner_name}</p>
                      )}
                      {sub.redirect_url && (
                        <a
                          href={sub.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-xs hover:underline flex items-center gap-1 mt-2"
                        >
                          Visit <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {available.length > 0 && (
              <div>
                <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  Available ({available.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {available.map(sub => (
                    <div
                      key={sub.id}
                      className="bg-surface rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-gray-300">
                            {sub.subdomain}.{domain}
                          </span>
                        </div>
                        <a
                          href={DOMA_CLAIM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Claim
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No subdomains found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
