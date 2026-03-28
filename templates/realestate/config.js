// Real Estate vertical template config (e.g., property.ai, homes.ai)
export const templateConfig = {
  'site.tagline': 'The definitive directory for AI-powered real estate',
  'site.subtitle': 'Discover the platforms transforming property with artificial intelligence',
  'site.vertical': 'realestate',
  'design.template': 'corporate',
  'design.color_primary': '#8b5cf6',
  'design.color_secondary': '#6366f1',
  'design.color_accent': '#f59e0b',
  'vertical.categories': JSON.stringify([
    'PropTech', 'Brokerage', 'Mortgage', 'Property Management',
    'Valuation', 'Investment', 'Commercial', 'Residential'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'proptech', label: 'PropTech' },
    { value: 'brokerage', label: 'Brokerage' },
    { value: 'startup', label: 'Startup' }
  ]),
  'stats.items': JSON.stringify([
    { value: '$2.6T', label: 'US RE Transaction Volume' },
    { value: '$30B', label: 'PropTech Investment' },
    { value: '65%', label: 'Agents Using AI' },
    { value: '20M+', label: 'Monthly Zillow Visits' }
  ]),
}
