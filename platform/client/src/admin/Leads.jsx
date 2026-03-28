import { useState, useEffect } from 'react'
import { Search, Filter, Mail, Trash2, Eye } from 'lucide-react'
import { api } from '../lib/api'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    loadLeads()
  }, [typeFilter])

  const loadLeads = () => {
    const params = {}
    if (typeFilter) params.type = typeFilter

    api.getLeads(params).then(data => {
      setLeads(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      await api.deleteLead(id)
      setLeads(leads.filter(l => l.id !== id))
      if (selectedLead?.id === id) setSelectedLead(null)
    } catch (err) {
      alert('Failed to delete lead')
    }
  }

  const filtered = leads.filter(lead =>
    (lead.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
     lead.email?.toLowerCase().includes(search.toLowerCase()) ||
     lead.company_name?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Leads</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-surface border border-border rounded-lg text-white"
        >
          <option value="">All Types</option>
          <option value="listing">Listing</option>
          <option value="acquisition">Acquisition</option>
          <option value="subdomain">Subdomain</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-border/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(lead => (
                    <tr key={lead.id} className="hover:bg-border/30">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{lead.contact_name || lead.company_name || '-'}</p>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`
                          px-2 py-1 text-xs rounded-full
                          ${lead.lead_type === 'acquisition' ? 'bg-accent/10 text-accent' :
                            lead.lead_type === 'listing' ? 'bg-primary/10 text-primary' :
                            lead.lead_type === 'subdomain' ? 'bg-secondary/10 text-secondary' :
                            'bg-gray-500/10 text-gray-400'}
                        `}>
                          {lead.lead_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-2 text-gray-400 hover:text-primary"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No leads found
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <div className="w-80 bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                &times;
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="text-white">{selectedLead.contact_name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Company</p>
                <p className="text-white">{selectedLead.company_name || selectedLead.company || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p className="text-white capitalize">{selectedLead.lead_type}</p>
              </div>
              {selectedLead.message && (
                <div>
                  <p className="text-gray-400">Message</p>
                  <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              )}
              {selectedLead.description && (
                <div>
                  <p className="text-gray-400">Description</p>
                  <p className="text-white whitespace-pre-wrap">{selectedLead.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
