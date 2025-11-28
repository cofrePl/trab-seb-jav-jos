import { Router } from 'express'
import { getProjectReport, getAllProjectsReport, getWorkerMetrics, getInventoryMetrics } from '../controllers/reportController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/projects', ensureAuth, getAllProjectsReport)
router.get('/projects/:projectId', ensureAuth, getProjectReport)
router.get('/workers/:workerId', ensureAuth, getWorkerMetrics)
router.get('/inventory', ensureAuth, getInventoryMetrics)

export default router
