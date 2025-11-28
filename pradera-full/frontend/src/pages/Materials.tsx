import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Material {
  id: string
  name: string
  descripcion?: string
  stock: number
  unidad: string
  precio: number
}

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', descripcion: '', stock: '', unidad: '', precio: '' })
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) navigate('/login')
    fetchMaterials()
  }, [token, navigate])

  const fetchMaterials = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/materials')
      setMaterials(data)
      setError('')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar materiales')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, form)
      } else {
        await api.post('/materials', form)
      }
      setForm({ name: '', descripcion: '', stock: '', unidad: '', precio: '' })
      setEditingId(null)
      setShowForm(false)
      fetchMaterials()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al guardar material')
    }
  }

  const handleEdit = (material: Material) => {
    setForm({
      name: material.name,
      descripcion: material.descripcion || '',
      stock: material.stock.toString(),
      unidad: material.unidad,
      precio: material.precio.toString()
    })
    setEditingId(material.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este material?')) return
    try {
      await api.delete(`/materials/${id}`)
      fetchMaterials()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al eliminar material')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Materiales</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', descripcion: '', stock: '', unidad: '', precio: '' }) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Material
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Unidad" value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })} required className="p-2 border rounded" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required className="p-2 border rounded" />
            <input type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required className="p-2 border rounded" />
            <input type="text" placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="p-2 border rounded col-span-2" />
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
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Stock</th>
              <th className="border p-2 text-left">Unidad</th>
              <th className="border p-2 text-left">Precio</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr><td colSpan={6} className="border p-2 text-center text-gray-500">Sin materiales</td></tr>
            ) : (
              materials.map(m => (
                <tr key={m.id} className="hover:bg-gray-100">
                  <td className="border p-2">{m.name}</td>
                  <td className="border p-2">{m.descripcion || '-'}</td>
                  <td className="border p-2">{m.stock}</td>
                  <td className="border p-2">{m.unidad}</td>
                  <td className="border p-2">${m.precio.toFixed(2)}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(m)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Editar</button>
                    <button onClick={() => handleDelete(m.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
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
