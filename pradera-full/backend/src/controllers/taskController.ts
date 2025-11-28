import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { crewId, estado } = req.query
    const tasks = await prisma.task.findMany({
      where: {
        ...(crewId && { crewId: crewId as string }),
        ...(estado && { estado: estado as string })
      },
      include: { crew: true }
    })
    res.json(tasks)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { crewId, title, description, prioridad, fecha_vencimiento } = req.body
    if (!crewId || !title) {
      return res.status(400).json({ error: 'crewId y title son requeridos' })
    }

    const task = await prisma.task.create({
      data: {
        crewId,
        title,
        description,
        prioridad: prioridad || 'NORMAL',
        fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null
      },
      include: { crew: true }
    })
    res.status(201).json(task)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, prioridad, estado, fecha_vencimiento } = req.body

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(prioridad && { prioridad }),
        ...(estado && { estado }),
        ...(fecha_vencimiento && { fecha_vencimiento: new Date(fecha_vencimiento) })
      },
      include: { crew: true }
    })
    res.json(task)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.task.delete({ where: { id } })
    res.json({ ok: true, msg: 'Tarea eliminada' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getMilestones = async (req: Request, res: Response) => {
  try {
    const { projectId, estado } = req.query
    const milestones = await prisma.milestone.findMany({
      where: {
        ...(projectId && { projectId: projectId as string }),
        ...(estado && { estado: estado as string })
      },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { targetDate: 'asc' }
    })
    res.json(milestones)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createMilestone = async (req: Request, res: Response) => {
  try {
    const { projectId, title, description, targetDate } = req.body
    if (!projectId || !title || !targetDate) {
      return res.status(400).json({ error: 'projectId, title y targetDate son requeridos' })
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        title,
        description,
        targetDate: new Date(targetDate),
        estado: 'PENDIENTE'
      },
      include: { project: true }
    })
    res.status(201).json(milestone)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateMilestone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, targetDate, estado } = req.body

    const milestone = await prisma.milestone.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
        ...(estado && { estado })
      },
      include: { project: true }
    })
    res.json(milestone)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteMilestone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.milestone.delete({ where: { id } })
    res.json({ ok: true, msg: 'Hito eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
