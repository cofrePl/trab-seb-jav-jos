import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string
  changes?: any
  createdAt: string
  user?: { firstName: string; lastName: string; email: string }
}

interface AuditStatistics {
  CREATE: number
  UPDATE: number
  DELETE: number
}

export default function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterEntity, setFilterEntity] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token, filterEntity, filterAction, dateFrom, dateTo])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [logsRes, statsRes] = await Promise.all([
        api.get('/audit', {
          params: {
            entity: filterEntity,
            action: filterAction,
            dateFrom,
            dateTo
          }
        }),
        api.get('/audit/statistics/summary')
      ])
      setLogs(logsRes.data)
      setStats(statsRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800'
      case 'UPDATE': return 'bg-blue-100 text-blue-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return '✚'
      case 'UPDATE': return '✎'
      case 'DELETE': return '✕'
      default: return '○'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Auditoría del Sistema</h1>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-6 rounded shadow border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Creaciones</p>
            <p className="text-3xl font-bold text-green-600">{stats.CREATE}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded shadow border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Modificaciones</p>
            <p className="text-3xl font-bold text-blue-600">{stats.UPDATE}</p>
          </div>
          <div className="bg-red-50 p-6 rounded shadow border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium">Eliminaciones</p>
            <p className="text-3xl font-bold text-red-600">{stats.DELETE}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Entidad:</label>
            <input
              type="text"
              value={filterEntity}
              onChange={e => setFilterEntity(e.target.value)}
              placeholder="ej: Project, Worker"
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Acción:</label>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">Todas</option>
              <option value="CREATE">Crear</option>
              <option value="UPDATE">Modificar</option>
              <option value="DELETE">Eliminar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Desde:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasta:</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Logs */}
      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No hay registros de auditoría</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded shadow border-l-4 border-gray-300 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {log.entity} #{log.entityId}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Por: {log.user?.firstName} {log.user?.lastName} ({log.user?.email})
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString('es-CL')}
                  </p>
                </div>

                {log.changes && Object.keys(log.changes).length > 0 && (
                  <div className="mt-3 pl-11 bg-gray-50 p-3 rounded text-xs">
                    <p className="font-medium text-gray-700 mb-1">Cambios:</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {Object.entries(log.changes).map(([key, value]: any) => (
                        <div key={key} className="text-gray-600">
                          <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
