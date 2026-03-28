// Defense vertical template config (e.g., military.ai)
export const templateConfig = {
  'site.tagline': 'The namespace for the future of battlespaces',
  'site.subtitle': 'Tracking the companies, contracts, and technologies reshaping modern warfare',
  'site.vertical': 'defense',
  'design.template': 'command-center',
  'design.color_primary': '#00d4ff',
  'design.color_secondary': '#0066ff',
  'design.color_accent': '#ff3366',
  'vertical.categories': JSON.stringify([
    'Autonomous Systems', 'Counter-UAS', 'AI/ML', 'Cybersecurity',
    'Space', 'Robotics', 'Electronic Warfare', 'Command & Control'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'disruptor', label: 'Disruptor' },
    { value: 'legacy', label: 'Legacy Prime' },
    { value: 'startup', label: 'Startup' }
  ]),
  'stats.items': JSON.stringify([
    { value: '$20B', label: 'Largest AI Defense Contract' },
    { value: '$60B', label: 'Top Startup Valuation' },
    { value: '$886B', label: 'Global Defense Market' },
    { value: '$150B', label: 'US Defense Modernization' }
  ]),
}
