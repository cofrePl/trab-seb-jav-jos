import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Workers from './pages/Workers'
import Crews from './pages/Crews'
import Materials from './pages/Materials'
import Logs from './pages/Logs'
import Requests from './pages/Requests'
import Reports from './pages/Reports'
import Communication from './pages/Communication'

import Planning from './pages/Planning'
import Audit from './pages/Audit'
import { AuthProvider, useAuth } from './context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (location.pathname === '/login') return null

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="font-bold text-lg">Pradera</Link>
        {user && (
          <>
            <Link to="/projects" className="hover:text-blue-600">Proyectos</Link>
            <Link to="/workers" className="hover:text-blue-600">Trabajadores</Link>
            <Link to="/crews" className="hover:text-blue-600">Cuadrillas</Link>
            <Link to="/materials" className="hover:text-blue-600">Materiales</Link>
            <Link to="/logs" className="hover:text-blue-600">Bitácoras</Link>
            <Link to="/requests" className="hover:text-blue-600">Solicitudes</Link>
            <Link to="/communication" className="hover:text-blue-600">Comunicación</Link>

            <Link to="/planning" className="hover:text-blue-600">Planificación</Link>
            <Link to="/audit" className="hover:text-blue-600">Auditoría</Link>
            <Link to="/reports" className="hover:text-blue-600">Reportes</Link>
          </>
        )}
      </div>
      {user && (
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/crews" element={<Crews />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/communication" element={<Communication />} />

            <Route path="/planning" element={<Planning />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
