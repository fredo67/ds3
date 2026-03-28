import { useState, useEffect } from 'react'
import { Search, Globe, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function AdminSubdomains() {
  const { config } = useSiteConfig()
  const [subdomains, setSubdomains] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    loadSubdomains()
  }, [statusFilter])

  const loadSubdomains = () => {
    const params = {}
    if (statusFilter) params.status = statusFilter

    api.getSubdomains(params).then(data => {
      setSubdomains(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const filtered = subdomains.filter(sub =>
    sub.subdomain?.toLowerCase().includes(search.toLowerCase()) ||
    sub.owner_name?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: subdomains.length,
    claimed: subdomains.filter(s => s.status === 'claimed').length,
    available: subdomains.filter(s => s.status === 'available').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Subdomains</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="font-bold text-2xl text-white">{stats.total}</p>
        </div>
        <div className="bg-surface rounded-lg border border-success/30 p-4">
          <p className="text-gray-400 text-sm">Claimed</p>
          <p className="font-bold text-2xl text-success">{stats.claimed}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-gray-400 text-sm">Available</p>
          <p className="font-bold text-2xl text-white">{stats.available}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-border rounded-lg text-white"
        >
          <option value="">All Status</option>
          <option value="claimed">Claimed</option>
          <option value="available">Available</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Subdomain</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Redirect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-border/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${sub.status === 'claimed' ? 'text-success' : 'text-gray-400'}`} />
                        <span className="font-mono text-white">{sub.subdomain}.{domain}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {sub.owner_name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {sub.status === 'claimed' ? (
                        <span className="flex items-center gap-1 text-success text-sm">
                          <CheckCircle className="w-4 h-4" /> Claimed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" /> Available
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm capitalize">
                      {sub.type || 'redirect'}
                    </td>
                    <td className="px-4 py-3">
                      {sub.redirect_url ? (
                        <a
                          href={sub.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary text-sm hover:underline"
                        >
                          {new URL(sub.redirect_url).hostname}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No subdomains found
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm text-center">
        Subdomain management is handled through DOMA. This view is read-only.
      </p>
    </div>
  )
}
