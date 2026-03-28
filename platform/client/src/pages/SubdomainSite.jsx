import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Globe, ArrowLeft, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function SubdomainSite() {
  const { subdomain } = useParams()
  const { config } = useSiteConfig()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    api.getSubdomain(subdomain).then(data => {
      setData(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [subdomain])

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-1/3 mb-4" />
            <div className="h-4 bg-border rounded w-full mb-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl text-white mb-4">
            Subdomain Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            {subdomain}.{domain} is not currently claimed
          </p>
          <Link to="/subdomains" className="text-primary hover:underline">
            Browse Available Subdomains
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/subdomains" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            {subdomain}.{domain}
          </h1>

          {data.owner_name && (
            <p className="text-gray-300 text-lg mb-4">{data.owner_name}</p>
          )}

          {data.status === 'claimed' && data.redirect_url && (
            <a
              href={data.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Visit Site
              <ExternalLink className="w-5 h-5" />
            </a>
          )}

          {data.status === 'available' && (
            <p className="text-gray-400">This subdomain is available for claiming</p>
          )}
        </div>
      </div>
    </div>
  )
}
