import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Building, Globe, DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getAdminStats(),
      api.getLeads({ limit: 5 })
    ]).then(([statsData, leadsData]) => {
      setStats(statsData)
      setRecentLeads(leadsData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
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

  const statCards = [
    { label: 'Total Leads', value: stats?.leads?.total || 0, icon: Users, color: 'primary' },
    { label: 'Listings', value: stats?.listings || 0, icon: Building, color: 'secondary' },
    { label: 'Subdomains', value: stats?.subdomains?.total || 0, icon: Globe, color: 'success' },
    { label: 'Acquisition Leads', value: stats?.leads?.acquisition || 0, icon: DollarSign, color: 'accent' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <stat.icon className={`w-5 h-5 text-${stat.color}`} />
            </div>
            <p className="font-display font-bold text-3xl text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-white">Recent Leads</h2>
          <Link to="/admin/leads" className="text-primary text-sm flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentLeads.length > 0 ? (
          <div className="divide-y divide-border">
            {recentLeads.map(lead => (
              <div key={lead.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{lead.contact_name || lead.company_name || 'Unknown'}</p>
                  <p className="text-gray-400 text-sm">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${lead.lead_type === 'acquisition' ? 'bg-accent/10 text-accent' :
                      lead.lead_type === 'listing' ? 'bg-primary/10 text-primary' :
                      'bg-gray-500/10 text-gray-400'}
                  `}>
                    {lead.lead_type}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No leads yet
          </div>
        )}
      </div>
    </div>
  )
}
