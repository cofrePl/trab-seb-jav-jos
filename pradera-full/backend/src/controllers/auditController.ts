import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { projectId, userId, action, limit = '100' } = req.query
    const logs = await prisma.auditLog.findMany({
      where: {
        ...(projectId && { projectId: projectId as string }),
        ...(userId && { userId: userId as string }),
        ...(action && { action: action as string })
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    })
    res.json(logs)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getAuditLogsByEntity = async (req: Request, res: Response) => {
  try {
    const { entity, entityId } = req.query
    if (!entity || !entityId) {
      return res.status(400).json({ error: 'entity y entityId son requeridos' })
    }

    const logs = await prisma.auditLog.findMany({
      where: {
        entity: entity as string,
        entityId: entityId as string
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(logs)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createAuditLog = async (
  userId: string,
  action: string,
  entity: string,
  entityId: string | null = null,
  projectId: string | null = null,
  changes: any = null
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        projectId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress: null
      }
    })
  } catch (error) {
    console.error('Error en auditoría:', error)
  }
}

export const getAuditStatistics = async (req: Request, res: Response) => {
  try {
    const { projectId, days = '30' } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days as string))

    const stats = await prisma.auditLog.groupBy({
      by: ['action'],
      where: {
        ...(projectId && { projectId: projectId as string }),
        createdAt: { gte: startDate }
      },
      _count: true
    })

    const formattedStats = stats.reduce((acc: any, curr) => {
      acc[curr.action] = curr._count
      return acc
    }, { CREATE: 0, UPDATE: 0, DELETE: 0 })

    res.json(formattedStats)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
