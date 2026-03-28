import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Star, Building } from 'lucide-react'
import { api } from '../lib/api'

export default function Listings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingListing, setEditingListing] = useState(null)

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = () => {
    api.getListings().then(data => {
      setListings(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      await api.deleteListing(id)
      setListings(listings.filter(l => l.id !== id))
    } catch (err) {
      alert('Failed to delete listing')
    }
  }

  const handleToggleFeatured = async (listing) => {
    try {
      await api.updateListing(listing.id, { featured: listing.featured ? 0 : 1 })
      loadListings()
    } catch (err) {
      alert('Failed to update listing')
    }
  }

  const filtered = listings.filter(listing =>
    listing.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-white">Listings</h1>
        <button
          onClick={() => { setEditingListing(null); setShowForm(true) }}
          className="px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-white"
        />
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
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Company</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-400 font-medium">Key Stat</th>
                  <th className="text-center px-4 py-3 text-sm text-gray-400 font-medium">Featured</th>
                  <th className="text-right px-4 py-3 text-sm text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(listing => (
                  <tr key={listing.id} className="hover:bg-border/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <Building className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{listing.company_name}</p>
                          <p className="text-gray-400 text-xs">{listing.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-400 rounded-full">
                        {listing.company_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-success text-sm">
                      {listing.key_stat || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(listing)}
                        className={`p-1 ${listing.featured ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                      >
                        <Star className={`w-5 h-5 ${listing.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingListing(listing); setShowForm(true) }}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
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
            No listings found
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <ListingForm
          listing={editingListing}
          onClose={() => { setShowForm(false); setEditingListing(null) }}
          onSave={() => { loadListings(); setShowForm(false); setEditingListing(null) }}
        />
      )}
    </div>
  )
}

function ListingForm({ listing, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company_name: listing?.company_name || '',
    slug: listing?.slug || '',
    description: listing?.description || '',
    company_type: listing?.company_type || '',
    key_stat: listing?.key_stat || '',
    website: listing?.website || '',
    hq_location: listing?.hq_location || '',
    founded: listing?.founded || '',
    employees: listing?.employees || '',
    categories: listing?.categories || '[]',
    featured: listing?.featured || 0,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (listing) {
        await api.updateListing(listing.id, formData)
      } else {
        await api.createListing(formData)
      }
      onSave()
    } catch (err) {
      alert('Failed to save listing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-xl text-white">
            {listing ? 'Edit Listing' : 'Add Listing'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="company-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                value={formData.company_type}
                onChange={(e) => setFormData({ ...formData, company_type: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              >
                <option value="">Select type</option>
                <option value="disruptor">Disruptor</option>
                <option value="legacy">Legacy Prime</option>
                <option value="startup">Startup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Key Stat</label>
              <input
                type="text"
                value={formData.key_stat}
                onChange={(e) => setFormData({ ...formData, key_stat: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="$60B Valuation"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">HQ Location</label>
              <input
                type="text"
                value={formData.hq_location}
                onChange={(e) => setFormData({ ...formData, hq_location: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Founded</label>
              <input
                type="text"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="2017"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Employees</label>
              <input
                type="text"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                placeholder="1000+"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked ? 1 : 0 })}
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-gray-400 text-sm">Featured listing</label>
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
