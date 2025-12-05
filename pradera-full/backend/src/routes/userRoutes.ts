import { Router } from 'express'
import { getUsers } from '../controllers/userController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getUsers)

export default router
