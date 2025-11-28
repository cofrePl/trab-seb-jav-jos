import { Request, Response } from 'express'
import prisma from '../services/prismaClient'

export const getCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      include: { workers: { select: { id: true, name: true } } }
    })
    res.json(certificates)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { workers: true }
    })
    if (!certificate) return res.status(404).json({ error: 'Certificado no encontrado' })
    res.json(certificate)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    if (!name) return res.status(400).json({ error: 'name es requerido' })

    const certificate = await prisma.certificate.create({
      data: { name, description }
    })
    res.status(201).json(certificate)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const certificate = await prisma.certificate.update({
      where: { id },
      data: { ...(name && { name }), ...(description && { description }) }
    })
    res.json(certificate)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.certificate.delete({ where: { id } })
    res.json({ ok: true, msg: 'Certificado eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const addWorkerCertificate = async (req: Request, res: Response) => {
  try {
    const { workerId, certificateId } = req.body
    if (!workerId || !certificateId) {
      return res.status(400).json({ error: 'workerId y certificateId son requeridos' })
    }

    const certificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        workers: {
          connect: { id: workerId }
        }
      },
      include: { workers: true }
    })
    res.json(certificate)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const removeWorkerCertificate = async (req: Request, res: Response) => {
  try {
    const { workerId, certificateId } = req.body
    if (!workerId || !certificateId) {
      return res.status(400).json({ error: 'workerId y certificateId son requeridos' })
    }

    const certificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        workers: {
          disconnect: { id: workerId }
        }
      },
      include: { workers: true }
    })
    res.json(certificate)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
