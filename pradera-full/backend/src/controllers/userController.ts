import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })
        res.json(users)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
