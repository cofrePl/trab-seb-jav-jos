import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No autenticado. Redirigiendo...</p>
        {setTimeout(() => navigate('/login'), 1000)}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido a Pradera</h1>
        <div className="border-t pt-4 mt-4">
          <p className="text-lg text-gray-700 mb-2">
            <strong>Usuario:</strong> {user.name || user.email}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Rol:</strong> <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{user.role}</span>
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/projects" className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Proyectos</h2>
          <p className="text-blue-700">Gestiona tus proyectos de construcción</p>
        </Link>
        <Link to="/crews" className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-green-900 mb-2">Cuadrillas</h2>
          <p className="text-green-700">Administra tus equipos de trabajo</p>
        </Link>
        <Link to="/workers" className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-yellow-900 mb-2">Trabajadores</h2>
          <p className="text-yellow-700">Consulta a tus trabajadores disponibles</p>
        </Link>
        <Link to="/materials" className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-purple-900 mb-2">Materiales</h2>
          <p className="text-purple-700">Gestiona tu inventario</p>
        </Link>
        <Link to="/logs" className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-orange-900 mb-2">Bitácoras</h2>
          <p className="text-orange-700">Registra actividades diarias de las cuadrillas</p>
        </Link>
        <Link to="/requests" className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-red-900 mb-2">Solicitudes</h2>
          <p className="text-red-700">Gestiona solicitudes de materiales y permisos</p>
        </Link>
        <Link to="/reports" className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-indigo-900 mb-2">Reportes</h2>
          <p className="text-indigo-700">Visualiza métricas y reportes del sistema</p>
        </Link>
        <Link to="/communication" className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-cyan-900 mb-2">Comunicación</h2>
          <p className="text-cyan-700">Mensajes y solicitudes de recursos</p>
        </Link>
        <Link to="/certificates" className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-teal-900 mb-2">Certificaciones</h2>
          <p className="text-teal-700">Gestiona certificaciones de trabajadores</p>
        </Link>
        <Link to="/planning" className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-pink-900 mb-2">Planificación</h2>
          <p className="text-pink-700">Tareas, hitos y seguimiento del proyecto</p>
        </Link>
        <Link to="/audit" className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-500 hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Auditoría</h2>
          <p className="text-gray-700">Registro de cambios del sistema</p>
        </Link>
      </div>
    </div>
  )
}
