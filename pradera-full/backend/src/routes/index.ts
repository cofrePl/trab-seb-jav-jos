import { Router } from 'express'
import auth from './auth'
import projects from './projectRoutes'
import workers from './workerRoutes'
import crews from './crewRoutes'
import materials from './materialRoutes'
import logs from './logRoutes'
import communication from './communicationRoutes'
import reports from './reportRoutes'

import tasks from './taskRoutes'
import audit from './auditRoutes'
import users from './userRoutes'

const router = Router()

router.use('/auth', auth)
router.use('/projects', projects)
router.use('/workers', workers)
router.use('/crews', crews)
router.use('/materials', materials)
router.use('/logs', logs)
router.use('/communication', communication)
router.use('/reports', reports)

router.use('/planning', tasks)
router.use('/audit', audit)
router.use('/users', users)

export default router
