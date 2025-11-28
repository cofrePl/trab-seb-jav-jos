import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { crews: true, logs: true }
    })
    res.json(projects)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = await prisma.project.findUnique({
      where: { id },
      include: { crews: true, logs: true }
    })
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' })
    res.json(project)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, tipo_obra, complejidad, duracion_estimada, fecha_inicio, fecha_termino, zona_trabajo, estado, presupuesto, supervisor, descripcion_tecnica } = req.body
    if (!name || !tipo_obra || !zona_trabajo) {
      return res.status(400).json({ error: 'Nombre, tipo de obra y zona de trabajo son requeridos' })
    }
    if (duracion_estimada !== undefined && duracion_estimada !== null && parseInt(duracion_estimada) < 0) {
      return res.status(400).json({ error: 'La duración estimada no puede ser negativa. Mínimo: 0' })
    }
    const project = await prisma.project.create({
      data: {
        name,
        tipo_obra,
        complejidad: complejidad || 'media',
        duracion_estimada: duracion_estimada ? parseInt(duracion_estimada) : undefined,
        fecha_inicio: fecha_inicio ? new Date(fecha_inicio) : undefined,
        fecha_termino: fecha_termino ? new Date(fecha_termino) : undefined,
        zona_trabajo,
        estado: estado || 'activo',
        presupuesto: presupuesto ? parseFloat(presupuesto) : undefined,
        supervisor,
        descripcion_tecnica
      },
      include: { milestones: true }
    })
    
    // Generar hitos automáticos basado en fechas
    if (fecha_inicio && fecha_termino) {
      const start = new Date(fecha_inicio)
      const end = new Date(fecha_termino)
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
      
      const milestones = [
        { title: 'Inicio del Proyecto', targetDate: start, description: 'Kickoff del proyecto' },
        { title: 'Fase Media', targetDate: new Date(start.getTime() + (diffDays / 2) * 24 * 3600 * 1000), description: 'Punto medio del proyecto' },
        { title: 'Fin del Proyecto', targetDate: end, description: 'Cierre y entrega final' }
      ]
      
      for (const milestone of milestones) {
        await prisma.milestone.create({
          data: {
            projectId: project.id,
            title: milestone.title,
            description: milestone.description,
            targetDate: milestone.targetDate,
            estado: 'PENDIENTE'
          }
        })
      }
    }
    
    res.json(project)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, tipo_obra, complejidad, duracion_estimada, zona_trabajo, estado } = req.body
    if (duracion_estimada !== undefined && duracion_estimada !== null && parseInt(duracion_estimada) < 0) {
      return res.status(400).json({ error: 'La duración estimada no puede ser negativa. Mínimo: 0' })
    }
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(tipo_obra && { tipo_obra }),
        ...(complejidad && { complejidad }),
        ...(duracion_estimada && { duracion_estimada: parseInt(duracion_estimada) }),
        ...(zona_trabajo && { zona_trabajo }),
        ...(estado && { estado })
      }
    })
    res.json(project)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.project.delete({ where: { id } })
    res.json({ ok: true, msg: 'Proyecto eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
