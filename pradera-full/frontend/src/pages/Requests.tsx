import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Request {
  id: string
  senderId: string
  requestType: string
  description: string
  urgency: string
  status: string
  response?: string
  createdAt: string
}

interface Crew {
  id: string
  name: string
}

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [crews, setCrews] = useState<Crew[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    requestType: 'MATERIAL',
    description: '',
    urgency: 'NORMAL',
    crewId: ''
  })
  const { user, token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchRequests()
  }, [token, user])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const [requestsRes, crewsRes] = await Promise.all([
        api.get('/communication/requests'),
        api.get('/crews')
      ])
      setRequests(requestsRes.data)
      setCrews(crewsRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/communication/requests/${editingId}`, {
          ...form,
          senderId: user?.id
        })
      } else {
        await api.post('/communication/requests', {
          ...form,
          senderId: user?.id
        })
      }
      setForm({ requestType: 'MATERIAL', description: '', urgency: 'NORMAL', crewId: '' })
      setEditingId(null)
      setShowForm(false)
      fetchRequests()
    } catch (err: any) {
      console.error('Error:', err)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/communication/requests/${id}`, {
        status: 'APROBADA',
        response: 'Solicitud aprobada'
      })
      fetchRequests()
    } catch (err: any) {
      console.error('Error:', err)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await api.put(`/communication/requests/${id}`, {
        status: 'RECHAZADA',
        response: 'Solicitud rechazada'
      })
      fetchRequests()
    } catch (err: any) {
      console.error('Error:', err)
    }
  }

  const handleEdit = (req: any) => {
    setForm({
      requestType: req.requestType,
      description: req.description,
      urgency: req.urgency,
      crewId: req.crewId || '' // Assuming crewId might be missing in older records
    })
    setEditingId(req.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return
    try {
      await api.delete(`/communication/requests/${id}`)
      fetchRequests()
    } catch (err: any) {
      console.error('Error:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800'
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENTE':
        return 'text-red-600 font-bold'
      case 'NORMAL':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Solicitudes</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ requestType: 'MATERIAL', description: '', urgency: 'NORMAL', crewId: '' }) }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Solicitud
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Solicitud</label>
              <select
                value={form.requestType}
                onChange={e => setForm({ ...form, requestType: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="MATERIAL">Material</option>
                <option value="HERRAMIENTA">Herramienta</option>
                <option value="APOYO">Apoyo</option>
                <option value="PERMISO">Permiso Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cuadrilla</label>
              <select
                value={form.crewId}
                onChange={e => setForm({ ...form, crewId: e.target.value })}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar cuadrilla</option>
                {crews.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                placeholder="Describe tu solicitud..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urgencia</label>
              <select
                value={form.urgency}
                onChange={e => setForm({ ...form, urgency: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Enviar Solicitud
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <div className="grid gap-4">
          {requests.length === 0 ? (
            <p className="text-gray-500">Sin solicitudes</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{req.requestType}</h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {new Date(req.createdAt).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${getUrgencyColor(req.urgency)}`}>
                      {req.urgency}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{req.description}</p>

                {req.response && (
                  <p className="text-sm text-gray-600 mb-3 italic">
                    Respuesta: {req.response}
                  </p>
                )}

                {req.status === 'PENDIENTE' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Rechazar
                    </button>
                  </div>
                )}
                <div className="mt-2 flex gap-2 justify-end">
                  <button onClick={() => handleEdit(req)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                  <button onClick={() => handleDelete(req.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
