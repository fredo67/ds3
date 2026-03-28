import { useState } from 'react'
import { Building, Globe, ExternalLink, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, DOMA_CLAIM_URL } from '../lib/constants'

export default function GetListed() {
  const { config } = useSiteConfig()
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    website: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.submitLead({
        ...formData,
        lead_type: 'listing',
      })
      setSubmitted(true)
    } catch (err) {
      setError('Failed to submit. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl text-white mb-4">
            Thank You!
          </h1>
          <p className="text-gray-400">
            Your listing request has been submitted. We'll be in touch soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-4">
            Get Listed on {domain}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join the directory of companies operating in this space
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Listing Form */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-white">Directory Listing</h2>
                <p className="text-xs text-gray-400">Get featured in our directory</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
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

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Listing Request
              </button>
            </form>
          </div>

          {/* Subdomain CTA */}
          <div className="bg-surface rounded-xl border border-secondary/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-bold text-white">Claim a Subdomain</h2>
                <p className="text-xs text-gray-400">Get your verified presence</p>
              </div>
            </div>

            <p className="text-gray-400 mb-6">
              All subdomain claims for {domain} are processed through the DOMA platform.
              Get your company's verified presence at [company].{domain}
            </p>

            <a
              href={DOMA_CLAIM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-secondary text-background font-bold rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
            >
              Claim on DOMA
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
