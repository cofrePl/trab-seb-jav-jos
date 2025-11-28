import { Router } from 'express'
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getProjects)
router.get('/:id', ensureAuth, getProjectById)
router.post('/', ensureAuth, createProject)
router.put('/:id', ensureAuth, updateProject)
router.delete('/:id', ensureAuth, deleteProject)

export default router
