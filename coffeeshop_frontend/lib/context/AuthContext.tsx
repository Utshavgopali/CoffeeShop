'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '../types/auth'
import { fetchMe, getCurrentUser, logoutAction } from '../actions/auth-action'

interface AuthContextValue {
  user: User | null
  loading: boolean
  setUser: (u: User | null) => void
  refresh: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => { const me = await fetchMe(); setUser(me) }

  useEffect(() => {
    const seed = getCurrentUser()
    if (seed) setUser(seed)
    refresh().finally(() => setLoading(false))
  }, [])

  const logout = () => { logoutAction(); setUser(null) }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
