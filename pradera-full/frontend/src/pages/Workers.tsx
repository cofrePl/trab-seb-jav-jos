import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { specialties } from '../constants/specialties'
import { getAllowedCertifications } from '../constants/specialtyCertifications'
import { bannedWords } from '../constants/bannedWords'
import { albures } from '../constants/albures'

interface Worker {
  id: string
  name: string
  rut?: string
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
  const [form, setForm] = useState({ name: '', rut: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' })
  const [filteredSpecialties, setFilteredSpecialties] = useState<string[]>([])
  const [showSpecialties, setShowSpecialties] = useState(false)
  const [filteredCertifications, setFilteredCertifications] = useState<string[]>([])
  const [showCertifications, setShowCertifications] = useState(false)
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



  const validateRut = (rut: string) => {
    if (!rut) return true
    // Clean RUT: remove dots and hyphens
    const cleanRut = rut.replace(/[^0-9kK]/g, '')
    if (cleanRut.length < 2) return false

    const body = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1).toUpperCase()

    if (!/^\d+$/.test(body)) return false

    let sum = 0
    let multiplier = 2

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier
      multiplier = multiplier === 7 ? 2 : multiplier + 1
    }

    const expectedDv = 11 - (sum % 11)
    const calculatedDv = expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString()

    return dv === calculatedDv
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (/\d/.test(form.name)) {
      setError('El nombre no puede contener números')
      return
    }
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
    if (/\d/.test(form.especialidad)) {
      setError('La especialidad no puede contener números')
      return
    }
    if (form.rut && !validateRut(form.rut)) {
      setError('RUT inválido (Formato: 12345678-9)')
      return
    }
    if (!specialties.includes(form.especialidad)) {
      setError('Debe seleccionar una especialidad válida de la lista')
      return
    }
    const allowedCerts = getAllowedCertifications(form.especialidad)
    if (form.certificaciones && !allowedCerts.includes(form.certificaciones)) {
      setError('La certificación seleccionada no corresponde a la especialidad')
      return
    }
    const exp = parseInt(form.experiencia)
    if (form.experiencia && (isNaN(exp) || exp < 0 || exp > 50)) {
      setError('Los años de experiencia deben estar entre 0 y 50')
      return
    }
    try {
      if (editingId) {
        await api.put(`/workers/${editingId}`, form)
      } else {
        await api.post('/workers', form)
      }
      setForm({ name: '', rut: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' })
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
      rut: worker.rut || '',
      especialidad: worker.especialidad,
      certificaciones: worker.certificaciones || '',
      experiencia: worker.experiencia?.toString() || '',
      disponibilidad: worker.disponibilidad,
      estado: worker.estado
    })
    setEditingId(worker.id)
    setShowForm(true)
    setError('')
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

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm({ ...form, especialidad: value, certificaciones: '' }) // Clear certification on specialty change
    if (value) {
      const filtered = specialties.filter(s => s.toLowerCase().includes(value.toLowerCase()))
      setFilteredSpecialties(filtered)
      setShowSpecialties(true)
    } else {
      setShowSpecialties(false)
    }
  }

  const selectSpecialty = (specialty: string) => {
    setForm({ ...form, especialidad: specialty, certificaciones: '' }) // Clear certification on selection
    setShowSpecialties(false)
  }

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setForm({ ...form, certificaciones: value })
    if (value) {
      const allowed = getAllowedCertifications(form.especialidad)
      const filtered = allowed.filter(c => c.toLowerCase().includes(value.toLowerCase()))
      setFilteredCertifications(filtered)
      setShowCertifications(true)
    } else {
      setShowCertifications(false)
    }
  }

  const selectCertification = (certification: string) => {
    setForm({ ...form, certificaciones: certification })
    setShowCertifications(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Trabajadores</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', rut: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' }); setError('') }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Trabajador
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="RUT (12345678-9)" value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} className="p-2 border rounded" />
            <div className="relative">
              <input
                type="text"
                placeholder="Especialidad"
                value={form.especialidad}
                onChange={handleSpecialtyChange}
                onFocus={() => { if (form.especialidad) setShowSpecialties(true) }}
                required
                className="p-2 border rounded w-full"
              />
              {showSpecialties && filteredSpecialties.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredSpecialties.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => selectSpecialty(s)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Certificaciones"
                value={form.certificaciones}
                onChange={handleCertificationChange}
                onFocus={() => { if (form.certificaciones) setShowCertifications(true); else { setFilteredCertifications(getAllowedCertifications(form.especialidad)); setShowCertifications(true); } }}
                className="p-2 border rounded w-full"
                disabled={!form.especialidad || !specialties.includes(form.especialidad)}
                title={!form.especialidad ? "Seleccione una especialidad primero" : ""}
              />
              {showCertifications && filteredCertifications.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredCertifications.map((c, i) => (
                    <li
                      key={i}
                      onClick={() => selectCertification(c)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input type="number" min="0" max="50" placeholder="Años experiencia" value={form.experiencia} onChange={e => setForm({ ...form, experiencia: e.target.value })} className="p-2 border rounded" />
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
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', rut: '', especialidad: '', certificaciones: '', experiencia: '', disponibilidad: true, estado: 'activo' }); setError('') }} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancelar</button>
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
              <th className="border p-2 text-left">RUT</th>
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
                  <td className="border p-2">{w.rut || '-'}</td>
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
