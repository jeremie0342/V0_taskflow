import apiClient from "./api-client"
import type { AuthResponse, TwoFactorResponse, User } from "../types"

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse | TwoFactorResponse> => {
    const response = await apiClient.post("/auth/login", { username, password })
    return response.data
  },

  register: async (userData: {
    firstname: string
    lastname: string
    username: string
    email: string
    password: string
    phone?: string
  }): Promise<User> => {
    const response = await apiClient.post("/auth/register", userData)
    return response.data
  },

  verifyTwoFactorCode: async (userId: string, code: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/two-factor", { userId, code })
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post("/auth/refresh", { refreshToken })
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me")
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout")
  },
}
