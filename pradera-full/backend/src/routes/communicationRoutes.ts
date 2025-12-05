import { Router } from 'express'
import { getMessages, createMessage, createRequest, getRequests, updateRequest, deleteRequest } from '../controllers/communicationController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

// Mensajes
router.get('/messages', ensureAuth, getMessages)
router.post('/messages', ensureAuth, createMessage)

// Solicitudes
router.get('/requests', ensureAuth, getRequests)
router.post('/requests', ensureAuth, createRequest)
router.put('/requests/:id', ensureAuth, updateRequest)
router.delete('/requests/:id', ensureAuth, deleteRequest)

export default router
