"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "../api/auth-service"
import type { User } from "../types"

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
        const userData = await authService.getCurrentUser()
        setUser(userData)
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
      const response = await authService.login(username, password)

      // Si l'authentification à deux facteurs est requise
      if ("requireTwoFactor" in response) {
        return response
      }

      // Sinon, définir l'utilisateur et le token
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      setUser(response.user)

      return response
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  }

  const verifyTwoFactorCode = async (userId: string, code: string) => {
    try {
      const response = await authService.verifyTwoFactorCode(userId, code)

      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      setUser(response.user)

      return response
    } catch (error) {
      console.error("Erreur de vérification 2FA:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      router.push("/auth/login")
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await authService.register(userData)
      return response
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
