import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Building, ArrowLeft, Globe, MapPin, Users, Calendar, ExternalLink, Mail } from 'lucide-react'
import { api } from '../lib/api'
import { ROOT_DOMAIN_URL } from '../lib/constants'

export default function CompanyDetail() {
  const { slug } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getListing(slug).then(data => {
      setCompany(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-1/3 mb-4" />
            <div className="h-4 bg-border rounded w-full mb-2" />
            <div className="h-4 bg-border rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold text-3xl text-white mb-4">Company Not Found</h1>
          <Link to="/companies" className="text-primary hover:underline">
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/companies" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="bg-surface rounded-xl border border-border p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl text-white mb-2">
                {company.company_name}
              </h1>
              {company.key_stat && (
                <p className="text-success font-mono">{company.key_stat}</p>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-6">{company.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {company.hq_location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{company.hq_location}</span>
              </div>
            )}
            {company.founded && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Founded {company.founded}</span>
              </div>
            )}
            {company.employees && (
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">{company.employees} employees</span>
              </div>
            )}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">Website</span>
              </a>
            )}
          </div>

          {company.categories && (
            <div className="flex flex-wrap gap-2">
              {JSON.parse(company.categories).map(cat => (
                <span key={cat} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface rounded-xl border border-accent/30 p-6 text-center">
          <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
          <h3 className="font-bold text-white mb-2">Contact via Domain</h3>
          <p className="text-gray-400 text-sm mb-4">
            Reach out through the official domain contact
          </p>
          <a
            href={ROOT_DOMAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-accent text-background font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Contact
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
