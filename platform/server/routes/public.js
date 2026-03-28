import { Router } from 'express'
import { query, queryOne, run, getLastInsertId } from '../db/schema.js'

const router = Router()

// Get site config
router.get('/config', (req, res) => {
  try {
    const configRows = query('SELECT config_key, config_value FROM site_config')
    const config = {}
    configRows.forEach(row => {
      config[row.config_key] = row.config_value
    })
    res.json(config)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get listings
router.get('/listings', (req, res) => {
  try {
    const { category, type, featured, limit } = req.query
    let sql = 'SELECT * FROM listings WHERE is_active = 1'
    const params = []

    if (category) {
      sql += ' AND categories LIKE ?'
      params.push(`%${category}%`)
    }

    if (type) {
      sql += ' AND company_type = ?'
      params.push(type)
    }

    if (featured === 'true') {
      sql += ' AND featured = 1'
    }

    sql += ' ORDER BY featured DESC, company_name ASC'

    if (limit) {
      sql += ' LIMIT ?'
      params.push(parseInt(limit))
    }

    const listings = query(sql, params)
    res.json(listings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single listing
router.get('/listings/:slug', (req, res) => {
  try {
    const listing = queryOne('SELECT * FROM listings WHERE slug = ? AND is_active = 1', [req.params.slug])
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' })
    }
    res.json(listing)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get subdomains
router.get('/subdomains', (req, res) => {
  try {
    const { type, status, featured } = req.query
    let sql = 'SELECT * FROM subdomains WHERE 1=1'
    const params = []

    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    if (featured === 'true') {
      sql += ' AND is_featured = 1'
    }

    sql += ' ORDER BY is_featured DESC, subdomain ASC'

    const subdomains = query(sql, params)
    res.json(subdomains)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single subdomain
router.get('/subdomains/:subdomain', (req, res) => {
  try {
    const subdomain = queryOne('SELECT * FROM subdomains WHERE subdomain = ?', [req.params.subdomain])
    if (!subdomain) {
      return res.status(404).json({ message: 'Subdomain not found' })
    }
    res.json(subdomain)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get articles
router.get('/articles', (req, res) => {
  try {
    const { category, limit } = req.query
    let sql = "SELECT * FROM articles WHERE status = 'published'"
    const params = []

    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }

    sql += ' ORDER BY published_at DESC'

    if (limit) {
      sql += ' LIMIT ?'
      params.push(parseInt(limit))
    }

    const articles = query(sql, params)
    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single article
router.get('/articles/:slug', (req, res) => {
  try {
    const article = queryOne("SELECT * FROM articles WHERE slug = ? AND status = 'published'", [req.params.slug])
    if (!article) {
      return res.status(404).json({ message: 'Article not found' })
    }
    res.json(article)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Submit lead
router.post('/leads', (req, res) => {
  try {
    const {
      lead_type, company_name, company, contact_name, email, phone,
      title, message, description, subject, source, offer_range, desired_subdomain, website
    } = req.body

    if (!email || !lead_type) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    run(`
      INSERT INTO leads (lead_type, company_name, company, contact_name, email, phone,
        title, message, description, subject, source, offer_range, desired_subdomain, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [lead_type, company_name, company, contact_name, email, phone,
        title, message, description, subject, source, offer_range, desired_subdomain, website])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Lead submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get stats
router.get('/stats', (req, res) => {
  try {
    const totalCompanies = queryOne('SELECT COUNT(*) as count FROM listings WHERE is_active = 1')?.count || 0
    const featuredCompanies = queryOne('SELECT COUNT(*) as count FROM listings WHERE is_active = 1 AND featured = 1')?.count || 0
    const totalArticles = queryOne("SELECT COUNT(*) as count FROM articles WHERE status = 'published'")?.count || 0
    const totalSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains')?.count || 0
    const availableSubdomains = queryOne("SELECT COUNT(*) as count FROM subdomains WHERE status = 'available'")?.count || 0

    res.json({
      totalCompanies,
      featuredCompanies,
      totalArticles,
      totalSubdomains,
      availableSubdomains,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get context (subdomain detection)
router.get('/context', (req, res) => {
  try {
    const host = req.headers.host || ''
    const baseDomain = process.env.BASE_DOMAIN || 'example.ai'

    // Check if this is a subdomain request
    let subdomain = null
    if (host.includes(baseDomain)) {
      const parts = host.replace(`.${baseDomain}`, '').split('.')
      if (parts.length > 0 && parts[0] !== 'www' && parts[0] !== 'www2') {
        subdomain = parts[0]
      }
    }

    res.json({
      subdomain,
      baseDomain,
      isSubdomain: !!subdomain,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
