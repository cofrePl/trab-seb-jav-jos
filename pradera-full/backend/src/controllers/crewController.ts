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
    const { name, projectId, fecha_inicio, estado, cantidad_trabajadores, workerIds } = req.body
    if (!name || !estado) {
      return res.status(400).json({ error: 'Nombre y estado son requeridos' })
    }
    if (cantidad_trabajadores && (parseInt(cantidad_trabajadores) < 0 || parseInt(cantidad_trabajadores) > 1000)) {
      return res.status(400).json({ error: 'La cantidad de trabajadores debe estar entre 0 y 1000' })
    }
    const crew = await prisma.crew.create({
      data: {
        name,
        projectId: projectId || undefined,
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : new Date(),
        estado: estado || 'ACTIVA',
        cantidad_trabajadores: cantidad_trabajadores ? parseInt(cantidad_trabajadores) : undefined,
        crewWorkers: {
          create: workerIds ? workerIds.map((workerId: string) => ({
            workerId,
            role: 'TRABAJADOR' // Default role, can be enhanced later
          })) : []
        }
      },
      include: { crewWorkers: { include: { worker: true } } }
    })
    res.json(crew)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCrew = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, projectId, fecha_inicio, estado, cantidad_trabajadores, workerIds } = req.body


    // If workerIds is provided, we need to handle the relation update
    // This approach replaces existing workers with the new list
    if (workerIds) {
      // First delete existing relations (optional: or just add new ones, but usually we want to sync)
      // For simplicity in this update, let's delete all and recreate for this crew
      await prisma.crewWorker.deleteMany({ where: { crewId: id } })
    }

    if (cantidad_trabajadores && (parseInt(cantidad_trabajadores) < 0 || parseInt(cantidad_trabajadores) > 1000)) {
      return res.status(400).json({ error: 'La cantidad de trabajadores debe estar entre 0 y 1000' })
    }

    const crew = await prisma.crew.update({
      where: { id },
      data: {
        ...(name && { name }),
        projectId: projectId || null,
        ...(fecha_inicio && { fecha_inicio: new Date(fecha_inicio) }),
        ...(estado && { estado }),
        ...(cantidad_trabajadores && { cantidad_trabajadores: parseInt(cantidad_trabajadores) }),
        ...(workerIds && {
          crewWorkers: {
            create: workerIds.map((workerId: string) => ({
              workerId,
              role: 'TRABAJADOR'
            }))
          }
        })
      },
      include: { crewWorkers: { include: { worker: true } } }
    })
    res.json(crew)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteCrew = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // Delete associated workers first to avoid foreign key constraint violation
    await prisma.crewWorker.deleteMany({ where: { crewId: id } })
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
