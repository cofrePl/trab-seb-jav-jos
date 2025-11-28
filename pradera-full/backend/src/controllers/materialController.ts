import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      include: { requests: true }
    })
    res.json(materials)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const material = await prisma.material.findUnique({
      where: { id },
      include: { requests: true }
    })
    if (!material) return res.status(404).json({ error: 'Material no encontrado' })
    res.json(material)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name, descripcion, stock, unidad, precio } = req.body
    if (!name || stock === undefined || !unidad || precio === undefined) {
      return res.status(400).json({ error: 'Nombre, stock, unidad y precio son requeridos' })
    }
    const material = await prisma.material.create({
      data: {
        name,
        descripcion: descripcion || '',
        stock: parseInt(stock),
        unidad,
        precio: parseFloat(precio)
      }
    })
    res.json(material)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, descripcion, stock, unidad, precio } = req.body
    const material = await prisma.material.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(descripcion && { descripcion }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(unidad && { unidad }),
        ...(precio !== undefined && { precio: parseFloat(precio) })
      }
    })
    res.json(material)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.material.delete({ where: { id } })
    res.json({ ok: true, msg: 'Material eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getMaterialRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.materialRequest.findMany({
      include: { material: true, project: true, crew: true }
    })
    res.json(requests)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createMaterialRequest = async (req: Request, res: Response) => {
  try {
    const { materialId, projectId, crewId, cantidad, estado } = req.body
    if (!materialId || !projectId || !crewId || cantidad === undefined) {
      return res.status(400).json({ error: 'materialId, projectId, crewId y cantidad son requeridos' })
    }
    const request = await prisma.materialRequest.create({
      data: {
        materialId,
        projectId,
        crewId,
        cantidad: parseInt(cantidad),
        estado: estado || 'PENDIENTE'
      }
    })
    res.json(request)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMaterialRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { cantidad, estado } = req.body
    const request = await prisma.materialRequest.update({
      where: { id },
      data: {
        ...(cantidad !== undefined && { cantidad: parseInt(cantidad) }),
        ...(estado && { estado })
      }
    })
    res.json(request)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteMaterialRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.materialRequest.delete({ where: { id } })
    res.json({ ok: true, msg: 'Solicitud eliminada' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
