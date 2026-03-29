// Internet/Technology vertical template config for internet.com
export const templateConfig = {
  'site.domain': 'internet.com',
  'site.display_name': 'INTERNET.COM',
  'site.tagline': 'The original address of the Internet',
  'site.subtitle': 'Directory, intelligence hub, and namespace for the companies defining the next era of the Internet',
  'site.vertical': 'internet',
  'site.contact_email': 'info@internet.com',
  'site.escrow_provider': 'Escrow.com',

  'design.template': 'editorial',

  // Color palette: Deep space blue/black with electric blue primary, warm amber accent
  // NOT the generic cyan from military.ai — internet.com should feel like a premium editorial publication
  'design.color_background': '#08090d',
  'design.color_surface': '#0f1117',
  'design.color_border': '#1c1e2a',
  'design.color_primary': '#3b82f6',      // Confident blue — trust, authority
  'design.color_secondary': '#8b5cf6',    // Purple — innovation, future
  'design.color_accent': '#f59e0b',       // Amber — premium, attention
  'design.color_success': '#10b981',      // Emerald
  'design.color_text': '#e2e8f0',
  'design.color_text_secondary': '#94a3b8',

  // Typography: Premium editorial feel
  'design.font_display': 'Playfair Display',  // Serif authority for the OG domain
  'design.font_body': 'Source Sans 3',
  'design.font_mono': 'JetBrains Mono',

  'design.dark_mode': 'true',
  'design.show_stats_bar': 'true',
  'design.hero_style': 'full',

  // Copy
  'copy.hero_tagline': 'The original address of the Internet',
  'copy.hero_subtitle': 'Since 1992. Over 1 billion requests served. Now entering its next era — as a namespace, a directory, and a fractional asset.',
  'copy.footer_text': 'Powered by DS3 — DomainSponsor 3.0',

  // Features — all on for the demo
  'features.parking': 'true',
  'features.subdomains': 'true',
  'features.fractional': 'true',
  'features.directory': 'true',
  'features.agent_namespace': 'true',
  'features.intelligence': 'true',
  'features.three_layer_model': 'true',
  'features.who_should_own': 'true',

  'vertical.categories': JSON.stringify([
    'Search & Discovery', 'Cloud & Infrastructure', 'AI & Machine Learning',
    'Cybersecurity', 'Social & Communication', 'E-Commerce',
    'Developer Tools', 'Domain & DNS', 'Advertising & Media', 'Payments & Fintech'
  ]),

  'vertical.company_types': JSON.stringify([
    { value: 'platform', label: 'Platform Giant' },
    { value: 'disruptor', label: 'Disruptor' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'startup', label: 'Startup' }
  ]),

  'stats.items': JSON.stringify([
    { value: '1B+', label: 'Lifetime Requests' },
    { value: '8,500', label: 'Daily Unique Visitors' },
    { value: '186M', label: 'African Requests' },
    { value: '1992', label: 'Year Registered' }
  ]),

  'domain.bin_price': 'Contact for pricing',
}
