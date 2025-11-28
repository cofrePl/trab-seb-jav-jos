import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface ProjectReport {
  id: string
  name: string
  tipo_obra: string
  estado: string
  crews: number
  workers: number
  logs: number
  advancePercentage: number
}

export default function Reports() {
  const [projectsReport, setProjectsReport] = useState<ProjectReport[]>([])
  const [inventoryMetrics, setInventoryMetrics] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState('proyectos')
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    fetchReports()
  }, [token])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [projectsRes, inventoryRes] = await Promise.all([
        api.get('/reports/projects'),
        api.get('/reports/inventory')
      ])
      setProjectsReport(projectsRes.data)
      setInventoryMetrics(inventoryRes.data)
    } catch (err: any) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-blue-500'
    if (percentage >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportes</h1>

      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setSelectedTab('proyectos')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'proyectos'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Proyectos
        </button>
        <button
          onClick={() => setSelectedTab('inventario')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'inventario'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Inventario
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando reportes...</p>
      ) : (
        <>
          {selectedTab === 'proyectos' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Proyectos</h2>

              {projectsReport.length === 0 ? (
                <p className="text-gray-500">Sin proyectos</p>
              ) : (
                <div className="grid gap-4">
                  {projectsReport.map(project => (
                    <div key={project.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.tipo_obra}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          project.estado === 'activo' ? 'bg-green-100 text-green-800' :
                          project.estado === 'pausado' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.estado}
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">Avance del Proyecto</span>
                          <span className="text-sm font-bold text-gray-800">{project.advancePercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getProgressColor(project.advancePercentage)}`}
                            style={{ width: `${project.advancePercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Métricas en grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-gray-600 text-sm">Cuadrillas</p>
                          <p className="text-2xl font-bold text-blue-600">{project.crews}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-gray-600 text-sm">Trabajadores</p>
                          <p className="text-2xl font-bold text-green-600">{project.workers}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-gray-600 text-sm">Bitácoras</p>
                          <p className="text-2xl font-bold text-yellow-600">{project.logs}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <p className="text-gray-600 text-sm">Estado</p>
                          <p className="text-sm font-bold text-purple-600">Activo</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'inventario' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Inventario</h2>

              {inventoryMetrics && (
                <>
                  {/* Tarjetas de resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded shadow border-l-4 border-blue-500">
                      <p className="text-gray-600 text-sm">Total de Materiales</p>
                      <p className="text-3xl font-bold text-blue-600">{inventoryMetrics.summary.totalMaterials}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded shadow border-l-4 border-red-500">
                      <p className="text-gray-600 text-sm">Stock Crítico</p>
                      <p className="text-3xl font-bold text-red-600">{inventoryMetrics.summary.criticalStock}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded shadow border-l-4 border-yellow-500">
                      <p className="text-gray-600 text-sm">Stock Bajo</p>
                      <p className="text-3xl font-bold text-yellow-600">{inventoryMetrics.summary.lowStock}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded shadow border-l-4 border-green-500">
                      <p className="text-gray-600 text-sm">Stock Normal</p>
                      <p className="text-3xl font-bold text-green-600">{inventoryMetrics.summary.normalStock}</p>
                    </div>
                  </div>

                  {/* Tabla de materiales */}
                  <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border p-3 text-left">Material</th>
                          <th className="border p-3 text-left">Stock</th>
                          <th className="border p-3 text-left">Unidad</th>
                          <th className="border p-3 text-left">Precio</th>
                          <th className="border p-3 text-left">Estado</th>
                          <th className="border p-3 text-left">Solicitudes Pendientes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryMetrics.materials.map((material: any) => (
                          <tr key={material.id} className="hover:bg-gray-100">
                            <td className="border p-3">{material.name}</td>
                            <td className="border p-3 font-bold">{material.stock}</td>
                            <td className="border p-3">{material.unidad}</td>
                            <td className="border p-3">${material.precio.toFixed(2)}</td>
                            <td className="border p-3">
                              <span className={`px-2 py-1 rounded text-sm font-medium ${
                                material.estado === 'CRITICO' ? 'bg-red-100 text-red-800' :
                                material.estado === 'BAJO' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {material.estado}
                              </span>
                            </td>
                            <td className="border p-3 text-center">
                              {material.requestsPending > 0 && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                                  {material.requestsPending}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Valor total */}
                  <div className="mt-6 bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm">Valor Total del Inventario</p>
                    <p className="text-3xl font-bold text-purple-600">
                      ${inventoryMetrics.summary.totalValue.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
