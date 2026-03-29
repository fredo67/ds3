// Internet.com demo config — clean, high-contrast, sales-ready
export const templateConfig = {
  'site.domain': 'internet.com',
  'site.display_name': 'INTERNET.COM',
  'site.tagline': 'The original address of the Internet',
  'site.subtitle': 'Since 1992. Over 1 billion requests served.',
  'site.vertical': 'tech',
  'site.contact_email': 'info@internet.com',

  // DESIGN: Clean, high-contrast, easy to read on screen share
  'design.template': 'minimal',

  // Higher contrast than military.ai defaults
  'design.color_background': '#09090b',     // Near-black (zinc-950)
  'design.color_surface': '#18181b',        // Zinc-900
  'design.color_border': '#27272a',         // Zinc-800 — visible borders
  'design.color_primary': '#3b82f6',        // Blue-500 — clean, trustworthy
  'design.color_secondary': '#6366f1',      // Indigo-500
  'design.color_accent': '#f59e0b',         // Amber-500 — warm CTA
  'design.color_success': '#22c55e',        // Green-500
  'design.color_text': '#f4f4f5',           // Zinc-100 — HIGH contrast white
  'design.color_text_secondary': '#a1a1aa', // Zinc-400

  // FONTS: Simple, readable, no exotic serif
  'design.font_display': 'DM Sans',
  'design.font_body': 'DM Sans',
  'design.font_mono': 'JetBrains Mono',

  'design.dark_mode': 'true',
  'design.show_stats_bar': 'true',

  // COPY — short, punchy, no jargon
  'copy.hero_tagline': 'The original address of the Internet',
  'copy.hero_subtitle': 'Since 1992. Over 1 billion requests served. Now a namespace, a directory, and a fractional asset.',

  // FEATURES — turn OFF complexity
  'features.parking': 'true',
  'features.subdomains': 'true',
  'features.fractional': 'true',
  'features.directory': 'true',
  'features.agent_namespace': 'false',      // OFF — too technical
  'features.intelligence': 'false',          // OFF — not the point of demo
  'features.three_layer_model': 'true',     // ON — this IS the pitch
  'features.who_should_own': 'true',        // ON — creates BIN pressure

  'vertical.categories': JSON.stringify([
    'Search', 'Cloud', 'AI', 'Security', 'Social', 'Commerce', 'Domains', 'Payments'
  ]),

  'vertical.company_types': JSON.stringify([
    { value: 'platform', label: 'Platform' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'disruptor', label: 'Disruptor' }
  ]),

  'stats.items': JSON.stringify([
    { value: '1B+', label: 'Lifetime Requests' },
    { value: '8,500', label: 'Daily Visitors' },
    { value: '190+', label: 'Countries' },
    { value: '1992', label: 'Registered' }
  ]),

  'domain.bin_price': 'Contact for pricing',
}
