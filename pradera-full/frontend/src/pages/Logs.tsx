import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Log {
  id: string
  crewId: string
  projectId: string
  fecha: Date
  actividades?: string
  incidentes?: string
  materiales_consumidos?: string
  tiempos_trabajo?: string
  observaciones?: string
  estado_herramientas?: string
  crew?: { id: string; name: string }
  project?: { id: string; name: string }
}

interface Crew {
  id: string
  name: string
}

interface Project {
  id: string
  name: string
}

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [crews, setCrews] = useState<Crew[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    crewId: '',
    projectId: '',
    fecha: new Date().toISOString().split('T')[0],
    actividades: '',
    incidentes: '',
    materiales: '',
    tiempos: '',
    observaciones: '',
    estado_herramientas: ''
  })
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [logsRes, crewsRes, projectsRes] = await Promise.all([
        api.get('/logs'),
        api.get('/crews'),
        api.get('/projects')
      ])
      setLogs(logsRes.data)
      setCrews(crewsRes.data)
      setProjects(projectsRes.data)
    } catch (err: any) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/logs', form)
      setForm({
        crewId: '',
        projectId: '',
        fecha: new Date().toISOString().split('T')[0],
        actividades: '',
        incidentes: '',
        materiales: '',
        tiempos: '',
        observaciones: '',
        estado_herramientas: ''
      })
      setShowForm(false)
      fetchData()
    } catch (err: any) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bitácora de Proyectos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nueva Entrada
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Proyecto</label>
              <select
                value={form.projectId}
                onChange={e => setForm({ ...form, projectId: e.target.value })}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar proyecto</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
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
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input
                type="date"
                value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tareas Desarrolladas</label>
              <textarea
                value={form.actividades}
                onChange={e => setForm({ ...form, actividades: e.target.value })}
                placeholder="Descripción de actividades realizadas..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Incidentes</label>
              <textarea
                value={form.incidentes}
                onChange={e => setForm({ ...form, incidentes: e.target.value })}
                placeholder="Incidentes o eventualidades reportadas..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Consumo de Materiales</label>
              <textarea
                value={form.materiales}
                onChange={e => setForm({ ...form, materiales: e.target.value })}
                placeholder="Material: cantidad, Material: cantidad..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tiempos de Trabajo</label>
              <textarea
                value={form.tiempos}
                onChange={e => setForm({ ...form, tiempos: e.target.value })}
                placeholder="Trabajador: horas..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Observaciones</label>
              <textarea
                value={form.observaciones}
                onChange={e => setForm({ ...form, observaciones: e.target.value })}
                placeholder="Observaciones sobre desempeño del equipo..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado de Herramientas</label>
              <textarea
                value={form.estado_herramientas}
                onChange={e => setForm({ ...form, estado_herramientas: e.target.value })}
                placeholder="Herramienta: estado..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Guardar Bitácora
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
          {logs.length === 0 ? (
            <p className="text-gray-500">Sin entradas de bitácora</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{log.crew?.name || 'Sin cuadrilla'}</h3>
                    <p className="text-sm text-gray-600">Fecha: {new Date(log.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {log.project?.name || 'Sin proyecto'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {log.actividades && (
                    <div>
                      <p className="font-medium text-gray-700">Actividades:</p>
                      <p className="text-gray-600">{log.actividades.substring(0, 100)}...</p>
                    </div>
                  )}
                  {log.incidentes && (
                    <div>
                      <p className="font-medium text-gray-700">Incidentes:</p>
                      <p className="text-red-600">{log.incidentes.substring(0, 100)}...</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
