import { Router } from 'express'
import { getWorkers, getWorkerById, createWorker, updateWorker, deleteWorker } from '../controllers/workerController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getWorkers)
router.get('/:id', ensureAuth, getWorkerById)
router.post('/', ensureAuth, createWorker)
router.put('/:id', ensureAuth, updateWorker)
router.delete('/:id', ensureAuth, deleteWorker)

export default router
