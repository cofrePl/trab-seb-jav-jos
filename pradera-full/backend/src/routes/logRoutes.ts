import { Router } from 'express'
import { getLogs, getLogById, createLog, updateLog, deleteLog } from '../controllers/logController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getLogs)
router.get('/:id', ensureAuth, getLogById)
router.post('/', ensureAuth, createLog)
router.put('/:id', ensureAuth, updateLog)
router.delete('/:id', ensureAuth, deleteLog)

export default router
