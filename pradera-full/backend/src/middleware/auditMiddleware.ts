import { Request, Response, NextFunction } from 'express'
import { createAuditLog } from '../controllers/auditController'

export interface AuditRequest extends Request {
  auditData?: {
    action: string
    entity: string
    entityId?: string
    projectId?: string
    changes?: any
  }
}

export const auditLog = (action: string, entity: string) => {
  return async (req: AuditRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send

    res.send = function (data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = (req as any).user
        let entityId: string | null = null
        let projectId: string | null = null
        let changes: any = null

        if (req.body?.id) entityId = req.body.id
        if (req.params?.id) entityId = req.params.id
        if (req.body?.projectId) projectId = req.body.projectId
        if (req.body?.crewId) projectId = req.body.crewId

        if (action === 'CREATE' || action === 'UPDATE') {
          changes = req.body
        }

        if (user) {
          createAuditLog(user.id, action, entity, entityId, projectId, changes).catch(
            err => console.error('Audit error:', err)
          )
        }
      }

      res.send = originalSend
      return originalSend.call(this, data)
    }

    next()
  }
}
