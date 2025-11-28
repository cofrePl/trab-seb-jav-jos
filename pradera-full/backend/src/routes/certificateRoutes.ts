import { Router } from 'express'
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  addWorkerCertificate,
  removeWorkerCertificate
} from '../controllers/certificateController'
import { ensureAuth } from '../middleware/auth'
import { auditLog } from '../middleware/auditMiddleware'

const router = Router()

router.get('/', ensureAuth, getCertificates)
router.get('/:id', ensureAuth, getCertificateById)
router.post('/', ensureAuth, auditLog('CREATE', 'Certificate'), createCertificate)
router.put('/:id', ensureAuth, auditLog('UPDATE', 'Certificate'), updateCertificate)
router.delete('/:id', ensureAuth, auditLog('DELETE', 'Certificate'), deleteCertificate)
router.post('/:id/worker/add', ensureAuth, auditLog('UPDATE', 'CertificateWorker'), addWorkerCertificate)
router.post('/:id/worker/remove', ensureAuth, auditLog('UPDATE', 'CertificateWorker'), removeWorkerCertificate)

export default router
