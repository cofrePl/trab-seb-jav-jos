import { Request, Response } from 'express'
import prisma from '../services/prismaClient'
import { hashPassword, comparePassword } from '../utils/hash'
import { signToken } from '../utils/jwt'

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body
    const hashed = await hashPassword(password)
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } })
    res.json({ id: user.id, email: user.email })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await comparePassword(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
