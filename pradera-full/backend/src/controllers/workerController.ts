import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await prisma.worker.findMany({
      include: { crewWorkers: true }
    })
    res.json(workers)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: { crewWorkers: true }
    })
    if (!worker) return res.status(404).json({ error: 'Trabajador no encontrado' })
    res.json(worker)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createWorker = async (req: Request, res: Response) => {
  try {
    const { name, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body
    if (!name || !especialidad) {
      return res.status(400).json({ error: 'Nombre y especialidad son requeridos' })
    }
    const worker = await prisma.worker.create({
      data: {
        name,
        especialidad,
        certificaciones: certificaciones || '',
        experiencia: experiencia ? parseInt(experiencia) : 0,
        disponibilidad: disponibilidad !== false,
        estado: estado || 'activo'
      }
    })
    res.json(worker)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body
    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(especialidad && { especialidad }),
        ...(certificaciones && { certificaciones }),
        ...(experiencia !== undefined && { experiencia: parseInt(experiencia) }),
        ...(disponibilidad !== undefined && { disponibilidad }),
        ...(estado && { estado })
      }
    })
    res.json(worker)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteWorker = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.worker.delete({ where: { id } })
    res.json({ ok: true, msg: 'Trabajador eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
