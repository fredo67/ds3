import { useState, useEffect } from 'react'
import { DollarSign, Mail, Eye, CheckCircle, Clock, XCircle } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function Acquisitions() {
  const { config } = useSiteConfig()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState(null)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const binPrice = config?.['domain.bin_price'] || 'Not set'

  useEffect(() => {
    api.getLeads({ type: 'acquisition' }).then(data => {
      setLeads(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateLead(id, { status })
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l))
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status })
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'contacted':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'negotiating':
        return <DollarSign className="w-4 h-4 text-primary" />
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Acquisition Leads</h1>
        <div className="bg-surface px-4 py-2 rounded-lg border border-accent/30">
          <span className="text-gray-400 text-sm">BIN Price: </span>
          <span className="text-accent font-bold">{binPrice}</span>
        </div>
      </div>

      {/* Domain Info */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">{domain}</h2>
            <p className="text-gray-400 text-sm">
              {leads.length} acquisition {leads.length === 1 ? 'inquiry' : 'inquiries'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-border/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Contact</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Company</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-border/30">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{lead.contact_name || '-'}</p>
                        <p className="text-gray-400 text-sm">{lead.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {lead.company || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm">
                          {getStatusIcon(lead.status)}
                          <span className="capitalize">{lead.status || 'new'}</span>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No acquisition inquiries yet
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <div className="w-80 bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Inquiry Details</h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-sm mb-6">
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
                <p className="text-white">{selectedLead.company || '-'}</p>
              </div>
              {selectedLead.message && (
                <div>
                  <p className="text-gray-400">Message</p>
                  <p className="text-white whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {['new', 'contacted', 'negotiating', 'closed', 'lost'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedLead.id, status)}
                    className={`
                      px-3 py-1.5 text-xs rounded-lg border capitalize
                      ${selectedLead.status === status
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-gray-400 hover:border-gray-400'
                      }
                    `}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
