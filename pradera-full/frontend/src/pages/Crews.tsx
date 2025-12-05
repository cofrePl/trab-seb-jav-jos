import React, { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Crew {
  id: string
  name: string
  projectId?: string
  fecha_inicio?: string
  estado: string
  cantidad_trabajadores?: number
  crewWorkers?: any[]
}

interface Project {
  id: string
  name: string
}

interface Worker {
  id: string
  name: string
  especialidad: string
  disponibilidad: boolean
}

export default function Crews() {
  const [crews, setCrew] = useState<Crew[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', projectId: '', estado: 'ACTIVA', cantidad_trabajadores: '', workerIds: [] as string[] })
  const [isWorkerListOpen, setIsWorkerListOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    fetchData()
  }, [token, navigate])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWorkerListOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [crewsRes, projectsRes, workersRes] = await Promise.all([
        api.get('/crews'),
        api.get('/projects'),
        api.get('/workers')
      ])
      setCrew(crewsRes.data)
      setProjects(projectsRes.data)
      setWorkers(workersRes.data)
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
      if (!form.projectId) {
        setError('Debes seleccionar un proyecto para la cuadrilla')
        return
      }
      const quantity = form.cantidad_trabajadores ? parseInt(form.cantidad_trabajadores) : 0
      if (quantity < 0 || quantity > 1000) {
        setError('La cantidad de trabajadores debe estar entre 0 y 1000')
        return
      }

      if (form.workerIds.length > quantity) {
        setError(`Has seleccionado ${form.workerIds.length} trabajadores, pero el límite es ${quantity}. Por favor deselecciona trabajadores.`)
        return
      }

      const data = {
        name: form.name,
        projectId: form.projectId || undefined,
        estado: form.estado,
        cantidad_trabajadores: form.cantidad_trabajadores,
        workerIds: form.workerIds
      }
      if (editingId) {
        await api.put(`/crews/${editingId}`, data)
      } else {
        await api.post('/crews', data)
      }
      setForm({ name: '', projectId: '', estado: 'ACTIVA', cantidad_trabajadores: '', workerIds: [] })
      setEditingId(null)
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar cuadrilla')
    }
  }

  const handleEdit = (crew: Crew) => {
    const validWorkerIds = (crew.crewWorkers?.map((cw: any) => cw.workerId) || []).filter((id: string) => {
      const worker = workers.find(w => w.id === id)
      return worker ? worker.disponibilidad : true
    })

    setForm({
      name: crew.name,
      projectId: crew.projectId || '',
      estado: crew.estado,
      cantidad_trabajadores: crew.cantidad_trabajadores?.toString() || '',
      workerIds: validWorkerIds
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

  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVA': return 'Activa'
      case 'EN_PAUSA': return 'En Pausa'
      case 'FINALIZADA': return 'Finalizada'
      default: return status
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cuadrillas</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', projectId: '', estado: 'ACTIVA', cantidad_trabajadores: '', workerIds: [] }) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
            <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="p-2 border rounded">
              <option value="ACTIVA">Activa</option>
              <option value="EN_PAUSA">En pausa</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
            <input
              type="number"
              min="0"
              max="1000"
              placeholder="Cantidad de trabajadores"
              value={form.cantidad_trabajadores}
              onChange={e => setForm({ ...form, cantidad_trabajadores: e.target.value })}
              className="p-2 border rounded"
            />

            <div className="col-span-2 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trabajadores</label>
              <div
                className="border rounded p-2 cursor-pointer bg-white flex justify-between items-center hover:border-blue-500 transition-colors"
                onClick={() => setIsWorkerListOpen(!isWorkerListOpen)}
              >
                <span className="text-gray-700">
                  {form.workerIds.length > 0
                    ? `${form.workerIds.length} seleccionado(s)`
                    : 'Seleccionar trabajadores'}
                  {form.cantidad_trabajadores ? ` (Máx: ${form.cantidad_trabajadores})` : ''}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isWorkerListOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isWorkerListOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
                  {workers.length === 0 ? (
                    <div className="p-3 text-gray-500 text-center">No hay trabajadores disponibles</div>
                  ) : (
                    workers.map(worker => (
                      <div
                        key={worker.id}
                        className={`p-3 border-b last:border-b-0 flex items-center justify-between ${!worker.disponibilidad
                          ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                          : 'hover:bg-gray-50 cursor-pointer'
                          } ${form.workerIds.includes(worker.id) ? 'bg-green-50' : ''}`}
                        onClick={() => {
                          if (!worker.disponibilidad) return

                          const isChecked = !form.workerIds.includes(worker.id)
                          const currentCount = form.workerIds.length
                          const limit = form.cantidad_trabajadores ? parseInt(form.cantidad_trabajadores) : Infinity

                          if (isChecked && currentCount >= limit) {
                            alert(`Solo puedes seleccionar ${limit} trabajadores`)
                            return
                          }

                          if (isChecked) {
                            setForm({ ...form, workerIds: [...form.workerIds, worker.id] })
                          } else {
                            setForm({ ...form, workerIds: form.workerIds.filter(id => id !== worker.id) })
                          }
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {worker.name}
                            {!worker.disponibilidad && <span className="text-red-500 text-xs ml-2">(No disponible)</span>}
                          </span>
                          <span className="text-xs text-gray-500">{worker.especialidad}</span>
                        </div>
                        {form.workerIds.includes(worker.id) && (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
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
                  <td className="border p-2">{formatStatus(c.estado)}</td>
                  <td className="border p-2">
                    {c.crewWorkers?.filter((cw: any) => cw.worker?.disponibilidad).length || 0}
                    {c.crewWorkers && c.crewWorkers.length !== c.crewWorkers.filter((cw: any) => cw.worker?.disponibilidad).length && (
                      <span className="text-xs text-red-500 ml-1">
                        ({(c.crewWorkers?.length || 0) - (c.crewWorkers?.filter((cw: any) => cw.worker?.disponibilidad).length || 0)} no disp.)
                      </span>
                    )}
                  </td>
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
