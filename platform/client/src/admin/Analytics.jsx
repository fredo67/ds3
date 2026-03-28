import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Globe, DollarSign } from 'lucide-react'
import { api } from '../lib/api'

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAnalytics().then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display font-bold text-2xl text-white">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-border p-6 animate-pulse">
              <div className="h-4 bg-border rounded w-1/2 mb-2" />
              <div className="h-8 bg-border rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const summaryCards = [
    { label: 'Total Leads', value: stats?.leads?.total || 0, icon: Users, color: 'primary', change: '+12%' },
    { label: 'Listings', value: stats?.listings || 0, icon: BarChart3, color: 'secondary', change: '+5%' },
    { label: 'Subdomains Claimed', value: stats?.subdomains?.claimed || 0, icon: Globe, color: 'success', change: '+8%' },
    { label: 'Acquisition Leads', value: stats?.leads?.acquisition || 0, icon: DollarSign, color: 'accent', change: '+3%' },
  ]

  const leadsByType = [
    { type: 'Listing', count: stats?.leads?.listing || 0, color: 'bg-primary' },
    { type: 'Acquisition', count: stats?.leads?.acquisition || 0, color: 'bg-accent' },
    { type: 'Subdomain', count: stats?.leads?.subdomain || 0, color: 'bg-secondary' },
    { type: 'Contact', count: stats?.leads?.contact || 0, color: 'bg-gray-500' },
  ]

  const maxLeadCount = Math.max(...leadsByType.map(l => l.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Analytics</h1>
        <div className="text-gray-400 text-sm">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-${card.color}/10 rounded-lg flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 text-${card.color}`} />
              </div>
              <span className="text-success text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {card.change}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="font-display font-bold text-3xl text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Leads by Type */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="font-bold text-lg text-white mb-6">Leads by Type</h2>
          <div className="space-y-4">
            {leadsByType.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-sm">{item.type}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(item.count / maxLeadCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subdomain Stats */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="font-bold text-lg text-white mb-6">Subdomain Overview</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  className="text-border"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeDasharray={`${((stats?.subdomains?.claimed || 0) / (stats?.subdomains?.total || 1)) * 502} 502`}
                  className="text-success"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{stats?.subdomains?.claimed || 0}</span>
                <span className="text-gray-400 text-sm">claimed</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="font-bold text-xl text-white">{stats?.subdomains?.total || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available</p>
              <p className="font-bold text-xl text-white">{stats?.subdomains?.available || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outbound Stats */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h2 className="font-bold text-lg text-white mb-6">Outbound Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-3xl font-bold text-white">{stats?.outbound?.total || 0}</p>
            <p className="text-gray-400 text-sm">Total Contacts</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-3xl font-bold text-yellow-400">{stats?.outbound?.contacted || 0}</p>
            <p className="text-gray-400 text-sm">Contacted</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-3xl font-bold text-success">{stats?.outbound?.responded || 0}</p>
            <p className="text-gray-400 text-sm">Responded</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-3xl font-bold text-primary">
              {stats?.outbound?.total
                ? Math.round((stats.outbound.responded / stats.outbound.total) * 100)
                : 0}%
            </p>
            <p className="text-gray-400 text-sm">Response Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
