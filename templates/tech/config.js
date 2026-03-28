// Tech vertical template config (e.g., developer.ai, software.ai)
export const templateConfig = {
  'site.tagline': 'The definitive directory for AI-powered software',
  'site.subtitle': 'Discover the tools and platforms transforming how developers build',
  'site.vertical': 'tech',
  'design.template': 'minimal',
  'design.color_primary': '#00d4ff',
  'design.color_secondary': '#7c3aed',
  'design.color_accent': '#f97316',
  'vertical.categories': JSON.stringify([
    'Dev Tools', 'AI/ML', 'Cloud Infrastructure', 'DevOps',
    'APIs', 'Databases', 'Security', 'Observability'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'platform', label: 'Platform' },
    { value: 'startup', label: 'Startup' },
    { value: 'enterprise', label: 'Enterprise' }
  ]),
  'stats.items': JSON.stringify([
    { value: '28M', label: 'GitHub Copilot Users' },
    { value: '$100B+', label: 'Dev Tools Market' },
    { value: '70%', label: 'Using AI Code Tools' },
    { value: '1B+', label: 'API Calls/Day' }
  ]),
}
