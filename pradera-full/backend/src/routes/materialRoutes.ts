import { Router } from 'express'
import { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial, getMaterialRequests, createMaterialRequest, updateMaterialRequest, deleteMaterialRequest } from '../controllers/materialController'
import { ensureAuth } from '../middleware/auth'

const router = Router()

router.get('/', ensureAuth, getMaterials)
router.get('/:id', ensureAuth, getMaterialById)
router.post('/', ensureAuth, createMaterial)
router.put('/:id', ensureAuth, updateMaterial)
router.delete('/:id', ensureAuth, deleteMaterial)

router.get('/requests/all', ensureAuth, getMaterialRequests)
router.post('/requests/create', ensureAuth, createMaterialRequest)
router.put('/requests/:id', ensureAuth, updateMaterialRequest)
router.delete('/requests/:id', ensureAuth, deleteMaterialRequest)

export default router
