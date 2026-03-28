// Legal vertical template config (e.g., legal.ai)
export const templateConfig = {
  'site.tagline': 'The definitive directory for AI-powered legal',
  'site.subtitle': 'Tracking the companies and tools transforming legal practice with AI',
  'site.vertical': 'legal',
  'design.template': 'corporate',
  'design.color_primary': '#4a90d9',
  'design.color_secondary': '#2c5282',
  'design.color_accent': '#c0392b',
  'vertical.categories': JSON.stringify([
    'Contract Analysis', 'Legal Research', 'eDiscovery', 'Compliance',
    'Litigation', 'IP', 'Corporate', 'Employment Law', 'Document Drafting'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'disruptor', label: 'Legal Tech' },
    { value: 'incumbent', label: 'Incumbent' },
    { value: 'startup', label: 'Startup' }
  ]),
  'stats.items': JSON.stringify([
    { value: '$650M', label: 'Harvey AI Funding' },
    { value: '$10B', label: 'Legal Tech Market' },
    { value: '50%', label: 'Tasks Automatable' },
    { value: '100K+', label: 'Lawyers Using AI' }
  ]),
}
