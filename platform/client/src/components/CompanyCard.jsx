import { Link } from 'react-router-dom'
import { Building, ExternalLink } from 'lucide-react'

export default function CompanyCard({ company, showType = true }) {
  const categories = company.categories ? JSON.parse(company.categories) : []

  return (
    <Link
      to={`/companies/${company.slug}`}
      className="group bg-surface rounded-xl border border-border p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Building className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
              {company.company_name}
            </h3>
            {showType && company.company_type && (
              <span className="text-xs text-gray-500 capitalize">{company.company_type}</span>
            )}
          </div>
        </div>
        {company.featured === 1 && (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
            Featured
          </span>
        )}
      </div>

      {company.key_stat && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-success/10 text-success text-sm font-mono rounded">
            {company.key_stat}
          </span>
        </div>
      )}

      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
        {company.description}
      </p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 3).map(cat => (
            <span key={cat} className="px-2 py-1 bg-border text-gray-400 text-xs rounded">
              {cat}
            </span>
          ))}
          {categories.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{categories.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
