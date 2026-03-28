import { useState } from 'react'
import { DollarSign, Shield, CheckCircle, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, ROOT_DOMAIN_URL } from '../lib/constants'

export default function Acquire() {
  const { config } = useSiteConfig()
  const [formData, setFormData] = useState({
    contact_name: '',
    email: '',
    company: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const binPrice = config?.['domain.bin_price'] || 'Contact for pricing'
  const escrowProvider = config?.['site.escrow_provider'] || 'Escrow.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.submitLead({
        ...formData,
        lead_type: 'acquisition',
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
            Inquiry Received
          </h1>
          <p className="text-gray-400">
            Thank you for your interest in {domain}. We'll be in touch shortly.
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
            Acquire {domain}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Premium domain available for acquisition
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-accent/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-xs text-gray-400">Buy It Now Price</p>
                  <p className="font-display font-bold text-2xl text-white">{binPrice}</p>
                </div>
              </div>
              <a
                href={ROOT_DOMAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                View on {domain}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-white">Secure Transaction</h3>
              </div>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Escrow protection via {escrowProvider}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Domain transfer within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Full ownership verification</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-bold text-xl text-white mb-6">Make an Offer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Name</label>
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
                <label className="block text-sm text-gray-400 mb-1">Company (optional)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white resize-none"
                  placeholder="Include your offer amount or any questions..."
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
