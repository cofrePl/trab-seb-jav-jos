import { Request, Response } from 'express'
import prisma from '../services/prismaClient'
import { bannedWords } from '../constants/bannedWords'
import { albures } from '../constants/albures'

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

const validateRut = (rut: string) => {
  if (!rut) return true
  const cleanRut = rut.replace(/[^0-9kK]/g, '')
  if (cleanRut.length < 2) return false

  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1).toUpperCase()

  if (!/^\d+$/.test(body)) return false

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const expectedDv = 11 - (sum % 11)
  const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString()

  return dv === calculatedDv
}

export const createWorker = async (req: Request, res: Response) => {
  try {
    const { name, rut, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body
    if (!name || !especialidad) {
      return res.status(400).json({ error: 'Nombre y especialidad son requeridos' })
    }
    if (rut && !validateRut(rut)) {
      return res.status(400).json({ error: 'RUT inválido' })
    }
    if (/\d/.test(name)) {
      return res.status(400).json({ error: 'El nombre no puede contener números' })
    }
    for (const word of bannedWords) {
      if (name.toLowerCase().includes(word.toLowerCase())) {
        return res.status(400).json({ error: `La palabra '${word}' no está permitida en el nombre` })
      }
    }
    for (const albur of albures) {
      if (name.toLowerCase().includes(albur.toLowerCase())) {
        return res.status(400).json({ error: 'El nombre contiene una frase no permitida' })
      }
    }
    if (/\d/.test(especialidad)) {
      return res.status(400).json({ error: 'La especialidad no puede contener números' })
    }
    if (experiencia && (parseInt(experiencia) < 0 || parseInt(experiencia) > 50)) {
      return res.status(400).json({ error: 'Los años de experiencia deben estar entre 0 y 50' })
    }
    const worker = await prisma.worker.create({
      data: {
        name,
        rut,
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
    const { name, rut, especialidad, certificaciones, experiencia, disponibilidad, estado } = req.body
    if (rut && !validateRut(rut)) {
      return res.status(400).json({ error: 'RUT inválido' })
    }
    if (name && /\d/.test(name)) {
      return res.status(400).json({ error: 'El nombre no puede contener números' })
    }
    if (name) {
      for (const word of bannedWords) {
        if (name.toLowerCase().includes(word.toLowerCase())) {
          return res.status(400).json({ error: `La palabra '${word}' no está permitida en el nombre` })
        }
      }
      for (const albur of albures) {
        if (name.toLowerCase().includes(albur.toLowerCase())) {
          return res.status(400).json({ error: 'El nombre contiene una frase no permitida' })
        }
      }
    }
    if (especialidad && /\d/.test(especialidad)) {
      return res.status(400).json({ error: 'La especialidad no puede contener números' })
    }
    if (experiencia !== undefined && (parseInt(experiencia) < 0 || parseInt(experiencia) > 50)) {
      return res.status(400).json({ error: 'Los años de experiencia deben estar entre 0 y 50' })
    }
    const worker = await prisma.worker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(rut && { rut }),
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
    if (error.code === 'P2003' || error.message.toLowerCase().includes('foreign key constraint')) {
      return res.status(400).json({ error: 'No se puede eliminar el trabajador porque está asignado a una o más cuadrillas.' })
    }
    res.status(500).json({ error: error.message })
  }
}
