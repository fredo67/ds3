import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDb } from './db/schema.js'
import { seedDatabase } from './db/seed.js'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'
import ownerRoutes from './routes/owner.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Static files for uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Initialize database
await initDb()

// Seed database with defaults
await seedDatabase()

// Routes
app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/owner', ownerRoutes)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'))
  })
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`DS3 server running on port ${PORT}`)
})
