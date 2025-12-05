import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId, userId } = req.query

    const messages = await prisma.message.findMany({
      where: {
        ...(conversationId && { conversationId: conversationId as string }),
        ...(userId && {
          OR: [
            { senderId: userId as string },
            { receiverId: userId as string }
          ]
        })
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(messages)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body
    const user = (req as any).user

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'receiverId y content son requeridos' })
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        conversationId: [user.id, receiverId].sort().join('_')
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } }
      }
    })

    res.status(201).json(message)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { requestType, description, urgency, crewId } = req.body
    const user = (req as any).user

    if (!requestType || !description || !crewId) {
      return res.status(400).json({ error: 'requestType, description y crewId son requeridos' })
    }

    const request = await prisma.communicationRequest.create({
      data: {
        senderId: user.id,
        requestType,
        description,
        urgency: urgency || 'NORMAL',
        crewId,
        estado: 'PENDIENTE'
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        crew: { select: { id: true, name: true } }
      }
    })

    res.status(201).json(request)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getRequests = async (req: Request, res: Response) => {
  try {
    const { estado, userId } = req.query

    const requests = await prisma.communicationRequest.findMany({
      where: {
        ...(estado && { estado: estado as 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' }),
        ...(userId && { senderId: userId as string })
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        crew: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(requests)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { requestType, description, urgency, crewId, estado, respuesta } = req.body

    const request = await prisma.communicationRequest.update({
      where: { id },
      data: {
        ...(requestType && { requestType }),
        ...(description && { description }),
        ...(urgency && { urgency }),
        ...(crewId && { crewId }),
        ...(estado && { estado }),
        ...(respuesta && { respuesta })
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
        crew: { select: { id: true, name: true } }
      }
    })

    res.json(request)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.communicationRequest.delete({ where: { id } })
    res.json({ ok: true, msg: 'Solicitud eliminada' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
