import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getCrews = async (req: Request, res: Response) => {
  try {
    const crews = await prisma.crew.findMany({
      include: { project: true, crewWorkers: { include: { worker: true } }, logs: true }
    })
    res.json(crews)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getCrewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const crew = await prisma.crew.findUnique({
      where: { id },
      include: { project: true, crewWorkers: { include: { worker: true } }, logs: true }
    })
    if (!crew) return res.status(404).json({ error: 'Cuadrilla no encontrada' })
    res.json(crew)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createCrew = async (req: Request, res: Response) => {
  try {
    const { name, projectId, fecha_inicio, estado } = req.body
    if (!name || !estado) {
      return res.status(400).json({ error: 'Nombre y estado son requeridos' })
    }
    const crew = await prisma.crew.create({
      data: {
        name,
        projectId: projectId || undefined,
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
        estado: estado || 'ACTIVA'
      }
    })
    res.json(crew)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCrew = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, projectId, fecha_inicio, estado } = req.body
    const crew = await prisma.crew.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(projectId && { projectId }),
        ...(fecha_inicio && { fecha_inicio: new Date(fecha_inicio) }),
        ...(estado && { estado })
      }
    })
    res.json(crew)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteCrew = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.crew.delete({ where: { id } })
    res.json({ ok: true, msg: 'Cuadrilla eliminada' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const addWorkerToCrew = async (req: Request, res: Response) => {
  try {
    const { crewId, workerId, role } = req.body
    if (!crewId || !workerId || !role) {
      return res.status(400).json({ error: 'crewId, workerId y role son requeridos' })
    }
    const crewWorker = await prisma.crewWorker.create({
      data: { crewId, workerId, role }
    })
    res.json(crewWorker)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const removeWorkerFromCrew = async (req: Request, res: Response) => {
  try {
    const { crewWorkerId } = req.params
    await prisma.crewWorker.delete({ where: { id: crewWorkerId } })
    res.json({ ok: true, msg: 'Trabajador removido de la cuadrilla' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
