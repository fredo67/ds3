// Finance vertical template config (e.g., credit.ai, mortgage.ai)
export const templateConfig = {
  'site.tagline': 'The definitive directory for AI-powered finance',
  'site.subtitle': 'Tracking the companies, products, and innovations reshaping credit and lending',
  'site.vertical': 'finance',
  'design.template': 'corporate',
  'design.color_primary': '#00d4ff',
  'design.color_secondary': '#0066ff',
  'design.color_accent': '#ff3366',
  'design.color_success': '#00ff88',
  'vertical.categories': JSON.stringify([
    'Credit Cards', 'Banking', 'Lending', 'BNPL', 'Credit Scoring',
    'Fraud Detection', 'Payments', 'Insurance', 'Wealth Management'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'disruptor', label: 'Fintech' },
    { value: 'incumbent', label: 'Legacy Bank' },
    { value: 'startup', label: 'Startup' }
  ]),
  'stats.items': JSON.stringify([
    { value: '$8.1B', label: 'Credit Karma Acquisition' },
    { value: '$12B', label: 'Brex Valuation' },
    { value: '$5.5T', label: 'US Consumer Credit' },
    { value: '850M', label: 'Credit Cards in Circulation' }
  ]),
}
