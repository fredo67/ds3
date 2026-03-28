// DS3 Platform Constants
// These are fallback defaults - actual values come from site_config database

export const DOMAIN_CONFIG = {
  // Fallback domain (should be overridden by site_config)
  domain: 'example.ai',

  // DOMA platform URLs
  domaAppUrl: 'https://app.doma.xyz',
  domaPlatformUrl: 'https://doma.xyz',

  // Registrar info
  registrar: 'Interstellar.xyz',
  registrarUrl: 'https://interstellar.xyz',
  ianaId: '3784',

  // Fractional ownership limits
  maxFractionPercent: 49,
}

// Build URLs dynamically based on config
export const buildRootDomainUrl = (domain) => `https://${domain}`
export const buildDomaClaimUrl = (domain) => `https://app.doma.xyz/subdomain-claim/${domain}`

// These are computed from config at runtime - use config values when available
export const ROOT_DOMAIN_URL = buildRootDomainUrl(DOMAIN_CONFIG.domain)
export const DOMA_CLAIM_URL = buildDomaClaimUrl(DOMAIN_CONFIG.domain)
export const DOMA_PLATFORM_URL = DOMAIN_CONFIG.domaPlatformUrl
export const DOMA_APP_URL = DOMAIN_CONFIG.domaAppUrl

// Vertical presets - used when owner selects a vertical
export const VERTICAL_PRESETS = {
  defense: {
    tagline: 'The namespace for defense innovation',
    categories: ['Autonomous Systems', 'Counter-UAS', 'AI/ML', 'Cybersecurity', 'Space', 'Robotics'],
    companyTypes: ['Disruptor', 'Legacy Prime', 'Startup'],
    template: 'command-center',
  },
  finance: {
    tagline: 'The namespace for financial services',
    categories: ['Banking', 'Insurance', 'Fintech', 'Payments', 'Wealth Management', 'Trading'],
    companyTypes: ['Bank', 'Fintech', 'Startup', 'Investment Firm'],
    template: 'corporate',
  },
  legal: {
    tagline: 'The namespace for legal services',
    categories: ['Litigation', 'Corporate', 'IP', 'Compliance', 'Legal Tech', 'Consulting'],
    companyTypes: ['Law Firm', 'Legal Tech', 'Consulting', 'Alternative Legal'],
    template: 'corporate',
  },
  tech: {
    tagline: 'The namespace for technology',
    categories: ['SaaS', 'Infrastructure', 'AI/ML', 'Developer Tools', 'Cloud', 'Security'],
    companyTypes: ['Enterprise', 'Startup', 'Open Source', 'Platform'],
    template: 'minimal',
  },
  healthcare: {
    tagline: 'The namespace for healthcare innovation',
    categories: ['Biotech', 'Medical Devices', 'Digital Health', 'Pharma', 'Diagnostics', 'Telehealth'],
    companyTypes: ['Biotech', 'Medtech', 'Digital Health', 'Pharma'],
    template: 'corporate',
  },
  realestate: {
    tagline: 'The namespace for real estate',
    categories: ['Residential', 'Commercial', 'PropTech', 'Investment', 'Development', 'Management'],
    companyTypes: ['Brokerage', 'Developer', 'PropTech', 'REIT'],
    template: 'corporate',
  },
  generic: {
    tagline: 'The premium namespace',
    categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    companyTypes: ['Enterprise', 'Startup', 'Agency', 'Platform'],
    template: 'minimal',
  },
}

// Template definitions
export const TEMPLATES = {
  'command-center': {
    name: 'Command Center',
    description: 'Dark, tactical, futuristic. HUD-style panels, cyan/blue glow accents.',
    bestFor: 'Defense, cybersecurity, space, intelligence',
  },
  corporate: {
    name: 'Corporate',
    description: 'Clean, professional, trust-building. Subtle gradients, sharp cards.',
    bestFor: 'Finance, legal, insurance, banking',
  },
  minimal: {
    name: 'Minimal',
    description: 'Ultra-clean, whitespace-heavy. Content speaks for itself.',
    bestFor: 'Tech, SaaS, developer tools',
  },
  bold: {
    name: 'Bold',
    description: 'High contrast, dramatic. Large typography, bold color blocks.',
    bestFor: 'Consumer brands, media, entertainment',
  },
  editorial: {
    name: 'Editorial',
    description: 'Magazine-style layout. Rich typography, article-first.',
    bestFor: 'News, research, analysis',
  },
}
