import { Router } from 'express'
import {
  getAuditLogs,
  getAuditLogsByEntity,
  getAuditStatistics
} from '../controllers/auditController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getAuditLogs)
router.get('/entity/:entity/:entityId', ensureAuth, getAuditLogsByEntity)
router.get('/statistics/summary', ensureAuth, getAuditStatistics)

export default router
