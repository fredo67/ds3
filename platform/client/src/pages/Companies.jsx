import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building, Search } from 'lucide-react'
import { api } from '../lib/api'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getListings().then(data => {
      setCompanies(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display font-bold text-4xl text-white mb-8">Company Directory</h1>
        
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-white"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border p-6 animate-pulse">
                <div className="h-6 bg-border rounded w-3/4 mb-4" />
                <div className="h-4 bg-border rounded w-full mb-2" />
                <div className="h-4 bg-border rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(company => (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="bg-surface rounded-lg border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{company.company_name}</h3>
                    {company.key_stat && (
                      <p className="text-xs text-success">{company.key_stat}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{company.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
