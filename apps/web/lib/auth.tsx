"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "./api"

interface User {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<any>
  logout: () => Promise<void>
  register: (userData: any) => Promise<any>
  verifyTwoFactorCode: (userId: string, code: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me")
        setUser(response.data)
      } catch (error) {
        console.error("Non authentifié:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password })

      // Si l'authentification à deux facteurs est requise
      if (response.data.requireTwoFactor) {
        return response.data
      }

      // Sinon, définir l'utilisateur et le token
      localStorage.setItem("accessToken", response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      setUser(response.data.user)

      // Configurer le token pour les futures requêtes
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`

      return response.data
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  }

  const verifyTwoFactorCode = async (userId: string, code: string) => {
    try {
      const response = await api.post("/auth/two-factor", { userId, code })

      localStorage.setItem("accessToken", response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      setUser(response.data.user)

      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`

      return response.data
    } catch (error) {
      console.error("Erreur de vérification 2FA:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      delete api.defaults.headers.common["Authorization"]
      setUser(null)
      router.push("/auth/login")
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        verifyTwoFactorCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
