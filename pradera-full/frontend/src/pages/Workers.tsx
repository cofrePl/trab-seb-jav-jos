import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Worker {
  id: string
  name: string
  especialidad: string
  certificaciones?: string
  experiencia?: number
  disponibilidad: boolean
  estado: string
}

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' })
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    fetchWorkers()
  }, [token, navigate])

  const fetchWorkers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/workers')
      setWorkers(data)
      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar trabajadores')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/workers/${editingId}`, form)
      } else {
        await api.post('/workers', form)
      }
      setForm({ name: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' })
      setEditingId(null)
      setShowForm(false)
      fetchWorkers()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar trabajador')
    }
  }

  const handleEdit = (worker: Worker) => {
    setForm({
      name: worker.name,
      especialidad: worker.especialidad,
      certificaciones: worker.certificaciones || '',
      experiencia: worker.experiencia?.toString() || '',
      disponibilidad: worker.disponibilidad,
      estado: worker.estado
    })
    setEditingId(worker.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este trabajador?')) return
    try {
      await api.delete(`/workers/${id}`)
      fetchWorkers()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al eliminar trabajador')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trabajadores</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' }) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Trabajador
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Especialidad" value={form.especialidad} onChange={e => setForm({ ...form, especialidad: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Certificaciones" value={form.certificaciones} onChange={e => setForm({ ...form, certificaciones: e.target.value })} className="p-2 border rounded" />
            <input type="number" placeholder="Años experiencia" value={form.experiencia} onChange={e => setForm({ ...form, experiencia: e.target.value })} className="p-2 border rounded" />
            <label className="flex items-center">
              <input type="checkbox" checked={form.disponibilidad} onChange={e => setForm({ ...form, disponibilidad: e.target.checked })} className="mr-2" />
              <span>Disponible</span>
            </label>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="p-2 border rounded">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Especialidad</th>
              <th className="border p-2 text-left">Experiencia</th>
              <th className="border p-2 text-left">Disponible</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr><td colSpan={6} className="border p-2 text-center text-gray-500">Sin trabajadores</td></tr>
            ) : (
              workers.map(w => (
                <tr key={w.id} className="hover:bg-gray-100">
                  <td className="border p-2">{w.name}</td>
                  <td className="border p-2">{w.especialidad}</td>
                  <td className="border p-2">{w.experiencia ? `${w.experiencia} años` : '-'}</td>
                  <td className="border p-2">{w.disponibilidad ? '✅' : '❌'}</td>
                  <td className="border p-2">{w.estado}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(w)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Editar</button>
                    <button onClick={() => handleDelete(w.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
