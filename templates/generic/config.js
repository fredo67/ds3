// Generic vertical template config (catch-all for any domain)
export const templateConfig = {
  'site.tagline': 'The definitive AI directory',
  'site.subtitle': 'Discover the companies and technologies shaping the future',
  'site.vertical': 'generic',
  'design.template': 'minimal',
  'design.color_primary': '#00d4ff',
  'design.color_secondary': '#0066ff',
  'design.color_accent': '#ff3366',
  'design.color_success': '#00ff88',
  'vertical.categories': JSON.stringify([
    'Technology', 'Innovation', 'Enterprise', 'Startup'
  ]),
  'vertical.company_types': JSON.stringify([
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'startup', label: 'Startup' },
    { value: 'agency', label: 'Agency' }
  ]),
  'stats.items': JSON.stringify([]),
  'features.who_should_own': 'false',
  'design.show_stats_bar': 'false',
}
