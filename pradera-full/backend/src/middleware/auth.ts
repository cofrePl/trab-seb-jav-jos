import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: any
}

export function ensureAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: 'No token' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid token' })
  const token = parts[1]
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid' })
  }
}
