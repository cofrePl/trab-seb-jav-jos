import { Router } from 'express'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone
} from '../controllers/taskController'
import { ensureAuth } from '../middleware/auth'
import { auditLog } from '../middleware/auditMiddleware'

const router = Router()

// Tasks
router.get('/tasks', ensureAuth, getTasks)
router.post('/tasks', ensureAuth, auditLog('CREATE', 'Task'), createTask)
router.put('/tasks/:id', ensureAuth, auditLog('UPDATE', 'Task'), updateTask)
router.delete('/tasks/:id', ensureAuth, auditLog('DELETE', 'Task'), deleteTask)

// Milestones
router.get('/milestones', ensureAuth, getMilestones)
router.post('/milestones', ensureAuth, auditLog('CREATE', 'Milestone'), createMilestone)
router.put('/milestones/:id', ensureAuth, auditLog('UPDATE', 'Milestone'), updateMilestone)
router.delete('/milestones/:id', ensureAuth, auditLog('DELETE', 'Milestone'), deleteMilestone)

export default router
