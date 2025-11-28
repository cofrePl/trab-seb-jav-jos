import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Certificate {
  id: string
  name: string
  description?: string
  workers?: any[]
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: ''
  })
  const [selectedCert, setSelectedCert] = useState<string>('')
  const [selectedWorker, setSelectedWorker] = useState<string>('')
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [certsRes, workersRes] = await Promise.all([
        api.get('/certificates'),
        api.get('/workers')
      ])
      setCertificates(certsRes.data)
      setWorkers(workersRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/certificates', form)
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleAddWorker = async () => {
    if (!selectedCert || !selectedWorker) {
      alert('Selecciona certificado y trabajador')
      return
    }
    try {
      await api.post(`/certificates/${selectedCert}/worker/add`, {
        workerId: selectedWorker,
        certificateId: selectedCert
      })
      setSelectedWorker('')
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleRemoveWorker = async (certId: string, workerId: string) => {
    try {
      await api.post(`/certificates/${certId}/worker/remove`, {
        workerId,
        certificateId: certId
      })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este certificado?')) return
    try {
      await api.delete(`/certificates/${id}`)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Certificaciones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Certificación
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Nueva Certificación</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre:</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Licencia de Operador"
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción:</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descripción de la certificación..."
                className="w-full border rounded p-2 h-24 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Asignar Certificación a Trabajador</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedCert}
            onChange={e => setSelectedCert(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Selecciona certificación</option>
            {certificates.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedWorker}
            onChange={e => setSelectedWorker(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Selecciona trabajador</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddWorker}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Asignar
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <div className="space-y-4">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{cert.name}</h3>
                  {cert.description && (
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
              {cert.workers && cert.workers.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">Trabajadores con esta certificación:</p>
                  <div className="flex flex-wrap gap-2">
                    {cert.workers.map(w => (
                      <div key={w.id} className="bg-blue-100 px-3 py-1 rounded flex items-center gap-2">
                        <span className="text-sm">{w.name}</span>
                        <button
                          onClick={() => handleRemoveWorker(cert.id, w.id)}
                          className="text-red-600 hover:text-red-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
