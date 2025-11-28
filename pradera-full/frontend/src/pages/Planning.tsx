import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Task {
  id: string
  crewId: string
  title: string
  description?: string
  prioridad: string
  estado: string
  fecha_vencimiento?: string
  crew?: { name: string }
}

interface Milestone {
  id: string
  projectId: string
  title: string
  description?: string
  targetDate: string
  estado: string
  project?: { name: string }
}

interface Project {
  id: string
  name: string
}

interface Crew {
  id: string
  name: string
}

export default function Planning() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [crews, setCrews] = useState<Crew[]>([])
  const [selectedTab, setSelectedTab] = useState('tareas')
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  const [taskForm, setTaskForm] = useState({
    crewId: '',
    title: '',
    description: '',
    prioridad: 'NORMAL',
    fecha_vencimiento: ''
  })

  const [milestoneForm, setMilestoneForm] = useState({
    projectId: '',
    title: '',
    description: '',
    targetDate: ''
  })

  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tasksRes, milestonesRes, projectsRes, crewsRes] = await Promise.all([
        api.get('/planning/tasks'),
        api.get('/planning/milestones'),
        api.get('/projects'),
        api.get('/crews')
      ])
      setTasks(tasksRes.data)
      setMilestones(milestonesRes.data)
      setProjects(projectsRes.data)
      setCrews(crewsRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/planning/tasks', taskForm)
      setTaskForm({ crewId: '', title: '', description: '', prioridad: 'NORMAL', fecha_vencimiento: '' })
      setShowTaskForm(false)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/planning/milestones', milestoneForm)
      setMilestoneForm({ projectId: '', title: '', description: '', targetDate: '' })
      setShowMilestoneForm(false)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleUpdateTaskStatus = async (id: string, newEstado: string) => {
    try {
      await api.put(`/planning/tasks/${id}`, { estado: newEstado })
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('¿Eliminar tarea?')) return
    try {
      await api.delete(`/planning/tasks/${id}`)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const handleDeleteMilestone = async (id: string) => {
    if (!confirm('¿Eliminar hito?')) return
    try {
      await api.delete(`/planning/milestones/${id}`)
      fetchData()
    } catch (err: any) {
      alert('Error: ' + err.response?.data?.error)
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': return 'bg-red-100 text-red-800'
      case 'NORMAL': return 'bg-yellow-100 text-yellow-800'
      case 'BAJA': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-gray-100 text-gray-800'
      case 'EN_PROGRESO': return 'bg-blue-100 text-blue-800'
      case 'COMPLETADA': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Planificación</h1>

      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setSelectedTab('tareas')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'tareas'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Tareas
        </button>
        <button
          onClick={() => setSelectedTab('hitos')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'hitos'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Hitos
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <>
          {selectedTab === 'tareas' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Nueva Tarea
                </button>
              </div>

              {showTaskForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                  <h2 className="text-lg font-bold mb-4">Nueva Tarea</h2>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cuadrilla:</label>
                      <select
                        value={taskForm.crewId}
                        onChange={e => setTaskForm({ ...taskForm, crewId: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                      >
                        <option value="">Selecciona cuadrilla</option>
                        {crews.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Título:</label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descripción:</label>
                      <textarea
                        value={taskForm.description}
                        onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                        className="w-full border rounded p-2 h-20 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Prioridad:</label>
                        <select
                          value={taskForm.prioridad}
                          onChange={e => setTaskForm({ ...taskForm, prioridad: e.target.value })}
                          className="w-full border rounded p-2"
                        >
                          <option value="BAJA">Baja</option>
                          <option value="NORMAL">Normal</option>
                          <option value="ALTA">Alta</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Vencimiento:</label>
                        <input
                          type="date"
                          value={taskForm.fecha_vencimiento}
                          onChange={e => setTaskForm({ ...taskForm, fecha_vencimiento: e.target.value })}
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Crear
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.crew?.name || 'Sin cuadrilla'}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getPrioridadColor(task.prioridad)}`}>
                          {task.prioridad}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getEstadoColor(task.estado)}`}>
                          {task.estado}
                        </span>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-gray-700 mb-3">{task.description}</p>
                    )}
                    {task.fecha_vencimiento && (
                      <p className="text-xs text-gray-600 mb-3">Vencimiento: {new Date(task.fecha_vencimiento).toLocaleDateString('es-CL')}</p>
                    )}
                    <div className="flex gap-2">
                      <select
                        value={task.estado}
                        onChange={e => handleUpdateTaskStatus(task.id, e.target.value)}
                        className="flex-1 border rounded p-2 text-sm"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="COMPLETADA">Completada</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'hitos' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Nuevo Hito
                </button>
              </div>

              {showMilestoneForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                  <h2 className="text-lg font-bold mb-4">Nuevo Hito</h2>
                  <form onSubmit={handleCreateMilestone} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Proyecto:</label>
                      <select
                        value={milestoneForm.projectId}
                        onChange={e => setMilestoneForm({ ...milestoneForm, projectId: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                      >
                        <option value="">Selecciona proyecto</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Título:</label>
                      <input
                        type="text"
                        value={milestoneForm.title}
                        onChange={e => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Descripción:</label>
                      <textarea
                        value={milestoneForm.description}
                        onChange={e => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                        className="w-full border rounded p-2 h-20 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha Objetivo:</label>
                      <input
                        type="date"
                        value={milestoneForm.targetDate}
                        onChange={e => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                        className="w-full border rounded p-2"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Crear
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMilestoneForm(false)}
                        className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {milestones.map(milestone => (
                  <div key={milestone.id} className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{milestone.title}</h3>
                        <p className="text-sm text-gray-600">{milestone.project?.name || 'Sin proyecto'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        milestone.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                        milestone.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {milestone.estado}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-gray-700 mb-3">{milestone.description}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-3">
                      Objetivo: {new Date(milestone.targetDate).toLocaleDateString('es-CL')}
                    </p>
                    <button
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
