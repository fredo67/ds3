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

    const valid = bcrypt.compareSync(password, user.password_hash)
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

// Dashboard stats
router.get('/dashboard', authMiddleware, (req, res) => {
  try {
    const leads = {
      total: queryOne('SELECT COUNT(*) as count FROM leads')?.count || 0,
      listing: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'listing'")?.count || 0,
      acquisition: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'acquisition'")?.count || 0,
      subdomain: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'subdomain'")?.count || 0,
      contact: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'contact'")?.count || 0,
    }

    const listings = queryOne('SELECT COUNT(*) as count FROM listings')?.count || 0

    const subdomains = {
      total: queryOne('SELECT COUNT(*) as count FROM subdomains')?.count || 0,
      claimed: queryOne("SELECT COUNT(*) as count FROM subdomains WHERE status = 'claimed'")?.count || 0,
      available: queryOne("SELECT COUNT(*) as count FROM subdomains WHERE status = 'available'")?.count || 0,
    }

    const outbound = {
      total: queryOne('SELECT COUNT(*) as count FROM outbound')?.count || 0,
      contacted: queryOne("SELECT COUNT(*) as count FROM outbound WHERE status = 'contacted'")?.count || 0,
      responded: queryOne("SELECT COUNT(*) as count FROM outbound WHERE status = 'responded'")?.count || 0,
    }

    res.json({ leads, listings, subdomains, outbound })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Analytics
router.get('/analytics', authMiddleware, (req, res) => {
  try {
    const leads = {
      total: queryOne('SELECT COUNT(*) as count FROM leads')?.count || 0,
      listing: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'listing'")?.count || 0,
      acquisition: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'acquisition'")?.count || 0,
      subdomain: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'subdomain'")?.count || 0,
      contact: queryOne("SELECT COUNT(*) as count FROM leads WHERE lead_type = 'contact'")?.count || 0,
    }

    const listings = queryOne('SELECT COUNT(*) as count FROM listings')?.count || 0

    const subdomains = {
      total: queryOne('SELECT COUNT(*) as count FROM subdomains')?.count || 0,
      claimed: queryOne("SELECT COUNT(*) as count FROM subdomains WHERE status = 'claimed'")?.count || 0,
      available: queryOne("SELECT COUNT(*) as count FROM subdomains WHERE status = 'available'")?.count || 0,
    }

    const outbound = {
      total: queryOne('SELECT COUNT(*) as count FROM outbound')?.count || 0,
      contacted: queryOne("SELECT COUNT(*) as count FROM outbound WHERE status = 'contacted'")?.count || 0,
      responded: queryOne("SELECT COUNT(*) as count FROM outbound WHERE status = 'responded'")?.count || 0,
    }

    res.json({ leads, listings, subdomains, outbound })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Leads CRUD
router.get('/leads', authMiddleware, (req, res) => {
  try {
    const { type, status, limit } = req.query
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

    sql += ' ORDER BY created_at DESC'

    if (limit) {
      sql += ' LIMIT ?'
      params.push(parseInt(limit))
    }

    const leads = query(sql, params)
    res.json(leads)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/leads/:id', authMiddleware, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE leads SET ${fields}, updated_at = datetime("now") WHERE id = ?`, values)
    res.json({ message: 'Lead updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/leads/:id', authMiddleware, (req, res) => {
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

router.post('/listings', authMiddleware, (req, res) => {
  try {
    const {
      company_name, slug, description, website, categories, company_type,
      key_stat, tier, is_active, featured, founded, hq_location, employees
    } = req.body

    run(`
      INSERT INTO listings (company_name, slug, description, website, categories, company_type,
        key_stat, tier, is_active, featured, founded, hq_location, employees)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [company_name, slug, description, website, categories, company_type,
        key_stat, tier || 'free', is_active !== false ? 1 : 0, featured ? 1 : 0,
        founded, hq_location, employees])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Listing created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/listings/:id', authMiddleware, (req, res) => {
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

router.delete('/listings/:id', authMiddleware, (req, res) => {
  try {
    run('DELETE FROM listings WHERE id = ?', [req.params.id])
    res.json({ message: 'Listing deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Subdomains
router.get('/subdomains', authMiddleware, (req, res) => {
  try {
    const { status } = req.query
    let sql = 'SELECT * FROM subdomains WHERE 1=1'
    const params = []

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    sql += ' ORDER BY subdomain ASC'

    const subdomains = query(sql, params)
    res.json(subdomains)
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
    const { contact_name, title, company, email, phone, priority, status, notes } = req.body
    run(`
      INSERT INTO outbound (contact_name, title, company, email, phone, priority, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [contact_name, title, company, email, phone, priority || 'normal', status || 'pending', notes])

    const id = getLastInsertId()
    res.status(201).json({ id, message: 'Outbound contact created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/outbound/:id', authMiddleware, (req, res) => {
  try {
    const updates = req.body
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ')
    const values = [...Object.values(updates), req.params.id]
    run(`UPDATE outbound SET ${fields}, updated_at = datetime("now") WHERE id = ?`, values)
    res.json({ message: 'Outbound updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/outbound/:id', authMiddleware, (req, res) => {
  try {
    run('DELETE FROM outbound WHERE id = ?', [req.params.id])
    res.json({ message: 'Outbound deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Articles
router.get('/articles', authMiddleware, (req, res) => {
  try {
    const articles = query('SELECT * FROM articles ORDER BY published_at DESC')
    res.json(articles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
