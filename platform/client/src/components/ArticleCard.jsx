import { FileText, Calendar, ArrowRight, ExternalLink } from 'lucide-react'

export default function ArticleCard({ article, compact = false }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-4 bg-surface rounded-lg border border-border hover:border-primary/30 transition-colors">
        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
            {article.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {article.category && (
              <span className="text-primary">{article.category}</span>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-surface rounded-xl border border-border p-6 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {article.category && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {article.category}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <Calendar className="w-3 h-3" />
                {date}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {article.excerpt || article.content?.substring(0, 150)}
          </p>
          {article.source_url ? (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
            >
              Read more <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary text-sm">
              Read more <ArrowRight className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
