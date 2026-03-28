import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { query, queryOne, run, getLastInsertId } from '../db/schema.js'
import { generateToken, authMiddleware, adminOnly } from '../middleware/auth.js'

const router = Router()

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body

    const user = queryOne('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user)
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ user: req.user })
})

// Dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
  try {
    const totalLeads = queryOne('SELECT COUNT(*) as count FROM leads')?.count || 0
    const newLeads = queryOne('SELECT COUNT(*) as count FROM leads WHERE status = "new"')?.count || 0
    const totalListings = queryOne('SELECT COUNT(*) as count FROM listings')?.count || 0
    const totalSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains')?.count || 0
    const claimedSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains WHERE status = "claimed"')?.count || 0
    const recentLeads = query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5')
    const recentOutbound = query('SELECT * FROM outbound ORDER BY created_at DESC LIMIT 5')

    res.json({
      totalLeads,
      newLeads,
      totalListings,
      totalSubdomains,
      claimedSubdomains,
      recentLeads,
      recentOutbound,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Leads CRUD
router.get('/leads', authMiddleware, (req, res) => {
  try {
    const { type, status, search } = req.query
    let sql = 'SELECT * FROM leads WHERE 1=1'
    const params = []

    if (type) {
      sql += ' AND lead_type = ?'
      params.push(type)
    }

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    if (search) {
      sql += ' AND (contact_name LIKE ? OR contact_email LIKE ? OR company_name LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY created_at DESC'

    const leads = query(sql, params)
    res.json(leads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/leads/:id', authMiddleware, (req, res) => {
  try {
    const { status, notes } = req.body
    run('UPDATE leads SET status = ?, notes = ?, updated_at = datetime("now") WHERE id = ?',
      [status, notes, req.params.id])
    res.json({ message: 'Lead updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/leads/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    run('DELETE FROM leads WHERE id = ?', [req.params.id])
    res.json({ message: 'Lead deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Listings CRUD
router.get('/listings', authMiddleware, (req, res) => {
  try {
    const listings = query('SELECT * FROM listings ORDER BY company_name ASC')
    res.json(listings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/listings', authMiddleware, adminOnly, (req, res) => {
  try {
    const {
      company_name, slug, description, website_url, category, company_type,
      company_stage, revenue_range, valuation, key_stat, notable_contracts,
      products, tier, is_active, featured_badge, founded, headquarters,
      employees, linkedin_url
    } = req.body

    run(`
      INSERT INTO listings (company_name, slug, description, website_url, category, company_type,
        company_stage, revenue_range, valuation, key_stat, notable_contracts, products, tier,
        is_active, featured_badge, founded, headquarters, employees, linkedin_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [company_name, slug, description, website_url, category, company_type,
        company_stage, revenue_range, valuation, key_stat, notable_contracts,
        products, tier, is_active ? 1 : 0, featured_badge ? 1 : 0, founded,
        headquarters, employees, linkedin_url])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Listing created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/listings/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE listings SET ${fields}, updated_at = datetime("now") WHERE id = ?`, values)
    res.json({ message: 'Listing updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/listings/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    run('DELETE FROM listings WHERE id = ?', [req.params.id])
    res.json({ message: 'Listing deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Subdomains CRUD
router.get('/subdomains', authMiddleware, (req, res) => {
  try {
    const subdomains = query('SELECT * FROM subdomains ORDER BY subdomain ASC')
    res.json(subdomains)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/subdomains', authMiddleware, adminOnly, (req, res) => {
  try {
    const {
      subdomain, listing_id, subdomain_type, display_name, tagline, description,
      category, status, is_featured, price_range, website_url
    } = req.body

    run(`
      INSERT INTO subdomains (subdomain, listing_id, subdomain_type, display_name, tagline,
        description, category, status, is_featured, price_range, website_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [subdomain, listing_id, subdomain_type, display_name, tagline, description,
        category, status, is_featured ? 1 : 0, price_range, website_url])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Subdomain created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/subdomains/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE subdomains SET ${fields}, updated_at = datetime("now") WHERE id = ?`, values)
    res.json({ message: 'Subdomain updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/subdomains/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    run('DELETE FROM subdomains WHERE id = ?', [req.params.id])
    res.json({ message: 'Subdomain deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Outbound CRUD
router.get('/outbound', authMiddleware, (req, res) => {
  try {
    const outbound = query('SELECT * FROM outbound ORDER BY created_at DESC')
    res.json(outbound)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/outbound', authMiddleware, (req, res) => {
  try {
    const { company_name, contact_name, contact_title, contact_email, contact_method, status, notes } = req.body
    run(`
      INSERT INTO outbound (company_name, contact_name, contact_title, contact_email, contact_method, outreach_date, status, notes)
      VALUES (?, ?, ?, ?, ?, datetime("now"), ?, ?)
    `, [company_name, contact_name, contact_title, contact_email, contact_method, status, notes])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Outbound created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/outbound/:id', authMiddleware, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE outbound SET ${fields} WHERE id = ?`, values)
    res.json({ message: 'Outbound updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Articles CRUD
router.get('/articles', authMiddleware, (req, res) => {
  try {
    const articles = query('SELECT * FROM articles ORDER BY published_at DESC')
    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/articles', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, slug, summary, content, category, source, source_url, published_at, is_published } = req.body
    run(`
      INSERT INTO articles (title, slug, summary, content, category, source, source_url, published_at, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, slug, summary, content, category, source, source_url, published_at, is_published ? 1 : 0])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Article created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/articles/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE articles SET ${fields} WHERE id = ?`, values)
    res.json({ message: 'Article updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/articles/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    run('DELETE FROM articles WHERE id = ?', [req.params.id])
    res.json({ message: 'Article deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Analytics
router.get('/analytics', authMiddleware, (req, res) => {
  try {
    // Leads by type
    const leadsByType = query(`
      SELECT lead_type, COUNT(*) as count FROM leads GROUP BY lead_type
    `)

    // Leads by status
    const leadsByStatus = query(`
      SELECT status, COUNT(*) as count FROM leads GROUP BY status
    `)

    // Leads over time (last 30 days)
    const leadsOverTime = query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM leads
      WHERE created_at >= datetime('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    // Subdomains by type
    const subdomainsByType = query(`
      SELECT subdomain_type, COUNT(*) as count FROM subdomains GROUP BY subdomain_type
    `)

    // Subdomains by status
    const subdomainsByStatus = query(`
      SELECT status, COUNT(*) as count FROM subdomains GROUP BY status
    `)

    res.json({
      leadsByType,
      leadsByStatus,
      leadsOverTime,
      subdomainsByType,
      subdomainsByStatus,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
