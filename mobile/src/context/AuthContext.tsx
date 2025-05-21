import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { saveToken, getToken, removeToken } from '../utils/secureStorage'

type AuthContextType = {
  token: string | null
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await getToken()
      setTokenState(savedToken)
    }
    loadToken()
  }, [])

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await saveToken(newToken)
    } else {
      await removeToken()
    }
    setTokenState(newToken)
  }

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
