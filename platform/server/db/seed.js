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

  // Get domain from environment or use generic default
  const baseDomain = process.env.BASE_DOMAIN || 'example.ai'
  const domainName = baseDomain.split('.')[0].toUpperCase()
  const domainExt = baseDomain.split('.')[1]?.toUpperCase() || 'AI'

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || `admin@${baseDomain}`
  const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10)
  run(`
    INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)
  `, [adminEmail, adminPassword, 'admin'])

  // Create owner user
  const ownerPassword = bcrypt.hashSync('owner123', 10)
  run(`
    INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)
  `, [`owner@${baseDomain}`, ownerPassword, 'owner'])

  // Seed default config - generic/customizable
  const defaultConfig = {
    'site.domain': baseDomain,
    'site.display_name': `${domainName}.${domainExt}`,
    'site.tagline': 'The premium namespace',
    'site.subtitle': 'Directory and intelligence platform',
    'site.vertical': 'generic',
    'site.contact_email': `info@${baseDomain}`,
    'site.escrow_provider': 'Escrow.com',

    'design.template': 'minimal',
    'design.color_background': '#0a0a0f',
    'design.color_surface': '#12121a',
    'design.color_border': '#1a1a2e',
    'design.color_primary': '#00d4ff',
    'design.color_secondary': '#0066ff',
    'design.color_accent': '#ff3366',
    'design.color_success': '#00ff88',
    'design.color_text': '#e0e0e0',
    'design.font_display': 'Inter',
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

  // Seed sample companies - generic examples
  const companies = [
    {
      company_name: 'Acme Corp',
      slug: 'acme',
      description: 'Leading technology company providing innovative solutions.',
      company_type: 'enterprise',
      key_stat: '$10B Revenue',
      website: 'https://example.com',
      hq_location: 'San Francisco, CA',
      founded: '2010',
      employees: '1000+',
      categories: JSON.stringify(['Technology', 'Innovation', 'Enterprise']),
      featured: 1,
    },
    {
      company_name: 'TechStart Inc',
      slug: 'techstart',
      description: 'Fast-growing startup disrupting the industry with AI-powered tools.',
      company_type: 'startup',
      key_stat: 'Series B',
      website: 'https://example.com',
      hq_location: 'Austin, TX',
      founded: '2020',
      employees: '50+',
      categories: JSON.stringify(['AI/ML', 'SaaS', 'Startup']),
      featured: 1,
    },
    {
      company_name: 'Global Solutions Ltd',
      slug: 'global-solutions',
      description: 'International consulting and services firm.',
      company_type: 'enterprise',
      key_stat: 'Fortune 500',
      website: 'https://example.com',
      hq_location: 'New York, NY',
      founded: '1995',
      employees: '10000+',
      categories: JSON.stringify(['Consulting', 'Services', 'Enterprise']),
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
      title: 'Industry Trends for 2024',
      excerpt: 'Key trends shaping the industry this year.',
      category: 'Analysis',
      published_at: new Date().toISOString(),
    },
    {
      title: 'Market Update: Q1 Report',
      excerpt: 'Quarterly market analysis and insights.',
      category: 'Market',
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
    { subdomain: 'acme', status: 'claimed', owner_name: 'Acme Corp', redirect_url: 'https://example.com' },
    { subdomain: 'api', status: 'available' },
    { subdomain: 'docs', status: 'available' },
    { subdomain: 'app', status: 'available' },
  ]

  for (const sub of subdomains) {
    run(`
      INSERT INTO subdomains (subdomain, status, owner_name, redirect_url, type)
      VALUES (?, ?, ?, ?, 'redirect')
    `, [sub.subdomain, sub.status, sub.owner_name || null, sub.redirect_url || null])
  }

  console.log('Database seeded successfully!')
  console.log(`Domain: ${baseDomain}`)
  console.log(`Admin: ${adminEmail}`)
}
