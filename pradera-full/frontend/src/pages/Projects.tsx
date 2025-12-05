import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { workZones } from '../constants/workZones'
import { bannedWords } from '../constants/bannedWords'
import { albures } from '../constants/albures'
import { projectTypes } from '../constants/projectTypes'

interface Project {
  id: string
  name: string
  tipo_obra: string
  complejidad: string
  duracion_estimada?: number
  zona_trabajo: string
  estado: string
  presupuesto?: number
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', tipo_obra: '', complejidad: '', duracion_estimada: '', zona_trabajo: '', estado: 'activo', presupuesto: '' })
  const [filteredProjectTypes, setFilteredProjectTypes] = useState<string[]>([])
  const [showProjectTypes, setShowProjectTypes] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    fetchProjects()
  }, [token, navigate])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/projects')
      setProjects(data)
      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      for (const word of bannedWords) {
        if (form.name.toLowerCase().includes(word.toLowerCase())) {
          setError(`La palabra '${word}' no está permitida en el nombre`)
          return
        }
      }
      for (const albur of albures) {
        if (form.name.toLowerCase().includes(albur.toLowerCase())) {
          setError('El nombre contiene una frase no permitida')
          return
        }
      }
      if (!projectTypes.includes(form.tipo_obra)) {
        setError('Debe seleccionar un tipo de obra válido de la lista')
        return
      }
      if (!form.complejidad) {
        setError('Debe seleccionar la complejidad')
        return
      }
      if (/\d/.test(form.zona_trabajo)) {
        setError('La zona de trabajo no puede contener números')
        return
      }
      if (!workZones.includes(form.zona_trabajo)) {
        setError('La zona de trabajo no es válida. Debe ser una de las zonas permitidas.')
        return
      }
      const presupuestoNum = Number(form.presupuesto)
      if (form.presupuesto && (presupuestoNum < 100000 || presupuestoNum > 10000000000000)) {
        setError('El presupuesto debe estar entre 100.000 y 10.000.000.000.000')
        return
      }
      if (editingId) {
        await api.put(`/projects/${editingId}`, form)
      } else {
        await api.post('/projects', form)
      }
      setForm({ name: '', tipo_obra: '', complejidad: '', duracion_estimada: '', zona_trabajo: '', estado: 'activo', presupuesto: '' })
      setEditingId(null)
      setShowForm(false)
      fetchProjects()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar proyecto')
    }
  }

  const handleEdit = (project: Project) => {
    setForm({
      name: project.name,
      tipo_obra: project.tipo_obra,
      complejidad: project.complejidad,
      duracion_estimada: project.duracion_estimada?.toString() || '',
      zona_trabajo: project.zona_trabajo,
      estado: project.estado,
      presupuesto: project.presupuesto?.toString() || ''
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm({ ...form, tipo_obra: value })
    if (value) {
      const filtered = projectTypes.filter(t => t.toLowerCase().includes(value.toLowerCase()))
      setFilteredProjectTypes(filtered)
      setShowProjectTypes(true)
    } else {
      setShowProjectTypes(false)
    }
  }

  const selectProjectType = (type: string) => {
    setForm({ ...form, tipo_obra: type })
    setShowProjectTypes(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este proyecto?')) return
    try {
      await api.delete(`/projects/${id}`)
      fetchProjects()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al eliminar proyecto')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Proyectos</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', tipo_obra: '', complejidad: '', duracion_estimada: '', zona_trabajo: '', estado: 'activo', presupuesto: '' }) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Proyecto
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-2 border rounded" />
            <div className="flex flex-col justify-center">
              <label className="text-sm text-gray-600 mb-1">Tipo de obra</label>
              <select value={form.tipo_obra} onChange={e => setForm({ ...form, tipo_obra: e.target.value })} required className="p-2 border rounded w-full">
                <option value="">Seleccione Tipo</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-sm text-gray-600 mb-1">Complejidad</label>
              <select value={form.complejidad} onChange={e => setForm({ ...form, complejidad: e.target.value })} className="p-2 border rounded w-full">
                <option value="" disabled>Seleccione...</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <input type="number" min="0" placeholder="Duración (días)" value={form.duracion_estimada} onChange={e => setForm({ ...form, duracion_estimada: e.target.value })} className="p-2 border rounded" />
            <input
              type="number"
              min="100000"
              max="10000000000000"
              placeholder="Presupuesto"
              value={form.presupuesto}
              onChange={e => setForm({ ...form, presupuesto: e.target.value })}
              className="p-2 border rounded"
            />
            <select value={form.zona_trabajo} onChange={e => setForm({ ...form, zona_trabajo: e.target.value })} required className="p-2 border rounded">
              <option value="">Seleccione Zona</option>
              {workZones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="p-2 border rounded">
              <option value="activo">Activo</option>
              <option value="en_proceso">En Proceso</option>
              <option value="pendiente">Pendiente</option>
              {editingId && <option value="finalizado">Finalizado</option>}
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
              <th className="border p-2 text-left">Tipo de obra</th>
              <th className="border p-2 text-left">Complejidad</th>
              <th className="border p-2 text-left">Zona</th>
              <th className="border p-2 text-left">Presupuesto</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={6} className="border p-2 text-center text-gray-500">Sin proyectos</td></tr>
            ) : (
              projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-100">
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.tipo_obra}</td>
                  <td className="border p-2">{p.complejidad}</td>
                  <td className="border p-2">{p.zona_trabajo}</td>
                  <td className="border p-2">{p.presupuesto ? `$${p.presupuesto.toLocaleString()}` : '-'}</td>
                  <td className="border p-2">{p.estado.replace(/_/g, ' ')}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Editar</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
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
