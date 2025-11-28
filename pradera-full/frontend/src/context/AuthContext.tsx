import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

type User = { id: string; email: string; name?: string; role?: string }

interface AuthContextType {
  user: User | null
  token: string | null
  login: (t: string, u: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('pradera_token')
    const u = localStorage.getItem('pradera_user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }
  }, [])

  const login = (t: string, u: User) => {
    localStorage.setItem('pradera_token', t)
    localStorage.setItem('pradera_user', JSON.stringify(u))
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    setToken(t)
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('pradera_token')
    localStorage.removeItem('pradera_user')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

