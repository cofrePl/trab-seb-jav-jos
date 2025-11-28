import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Crew {
  id: string
  name: string
  projectId?: string
  fecha_inicio?: string
  estado: string
  crewWorkers?: any[]
}

interface Project {
  id: string
  name: string
}

export default function Crews() {
  const [crews, setCrew] = useState<Crew[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', projectId: '', estado: 'ACTIVA' })
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    fetchData()
  }, [token, navigate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [crewsRes, projectsRes] = await Promise.all([
        api.get('/crews'),
        api.get('/projects')
      ])
      setCrew(crewsRes.data)
      setProjects(projectsRes.data)
      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        name: form.name,
        projectId: form.projectId || undefined,
        estado: form.estado
      }
      if (editingId) {
        await api.put(`/crews/${editingId}`, data)
      } else {
        await api.post('/crews', data)
      }
      setForm({ name: '', projectId: '', estado: 'ACTIVA' })
      setEditingId(null)
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar cuadrilla')
    }
  }

  const handleEdit = (crew: Crew) => {
    setForm({
      name: crew.name,
      projectId: crew.projectId || '',
      estado: crew.estado
    })
    setEditingId(crew.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta cuadrilla?')) return
    try {
      await api.delete(`/crews/${id}`)
      fetchData()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al eliminar cuadrilla')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cuadrillas</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', projectId: '', estado: 'ACTIVA' }) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nueva Cuadrilla
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-2 border rounded" />
            <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} className="p-2 border rounded">
              <option value="">Sin proyecto</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="p-2 border rounded col-span-2">
              <option value="ACTIVA">Activa</option>
              <option value="EN_PAUSA">En pausa</option>
              <option value="FINALIZADA">Finalizada</option>
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
              <th className="border p-2 text-left">Proyecto</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Trabajadores</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {crews.length === 0 ? (
              <tr><td colSpan={5} className="border p-2 text-center text-gray-500">Sin cuadrillas</td></tr>
            ) : (
              crews.map(c => (
                <tr key={c.id} className="hover:bg-gray-100">
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.projectId ? projects.find(p => p.id === c.projectId)?.name : '-'}</td>
                  <td className="border p-2">{c.estado}</td>
                  <td className="border p-2">{c.crewWorkers?.length || 0}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(c)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
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
