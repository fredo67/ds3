import { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'
import { existsSync, unlinkSync, readdirSync } from 'fs'
import { query, queryOne, run } from '../db/schema.js'
import { authMiddleware, ownerOrAdmin } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/x-icon']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

// Owner dashboard
router.get('/dashboard', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    const totalLeads = queryOne('SELECT COUNT(*) as count FROM leads')?.count || 0
    const acquisitionLeads = queryOne('SELECT COUNT(*) as count FROM leads WHERE lead_type = "acquisition"')?.count || 0
    const subdomainLeads = queryOne('SELECT COUNT(*) as count FROM leads WHERE lead_type = "subdomain"')?.count || 0
    const totalSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains')?.count || 0
    const claimedSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains WHERE status = "claimed"')?.count || 0
    const availableSubdomains = queryOne('SELECT COUNT(*) as count FROM subdomains WHERE status = "available"')?.count || 0
    const recentLeads = query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 10')

    // Get config for BIN price
    const binPrice = queryOne('SELECT config_value FROM site_config WHERE config_key = "domain.bin_price"')?.config_value || 'Not set'

    res.json({
      revenue: {
        parking: 'Connect parking provider',
        subdomains: '$0', // Placeholder
        fractional: '$0', // Placeholder
      },
      leads: {
        total: totalLeads,
        acquisition: acquisitionLeads,
        subdomain: subdomainLeads,
      },
      subdomains: {
        total: totalSubdomains,
        claimed: claimedSubdomains,
        available: availableSubdomains,
      },
      binPrice,
      recentLeads,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all config
router.get('/config', authMiddleware, ownerOrAdmin, (req, res) => {
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

// Update config (bulk)
router.patch('/config', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    const updates = req.body

    for (const [key, value] of Object.entries(updates)) {
      const existing = queryOne('SELECT id FROM site_config WHERE config_key = ?', [key])
      if (existing) {
        run('UPDATE site_config SET config_value = ?, updated_at = datetime("now") WHERE config_key = ?',
          [value, key])
      } else {
        run('INSERT INTO site_config (config_key, config_value) VALUES (?, ?)', [key, value])
      }
    }

    res.json({ message: 'Config updated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Upload file
router.post('/upload', authMiddleware, ownerOrAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const url = `/uploads/${req.file.filename}`
    res.json({ url, filename: req.file.filename })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete file
router.delete('/upload/:filename', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    const filePath = join(__dirname, '../uploads', req.params.filename)
    if (existsSync(filePath)) {
      unlinkSync(filePath)
      res.json({ message: 'File deleted' })
    } else {
      res.status(404).json({ message: 'File not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get available templates
router.get('/templates', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    const templates = [
      {
        id: 'command-center',
        name: 'Command Center',
        description: 'Dark, tactical, futuristic. HUD-style panels, cyan/blue glow accents.',
        bestFor: 'Defense, cybersecurity, space, intelligence',
        preview: '/templates/command-center.png',
      },
      {
        id: 'corporate',
        name: 'Corporate',
        description: 'Clean, professional, trust-building. Subtle gradients, sharp cards.',
        bestFor: 'Finance, legal, insurance, banking',
        preview: '/templates/corporate.png',
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean, whitespace-heavy. Content speaks for itself.',
        bestFor: 'Tech, SaaS, developer tools',
        preview: '/templates/minimal.png',
      },
      {
        id: 'bold',
        name: 'Bold',
        description: 'High contrast, dramatic. Large typography, bold color blocks.',
        bestFor: 'Consumer brands, media, entertainment',
        preview: '/templates/bold.png',
      },
      {
        id: 'editorial',
        name: 'Editorial',
        description: 'Magazine-style layout. Rich typography, article-first.',
        bestFor: 'News, research, analysis',
        preview: '/templates/editorial.png',
      },
    ]

    res.json(templates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reset config to defaults
router.post('/config/reset', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    // Reset all config to defaults
    const defaults = getDefaultConfig()
    for (const [key, value] of Object.entries(defaults)) {
      const existing = queryOne('SELECT id FROM site_config WHERE config_key = ?', [key])
      if (existing) {
        run('UPDATE site_config SET config_value = ?, updated_at = datetime("now") WHERE config_key = ?',
          [value, key])
      } else {
        run('INSERT INTO site_config (config_key, config_value) VALUES (?, ?)', [key, value])
      }
    }

    res.json({ message: 'Config reset to defaults' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reset specific section
router.post('/config/reset/:section', authMiddleware, ownerOrAdmin, (req, res) => {
  try {
    const { section } = req.params
    const defaults = getDefaultConfig()

    // Filter defaults by section prefix
    const sectionDefaults = Object.entries(defaults)
      .filter(([key]) => key.startsWith(`${section}.`))

    for (const [key, value] of sectionDefaults) {
      const existing = queryOne('SELECT id FROM site_config WHERE config_key = ?', [key])
      if (existing) {
        run('UPDATE site_config SET config_value = ?, updated_at = datetime("now") WHERE config_key = ?',
          [value, key])
      } else {
        run('INSERT INTO site_config (config_key, config_value) VALUES (?, ?)', [key, value])
      }
    }

    res.json({ message: `${section} config reset to defaults` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

function getDefaultConfig() {
  return {
    'site.domain': 'military.ai',
    'site.display_name': 'MILITARY.AI',
    'site.tagline': 'The namespace for the future of battlespaces',
    'site.subtitle': 'Tracking the companies, contracts, and technologies reshaping modern warfare',
    'site.vertical': 'defense',
    'site.owner_display_name': 'Domain Owner',
    'site.escrow_provider': 'Escrow.com',
    'site.contact_email': 'info@military.ai',

    'design.template': 'command-center',
    'design.logo_url': '',
    'design.favicon_url': '',
    'design.hero_image_url': '',

    'design.color_background': '#0a0a0f',
    'design.color_surface': '#12121a',
    'design.color_border': '#1a1a2e',
    'design.color_primary': '#00d4ff',
    'design.color_secondary': '#0066ff',
    'design.color_accent': '#ff3366',
    'design.color_success': '#00ff88',
    'design.color_text': '#e0e0e0',
    'design.color_text_secondary': '#888899',

    'design.font_display': 'Rajdhani',
    'design.font_body': 'Inter',
    'design.font_mono': 'JetBrains Mono',

    'design.dark_mode': 'true',
    'design.show_stats_bar': 'true',
    'design.hero_style': 'full',

    'copy.hero_tagline': '',
    'copy.hero_subtitle': '',
    'copy.acquire_heading': '',
    'copy.get_listed_heading': '',
    'copy.footer_text': '',

    'features.parking': 'true',
    'features.subdomains': 'true',
    'features.fractional': 'true',
    'features.directory': 'true',
    'features.agent_namespace': 'true',
    'features.intelligence': 'true',
    'features.three_layer_model': 'true',
    'features.who_should_own': 'true',

    'vertical.categories': JSON.stringify([
      'Autonomous Systems', 'Counter-UAS', 'AI/ML', 'Cybersecurity',
      'Space', 'Robotics', 'Electronic Warfare', 'Command & Control'
    ]),

    'vertical.company_types': JSON.stringify([
      { value: 'disruptor', label: 'Disruptor' },
      { value: 'legacy', label: 'Legacy Prime' },
      { value: 'startup', label: 'Startup' }
    ]),

    'stats.items': JSON.stringify([
      { value: '$20B', label: 'Anduril Army Contract' },
      { value: '$60B', label: 'Anduril Valuation' },
      { value: '$886B', label: 'Global Defense Market' },
      { value: '$150B', label: 'US Defense Modernization' }
    ]),
  }
}

export default router
