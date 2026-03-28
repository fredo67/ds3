import { run, query } from './schema.js'
import bcrypt from 'bcryptjs'

export function seedDatabase() {
  console.log('Seeding database...')

  // Check if already seeded
  const existingUsers = query('SELECT COUNT(*) as count FROM users')
  if (existingUsers[0]?.count > 0) {
    console.log('Database already seeded, skipping...')
    return
  }

  // Create admin user
  const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10)
  run(`
    INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)
  `, [process.env.ADMIN_EMAIL || 'admin@military.ai', adminPassword, 'admin'])

  // Create owner user
  const ownerPassword = bcrypt.hashSync('owner123', 10)
  run(`
    INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)
  `, ['owner@military.ai', ownerPassword, 'owner'])

  // Seed default config
  const defaultConfig = {
    'site.domain': process.env.BASE_DOMAIN || 'military.ai',
    'site.display_name': 'MILITARY.AI',
    'site.tagline': 'The namespace for the future of battlespaces',
    'site.subtitle': 'Tracking the companies, contracts, and technologies reshaping modern warfare',
    'site.vertical': 'defense',
    'site.contact_email': 'info@military.ai',
    'site.escrow_provider': 'Escrow.com',

    'design.template': 'command-center',
    'design.color_background': '#0a0a0f',
    'design.color_surface': '#12121a',
    'design.color_border': '#1a1a2e',
    'design.color_primary': '#00d4ff',
    'design.color_secondary': '#0066ff',
    'design.color_accent': '#ff3366',
    'design.color_success': '#00ff88',
    'design.color_text': '#e0e0e0',
    'design.font_display': 'Rajdhani',
    'design.font_body': 'Inter',
    'design.font_mono': 'JetBrains Mono',

    'features.parking': 'true',
    'features.subdomains': 'true',
    'features.fractional': 'true',
    'features.directory': 'true',
    'features.intelligence': 'true',
    'features.three_layer_model': 'true',

    'domain.bin_price': 'Contact for pricing',
  }

  for (const [key, value] of Object.entries(defaultConfig)) {
    run('INSERT INTO site_config (config_key, config_value) VALUES (?, ?)', [key, value])
  }

  // Seed sample companies
  const companies = [
    {
      company_name: 'Anduril Industries',
      slug: 'anduril',
      description: 'Defense technology company building advanced autonomous systems and AI for national security.',
      company_type: 'disruptor',
      key_stat: '$60B Valuation',
      website: 'https://anduril.com',
      hq_location: 'Costa Mesa, CA',
      founded: '2017',
      employees: '2500+',
      categories: JSON.stringify(['Autonomous Systems', 'AI/ML', 'Counter-UAS']),
      featured: 1,
    },
    {
      company_name: 'Palantir Technologies',
      slug: 'palantir',
      description: 'Software company specializing in big data analytics for government and commercial clients.',
      company_type: 'disruptor',
      key_stat: '$50B Market Cap',
      website: 'https://palantir.com',
      hq_location: 'Denver, CO',
      founded: '2003',
      employees: '3000+',
      categories: JSON.stringify(['AI/ML', 'Command & Control', 'Intelligence']),
      featured: 1,
    },
    {
      company_name: 'Shield AI',
      slug: 'shield-ai',
      description: 'Building the world\'s best AI pilot for defense applications.',
      company_type: 'disruptor',
      key_stat: '$2.7B Valuation',
      website: 'https://shield.ai',
      hq_location: 'San Diego, CA',
      founded: '2015',
      employees: '800+',
      categories: JSON.stringify(['Autonomous Systems', 'AI/ML', 'Drones']),
      featured: 1,
    },
    {
      company_name: 'Lockheed Martin',
      slug: 'lockheed-martin',
      description: 'Global aerospace, defense, and security company.',
      company_type: 'legacy',
      key_stat: '$65B Revenue',
      website: 'https://lockheedmartin.com',
      hq_location: 'Bethesda, MD',
      founded: '1926',
      employees: '116000+',
      categories: JSON.stringify(['Aerospace', 'Defense Systems', 'Space']),
      featured: 1,
    },
    {
      company_name: 'Northrop Grumman',
      slug: 'northrop-grumman',
      description: 'Aerospace and defense technology company.',
      company_type: 'legacy',
      key_stat: '$37B Revenue',
      website: 'https://northropgrumman.com',
      hq_location: 'Falls Church, VA',
      founded: '1939',
      employees: '95000+',
      categories: JSON.stringify(['Aerospace', 'Cybersecurity', 'Space']),
      featured: 0,
    },
    {
      company_name: 'Rebellion Defense',
      slug: 'rebellion-defense',
      description: 'AI-powered software for national security applications.',
      company_type: 'disruptor',
      key_stat: 'Series C',
      website: 'https://rebelliondefense.com',
      hq_location: 'Washington, DC',
      founded: '2019',
      employees: '200+',
      categories: JSON.stringify(['AI/ML', 'Cybersecurity', 'Software']),
      featured: 0,
    },
  ]

  for (const company of companies) {
    run(`
      INSERT INTO listings (company_name, slug, description, company_type, key_stat, website, hq_location, founded, employees, categories, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      company.company_name, company.slug, company.description, company.company_type,
      company.key_stat, company.website, company.hq_location, company.founded,
      company.employees, company.categories, company.featured
    ])
  }

  // Seed sample articles
  const articles = [
    {
      title: 'Anduril Wins $20B Army Contract',
      excerpt: 'Anduril Industries has been awarded a massive Army contract for autonomous systems.',
      category: 'Contracts',
      published_at: new Date().toISOString(),
    },
    {
      title: 'AI in Defense: 2024 Trends',
      excerpt: 'Key trends shaping the integration of artificial intelligence in defense applications.',
      category: 'Analysis',
      published_at: new Date().toISOString(),
    },
    {
      title: 'Shield AI Expands Hivemind Platform',
      excerpt: 'Shield AI announces major updates to its Hivemind autonomous flight system.',
      category: 'Product',
      published_at: new Date().toISOString(),
    },
  ]

  for (const article of articles) {
    run(`
      INSERT INTO articles (title, excerpt, category, status, published_at)
      VALUES (?, ?, ?, 'published', ?)
    `, [article.title, article.excerpt, article.category, article.published_at])
  }

  // Seed sample subdomains
  const subdomains = [
    { subdomain: 'anduril', status: 'claimed', owner_name: 'Anduril Industries', redirect_url: 'https://anduril.com' },
    { subdomain: 'palantir', status: 'claimed', owner_name: 'Palantir Technologies', redirect_url: 'https://palantir.com' },
    { subdomain: 'shield', status: 'available' },
    { subdomain: 'defense', status: 'available' },
    { subdomain: 'cyber', status: 'available' },
    { subdomain: 'intel', status: 'available' },
  ]

  for (const sub of subdomains) {
    run(`
      INSERT INTO subdomains (subdomain, status, owner_name, redirect_url, type)
      VALUES (?, ?, ?, ?, 'redirect')
    `, [sub.subdomain, sub.status, sub.owner_name || null, sub.redirect_url || null])
  }

  // Seed sample outbound contacts
  const outbound = [
    {
      contact_name: 'John Smith',
      title: 'VP Corporate Development',
      company: 'Raytheon',
      email: 'jsmith@raytheon.com',
      priority: 'high',
      status: 'pending',
    },
    {
      contact_name: 'Sarah Johnson',
      title: 'Head of M&A',
      company: 'L3Harris',
      email: 'sjohnson@l3harris.com',
      priority: 'high',
      status: 'contacted',
    },
  ]

  for (const contact of outbound) {
    run(`
      INSERT INTO outbound (contact_name, title, company, email, priority, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [contact.contact_name, contact.title, contact.company, contact.email, contact.priority, contact.status])
  }

  console.log('Database seeded successfully!')
}
