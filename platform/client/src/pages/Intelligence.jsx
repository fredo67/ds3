import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Calendar, Tag, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function Intelligence() {
  const { config } = useSiteConfig()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  useEffect(() => {
    api.getArticles().then(data => {
      setArticles(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl text-white mb-4">
            Intelligence
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            News, analysis, and insights from the {domain.split('.')[0]} sector
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface rounded-lg border border-border p-6 animate-pulse">
                <div className="h-6 bg-border rounded w-3/4 mb-4" />
                <div className="h-4 bg-border rounded w-full mb-2" />
                <div className="h-4 bg-border rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map(article => (
              <article
                key={article.id}
                className="bg-surface rounded-lg border border-border p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-white mb-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {article.excerpt || article.content?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      {article.published_at && (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      )}
                      {article.category && (
                        <span className="flex items-center gap-1 text-primary">
                          <Tag className="w-4 h-4" />
                          {article.category}
                        </span>
                      )}
                      {article.source_url && (
                        <a
                          href={article.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-400 hover:text-white"
                        >
                          Read more <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No articles yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
