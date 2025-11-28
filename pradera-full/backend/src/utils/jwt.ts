import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.JWT_SECRET || 'changeme'

export function signToken(payload: object, expiresIn = '8h') {
  return jwt.sign(payload, SECRET, { expiresIn } as any)
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET)
}
