import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import prisma from '../services/prismaClient'

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { crewId, projectId } = req.query
    const logs = await prisma.log.findMany({
      where: {
        ...(crewId && { crewId: crewId as string }),
        ...(projectId && { projectId: projectId as string })
      },
      include: { crew: true, project: true }
    })
    res.json(logs)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const log = await prisma.log.findUnique({
      where: { id },
      include: { crew: true, project: true }
    })
    if (!log) return res.status(404).json({ error: 'Bitácora no encontrada' })
    res.json(log)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createLog = async (req: Request, res: Response) => {
  try {
    const { crewId, projectId, fecha, actividades, incidentes, materiales, tiempos, observaciones, estado_herramientas } = req.body

    if (!crewId || !projectId || !fecha) {
      return res.status(400).json({ error: 'crewId, projectId y fecha son requeridos' })
    }

    const log = await prisma.log.create({
      data: {
        crewId,
        projectId,
        fecha: new Date(fecha),
        descripcion: actividades || '',
        actividades: actividades || '',
        incidentes: incidentes || '',
        consumo_materiales: materiales || '',
        materiales_consumidos: materiales || '',
        tiempos_trabajo: tiempos || '',
        observaciones: observaciones || '',
        estado_herramientas: estado_herramientas || '',
        responsableId: (req as AuthRequest).user.id
      },
      include: { crew: true, project: true }
    })
    res.json(log)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { actividades, incidentes, materiales, tiempos, observaciones, estado_herramientas } = req.body

    const log = await prisma.log.update({
      where: { id },
      data: {
        ...(actividades && { actividades }),
        ...(incidentes && { incidentes }),
        ...(materiales && { materiales_consumido: materiales }),
        ...(tiempos && { tiempos_trabajo: tiempos }),
        ...(observaciones && { observaciones }),
        ...(estado_herramientas && { estado_herramientas })
      }
    })
    res.json(log)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.log.delete({ where: { id } })
    res.json({ ok: true, msg: 'Bitácora eliminada' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
