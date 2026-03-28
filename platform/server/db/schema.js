import initSqlJs from 'sql.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = join(__dirname, 'ds3.db')

let db = null

export async function initDb() {
  const SQL = await initSqlJs()

  // Load existing database or create new one
  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS site_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_key TEXT UNIQUE NOT NULL,
      config_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      website_url TEXT,
      category TEXT,
      company_type TEXT,
      company_stage TEXT,
      revenue_range TEXT,
      valuation TEXT,
      key_stat TEXT,
      notable_contracts TEXT,
      products TEXT,
      tier TEXT DEFAULT 'free',
      is_active INTEGER DEFAULT 1,
      featured_badge INTEGER DEFAULT 0,
      contact_name TEXT,
      contact_email TEXT,
      founded TEXT,
      headquarters TEXT,
      employees TEXT,
      linkedin_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS subdomains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subdomain TEXT UNIQUE NOT NULL,
      listing_id INTEGER,
      subdomain_type TEXT DEFAULT 'company',
      display_name TEXT,
      tagline TEXT,
      description TEXT,
      category TEXT,
      status TEXT DEFAULT 'available',
      claimed_by TEXT,
      agent_name TEXT,
      agent_description TEXT,
      agent_parent_company TEXT,
      agent_endpoint_type TEXT,
      dns_target TEXT,
      token_id TEXT,
      website_url TEXT,
      is_featured INTEGER DEFAULT 0,
      price_range TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      lead_type TEXT NOT NULL,
      company_name TEXT,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT,
      contact_title TEXT,
      message TEXT,
      source TEXT,
      offer_range TEXT,
      desired_subdomain TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS outbound (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      contact_name TEXT,
      contact_title TEXT,
      contact_email TEXT,
      contact_method TEXT,
      outreach_date DATETIME,
      status TEXT DEFAULT 'sent',
      follow_up_date DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      content TEXT,
      category TEXT,
      source TEXT,
      source_url TEXT,
      published_at DATETIME,
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  saveDb()
  console.log('Database initialized')
  return db
}

export function saveDb() {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    writeFileSync(DB_PATH, buffer)
  }
}

export function run(sql, params = []) {
  if (!db) throw new Error('Database not initialized')
  db.run(sql, params)
  saveDb()
}

export function query(sql, params = []) {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare(sql)
  stmt.bind(params)

  const results = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

export function queryOne(sql, params = []) {
  const results = query(sql, params)
  return results[0] || null
}

export function getLastInsertId() {
  const result = queryOne('SELECT last_insert_rowid() as id')
  return result?.id
}

export default { initDb, run, query, queryOne, getLastInsertId, saveDb }
