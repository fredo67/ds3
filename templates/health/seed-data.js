// Health vertical seed data (e.g., health.ai, pharma.ai)
export const companies = [
  {
    company_name: 'Tempus',
    slug: 'tempus',
    description: 'AI-enabled precision medicine. Genomic sequencing and clinical data analytics.',
    website: 'https://tempus.com',
    categories: JSON.stringify(['Diagnostics', 'Genomics', 'AI/ML']),
    company_type: 'healthtech',
    key_stat: '$8.1B Valuation',
    founded: '2015',
    hq_location: 'Chicago, IL',
    employees: '2500+',
    featured: 1,
  },
  {
    company_name: 'Recursion',
    slug: 'recursion',
    description: 'AI-powered drug discovery. Maps cellular biology to find new treatments.',
    website: 'https://recursion.com',
    categories: JSON.stringify(['Drug Discovery', 'AI/ML']),
    company_type: 'healthtech',
    key_stat: 'Public (RXRX)',
    founded: '2013',
    hq_location: 'Salt Lake City, UT',
    employees: '600+',
    featured: 1,
  },
  {
    company_name: 'Viz.ai',
    slug: 'viz-ai',
    description: 'AI-powered stroke detection. Real-time medical imaging analysis for hospitals.',
    website: 'https://viz.ai',
    categories: JSON.stringify(['Medical Imaging', 'Diagnostics']),
    company_type: 'healthtech',
    key_stat: '$1.2B Valuation',
    founded: '2016',
    hq_location: 'San Francisco, CA',
    employees: '400+',
    featured: 1,
  },
  {
    company_name: 'Flatiron Health',
    slug: 'flatiron',
    description: 'Oncology analytics. Real-world evidence platform for cancer research.',
    website: 'https://flatiron.com',
    categories: JSON.stringify(['Clinical Trials', 'EHR/EMR']),
    company_type: 'healthtech',
    key_stat: 'Roche Owned',
    founded: '2012',
    hq_location: 'New York, NY',
    employees: '1000+',
    featured: 0,
  },
  {
    company_name: 'Pfizer',
    slug: 'pfizer',
    description: 'Global pharmaceutical. AI-powered drug discovery and clinical development.',
    website: 'https://pfizer.com',
    categories: JSON.stringify(['Drug Discovery', 'Clinical Trials']),
    company_type: 'pharma',
    key_stat: '$58B Revenue',
    founded: '1849',
    hq_location: 'New York, NY',
    employees: '83000+',
    featured: 0,
  },
]

export const subdomains = [
  { subdomain: 'tempus', type: 'company', status: 'claimed', owner_name: 'Tempus' },
  { subdomain: 'recursion', type: 'company', status: 'available' },
  { subdomain: 'viz', type: 'company', status: 'available' },
  { subdomain: 'pfizer', type: 'company', status: 'available' },
  { subdomain: 'diagnosis', type: 'agent', status: 'available', agent_name: 'Diagnosis Agent', agent_description: 'Diagnostic AI' },
  { subdomain: 'imaging', type: 'agent', status: 'available', agent_name: 'Imaging Agent', agent_description: 'Medical imaging AI' },
  { subdomain: 'api', type: 'reserved', status: 'reserved' },
]

export const articles = [
  {
    title: 'FDA Approves 500th AI Medical Device',
    excerpt: 'Regulatory approvals accelerate as AI diagnostics prove safety and efficacy.',
    category: 'Regulatory',
    published_at: new Date().toISOString(),
  },
  {
    title: 'Recursion Partners with Roche on AI Drug Discovery',
    excerpt: '$150M deal expands AI-powered therapeutic development.',
    category: 'Partnership',
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const outbound = [
  { company: 'Tempus', contact_name: 'Eric Lefkofsky', title: 'CEO', priority: 'high', status: 'sent' },
  { company: 'Recursion', contact_name: 'Chris Gibson', title: 'CEO', priority: 'high', status: 'sent' },
]
