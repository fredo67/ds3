import { Globe, ExternalLink, CheckCircle } from 'lucide-react'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG, DOMA_CLAIM_URL, buildDomaClaimUrl } from '../lib/constants'

export default function SubdomainCard({ subdomain, compact = false }) {
  const { config } = useSiteConfig()
  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain
  const claimUrl = buildDomaClaimUrl(domain)

  const isClaimed = subdomain.status === 'claimed'

  if (compact) {
    return (
      <div className={`
        flex items-center justify-between p-3 rounded-lg border transition-colors
        ${isClaimed
          ? 'bg-surface border-success/20 hover:border-success/40'
          : 'bg-surface border-border hover:border-primary/30'
        }
      `}>
        <div className="flex items-center gap-2">
          <Globe className={`w-4 h-4 ${isClaimed ? 'text-success' : 'text-gray-400'}`} />
          <span className="font-mono text-sm text-white">
            {subdomain.subdomain}.{domain}
          </span>
        </div>
        {isClaimed ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <a
            href={claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Claim
          </a>
        )}
      </div>
    )
  }

  return (
    <div className={`
      bg-surface rounded-xl border p-5 transition-all duration-300
      ${isClaimed
        ? 'border-success/30 hover:border-success/50'
        : 'border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
      }
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${isClaimed ? 'bg-success/10' : 'bg-primary/10'}
          `}>
            <Globe className={`w-5 h-5 ${isClaimed ? 'text-success' : 'text-primary'}`} />
          </div>
          <div>
            <div className="font-mono text-white font-medium">
              {subdomain.subdomain}
            </div>
            <div className="text-xs text-gray-500">.{domain}</div>
          </div>
        </div>
        {isClaimed && (
          <span className="flex items-center gap-1 text-xs text-success">
            <CheckCircle className="w-3 h-3" />
            Claimed
          </span>
        )}
      </div>

      {subdomain.owner_name && (
        <p className="text-gray-300 text-sm mb-3">{subdomain.owner_name}</p>
      )}

      {subdomain.type && (
        <span className="inline-block px-2 py-1 bg-border text-gray-400 text-xs rounded mb-3 capitalize">
          {subdomain.type}
        </span>
      )}

      {isClaimed && subdomain.redirect_url ? (
        <a
          href={subdomain.redirect_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary text-sm hover:underline"
        >
          Visit <ExternalLink className="w-3 h-3" />
        </a>
      ) : !isClaimed && (
        <a
          href={claimUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Claim This Subdomain
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}
