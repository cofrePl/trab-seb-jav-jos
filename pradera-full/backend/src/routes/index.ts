import { Router } from 'express'
import auth from './auth'
import projects from './projectRoutes'
import workers from './workerRoutes'
import crews from './crewRoutes'
import materials from './materialRoutes'
import logs from './logRoutes'
import communication from './communicationRoutes'
import reports from './reportRoutes'
import certificates from './certificateRoutes'
import tasks from './taskRoutes'
import audit from './auditRoutes'

const router = Router()

router.use('/auth', auth)
router.use('/projects', projects)
router.use('/workers', workers)
router.use('/crews', crews)
router.use('/materials', materials)
router.use('/logs', logs)
router.use('/communication', communication)
router.use('/reports', reports)
router.use('/certificates', certificates)
router.use('/planning', tasks)
router.use('/audit', audit)

export default router
