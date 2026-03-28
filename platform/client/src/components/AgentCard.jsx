import { Bot, Cpu, ExternalLink } from 'lucide-react'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { DOMAIN_CONFIG } from '../lib/constants'

export default function AgentCard({ agent }) {
  const { config } = useSiteConfig()
  const domain = config?.['site.domain'] || DOMAIN_CONFIG.domain

  return (
    <div className="bg-surface rounded-xl border border-border p-5 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary" />
        </div>
        <div className="flex-1">
          <div className="font-mono text-white font-medium">
            {agent.subdomain || agent.agent_name}
          </div>
          <div className="text-xs text-gray-500">.{domain}</div>
        </div>
        {agent.type === 'agent' && (
          <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            Agent
          </span>
        )}
      </div>

      {agent.agent_description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {agent.agent_description}
        </p>
      )}

      {agent.owner_name && (
        <p className="text-gray-500 text-xs mb-3">
          by {agent.owner_name}
        </p>
      )}

      <div className="flex items-center justify-between">
        {agent.agent_endpoint && (
          <span className="text-xs text-gray-500 font-mono">
            {agent.agent_endpoint}
          </span>
        )}
        {agent.redirect_url && (
          <a
            href={agent.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary text-sm hover:underline flex items-center gap-1"
          >
            Connect <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}
