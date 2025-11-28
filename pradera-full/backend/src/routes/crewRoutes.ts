import { Router } from 'express'
import { getCrews, getCrewById, createCrew, updateCrew, deleteCrew, addWorkerToCrew, removeWorkerFromCrew } from '../controllers/crewController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getCrews)
router.get('/:id', ensureAuth, getCrewById)
router.post('/', ensureAuth, createCrew)
router.put('/:id', ensureAuth, updateCrew)
router.delete('/:id', ensureAuth, deleteCrew)
router.post('/:crewId/workers', ensureAuth, addWorkerToCrew)
router.delete('/workers/:crewWorkerId', ensureAuth, removeWorkerFromCrew)

export default router
