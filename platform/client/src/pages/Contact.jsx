import { useState } from 'react'
import { Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function Contact() {
  const { config } = useSiteConfig()
  const [formData, setFormData] = useState({
    contact_name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const contactEmail = config?.['site.contact_email'] || `info@${domain}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.submitLead({
        ...formData,
        lead_type: 'contact',
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
            Message Sent
          </h1>
          <p className="text-gray-400">
            Thank you for reaching out. We'll get back to you soon.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400">
            Questions about {domain}? Get in touch.
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-white">Send a Message</h2>
              <p className="text-xs text-gray-400">We'll respond as soon as possible</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              Send Message
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-gray-500 text-sm">
              Or email us directly at{' '}
              <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                {contactEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
