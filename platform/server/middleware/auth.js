import jwt from 'jsonwebtoken'
import { queryOne } from '../db/schema.js'

const JWT_SECRET = process.env.JWT_SECRET || 'ds3-secret-key-change-in-production'

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export function ownerOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner or admin access required' })
  }
  next()
}

export default { generateToken, verifyToken, authMiddleware, adminOnly, ownerOrAdmin }
