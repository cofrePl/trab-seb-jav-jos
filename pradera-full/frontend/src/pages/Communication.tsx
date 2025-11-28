import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  senderName?: string
  receiverName?: string
}

interface Request {
  id: string
  senderId: string
  requestType: string
  description: string
  urgency: string
  crewId: string
  estado: string
  createdAt: string
  senderName?: string
}

export default function Communication() {
  const [messages, setMessages] = useState<Message[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedTab, setSelectedTab] = useState('mensajes')
  const [loading, setLoading] = useState(true)
  const [messageContent, setMessageContent] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [workers, setWorkers] = useState<any[]>([])
  const [requestInput, setRequestInput] = useState({
    requestType: 'MATERIAL',
    description: '',
    urgency: 'NORMAL',
    crewId: ''
  })
  const [crews, setCrews] = useState<any[]>([])
  const { token, user } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [messagesRes, requestsRes, workersRes, crewsRes] = await Promise.all([
        api.get('/communication/messages'),
        api.get('/communication/requests'),
        api.get('/workers'),
        api.get('/crews')
      ])
      setMessages(messagesRes.data)
      setRequests(requestsRes.data)
      setWorkers(workersRes.data)
      setCrews(crewsRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !receiverId) {
      alert('Completa todos los campos')
      return
    }

    try {
      await api.post('/communication/messages', {
        receiverId,
        content: messageContent
      })
      setMessageContent('')
      setReceiverId('')
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestInput.description.trim() || !requestInput.crewId) {
      alert('Completa todos los campos')
      return
    }

    try {
      await api.post('/communication/requests', {
        requestType: requestInput.requestType,
        description: requestInput.description,
        urgency: requestInput.urgency,
        crewId: requestInput.crewId
      })
      setRequestInput({
        requestType: 'MATERIAL',
        description: '',
        urgency: 'NORMAL',
        crewId: ''
      })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await api.put(`/communication/requests/${requestId}`, {
        estado: 'APROBADA',
        respuesta: 'Solicitud aprobada'
      })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.put(`/communication/requests/${requestId}`, {
        estado: 'RECHAZADA',
        respuesta: 'Solicitud rechazada'
      })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800'
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800'
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENTE':
        return 'bg-red-100 text-red-800'
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Comunicación</h1>

      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setSelectedTab('mensajes')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'mensajes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Mensajes
        </button>
        <button
          onClick={() => setSelectedTab('solicitudes')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'solicitudes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Solicitudes
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <>
          {selectedTab === 'mensajes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario */}
              <div className="lg:col-span-1 bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Nuevo Mensaje</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Para:</label>
                    <select
                      value={receiverId}
                      onChange={e => setReceiverId(e.target.value)}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Selecciona trabajador</option>
                      {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mensaje:</label>
                    <textarea
                      value={messageContent}
                      onChange={e => setMessageContent(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="w-full border rounded p-2 h-24 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Enviar
                  </button>
                </form>
              </div>

              {/* Lista de mensajes */}
              <div className="lg:col-span-2 bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Mensajes Recientes</h2>
                {messages.length === 0 ? (
                  <p className="text-gray-500">Sin mensajes</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map(msg => (
                      <div key={msg.id} className="p-3 border rounded hover:bg-gray-50">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-sm text-gray-800">{msg.senderName || 'Usuario'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'solicitudes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formulario */}
              <div className="lg:col-span-1 bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Nueva Solicitud</h2>
                <form onSubmit={handleSendRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo:</label>
                    <select
                      value={requestInput.requestType}
                      onChange={e => setRequestInput({ ...requestInput, requestType: e.target.value })}
                      className="w-full border rounded p-2"
                    >
                      <option value="MATERIAL">Material</option>
                      <option value="HERRAMIENTA">Herramienta</option>
                      <option value="APOYO">Apoyo</option>
                      <option value="PERMISO">Permiso</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cuadrilla:</label>
                    <select
                      value={requestInput.crewId}
                      onChange={e => setRequestInput({ ...requestInput, crewId: e.target.value })}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Selecciona cuadrilla</option>
                      {crews.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Urgencia:</label>
                    <select
                      value={requestInput.urgency}
                      onChange={e => setRequestInput({ ...requestInput, urgency: e.target.value })}
                      className="w-full border rounded p-2"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Descripción:</label>
                    <textarea
                      value={requestInput.description}
                      onChange={e => setRequestInput({ ...requestInput, description: e.target.value })}
                      placeholder="Describe tu solicitud..."
                      className="w-full border rounded p-2 h-24 resize-none"
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Enviar Solicitud
                  </button>
                </form>
              </div>

              {/* Lista de solicitudes */}
              <div className="lg:col-span-2 bg-white p-6 rounded shadow">
                <h2 className="text-lg font-bold mb-4">Solicitudes</h2>
                {requests.length === 0 ? (
                  <p className="text-gray-500">Sin solicitudes</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {requests.map(req => (
                      <div key={req.id} className="p-3 border rounded hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-800">{req.requestType}</p>
                            <p className="text-xs text-gray-600">{req.senderName || 'Usuario'} - {new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(req.estado)}`}>
                              {req.estado}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(req.urgency)}`}>
                              {req.urgency}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{req.description}</p>
                        {req.estado === 'PENDIENTE' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="flex-1 bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="flex-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
