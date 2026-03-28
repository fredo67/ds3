// Real Estate vertical seed data (e.g., property.ai, homes.ai)
export const companies = [
  {
    company_name: 'Zillow',
    slug: 'zillow',
    description: 'Largest real estate marketplace. AI-powered Zestimate valuations, search, and transactions.',
    website: 'https://zillow.com',
    categories: JSON.stringify(['PropTech', 'Valuation', 'Residential']),
    company_type: 'proptech',
    key_stat: '200M+ Monthly Users',
    founded: '2006',
    hq_location: 'Seattle, WA',
    employees: '6500+',
    featured: 1,
  },
  {
    company_name: 'Redfin',
    slug: 'redfin',
    description: 'Tech-powered brokerage. AI matching, instant offers, and commission savings.',
    website: 'https://redfin.com',
    categories: JSON.stringify(['Brokerage', 'PropTech']),
    company_type: 'proptech',
    key_stat: '$1B+ Revenue',
    founded: '2004',
    hq_location: 'Seattle, WA',
    employees: '5000+',
    featured: 1,
  },
  {
    company_name: 'Opendoor',
    slug: 'opendoor',
    description: 'iBuyer platform. AI-powered instant home offers and transactions.',
    website: 'https://opendoor.com',
    categories: JSON.stringify(['PropTech', 'Residential']),
    company_type: 'proptech',
    key_stat: '250K+ Homes Sold',
    founded: '2014',
    hq_location: 'San Francisco, CA',
    employees: '2000+',
    featured: 0,
  },
  {
    company_name: 'Compass',
    slug: 'compass',
    description: 'Tech-enabled brokerage. AI-powered CRM, marketing, and agent tools.',
    website: 'https://compass.com',
    categories: JSON.stringify(['Brokerage', 'PropTech']),
    company_type: 'brokerage',
    key_stat: '#1 US Brokerage',
    founded: '2012',
    hq_location: 'New York, NY',
    employees: '3500+',
    featured: 0,
  },
]

export const subdomains = [
  { subdomain: 'zillow', type: 'company', status: 'available' },
  { subdomain: 'redfin', type: 'company', status: 'available' },
  { subdomain: 'compass', type: 'company', status: 'available' },
  { subdomain: 'opendoor', type: 'company', status: 'available' },
  { subdomain: 'valuation', type: 'agent', status: 'available', agent_name: 'Valuation Agent', agent_description: 'Property valuation AI' },
  { subdomain: 'search', type: 'agent', status: 'available', agent_name: 'Search Agent', agent_description: 'Property search AI' },
  { subdomain: 'api', type: 'reserved', status: 'reserved' },
]

export const articles = [
  {
    title: 'Zillow Zestimate Accuracy Reaches 95% in Major Markets',
    excerpt: 'AI valuation model improvements reduce median error to 2.4%.',
    category: 'Product',
    published_at: new Date().toISOString(),
  },
  {
    title: 'AI Transforms Real Estate Agent Productivity',
    excerpt: 'Study shows agents using AI tools close 40% more deals.',
    category: 'Research',
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const outbound = [
  { company: 'Zillow', contact_name: 'Jeremy Wacksman', title: 'CEO', priority: 'high', status: 'sent' },
  { company: 'Compass', contact_name: 'Robert Reffkin', title: 'CEO', priority: 'high', status: 'sent' },
]
