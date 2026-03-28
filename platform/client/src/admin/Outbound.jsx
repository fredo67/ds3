import { useState, useEffect } from 'react'
import { Send, Plus, Edit, Trash2, Mail, CheckCircle, Clock, XCircle } from 'lucide-react'
import { api } from '../lib/api'

export default function Outbound() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = () => {
    api.getOutbound().then(data => {
      setContacts(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await api.deleteOutbound(id)
      setContacts(contacts.filter(c => c.id !== id))
    } catch (err) {
      alert('Failed to delete contact')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateOutbound(id, { status })
      loadContacts()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'contacted':
        return <Clock className="w-4 h-4 text-yellow-400" />
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'not_interested':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => c.status === 'pending').length,
    contacted: contacts.filter(c => c.status === 'contacted').length,
    responded: contacts.filter(c => c.status === 'responded').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Outbound</h1>
        <button
          onClick={() => { setEditingContact(null); setShowForm(true) }}
          className="px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="font-bold text-2xl text-white">{stats.total}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-gray-400 text-sm">Pending</p>
          <p className="font-bold text-2xl text-white">{stats.pending}</p>
        </div>
        <div className="bg-surface rounded-lg border border-yellow-400/30 p-4">
          <p className="text-gray-400 text-sm">Contacted</p>
          <p className="font-bold text-2xl text-yellow-400">{stats.contacted}</p>
        </div>
        <div className="bg-surface rounded-lg border border-success/30 p-4">
          <p className="text-gray-400 text-sm">Responded</p>
          <p className="font-bold text-2xl text-success">{stats.responded}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-border/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Contact</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Company</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Priority</th>
                  <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-border/30">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{contact.contact_name}</p>
                      <p className="text-gray-400 text-sm">{contact.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{contact.company}</p>
                      <p className="text-gray-400 text-xs">{contact.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(contact.status)}
                        <select
                          value={contact.status || 'pending'}
                          onChange={(e) => handleUpdateStatus(contact.id, e.target.value)}
                          className="bg-transparent text-sm text-gray-300 border-none focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="responded">Responded</option>
                          <option value="not_interested">Not Interested</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        px-2 py-1 text-xs rounded-full
                        ${contact.priority === 'high' ? 'bg-accent/10 text-accent' :
                          contact.priority === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-gray-500/10 text-gray-400'}
                      `}>
                        {contact.priority || 'normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${contact.email}`}
                          className="p-2 text-gray-400 hover:text-primary"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => { setEditingContact(contact); setShowForm(true) }}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
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
            No outbound contacts yet
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <OutboundForm
          contact={editingContact}
          onClose={() => { setShowForm(false); setEditingContact(null) }}
          onSave={() => { loadContacts(); setShowForm(false); setEditingContact(null) }}
        />
      )}
    </div>
  )
}

function OutboundForm({ contact, onClose, onSave }) {
  const [formData, setFormData] = useState({
    contact_name: contact?.contact_name || '',
    title: contact?.title || '',
    company: contact?.company || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    notes: contact?.notes || '',
    priority: contact?.priority || 'normal',
    status: contact?.status || 'pending',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (contact) {
        await api.updateOutbound(contact.id, formData)
      } else {
        await api.createOutbound(formData)
      }
      onSave()
    } catch (err) {
      alert('Failed to save contact')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-border w-full max-w-lg">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">
            {contact ? 'Edit Contact' : 'Add Contact'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="CEO, VP BD, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Company *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border text-gray-400 rounded-lg hover:bg-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
