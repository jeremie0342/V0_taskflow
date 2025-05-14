import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs et rafraîchir le token
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          // Rediriger vers la page de connexion si pas de refresh token
          window.location.href = "/auth/login"
          return Promise.reject(error)
        }

        // Essayer de rafraîchir le token
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })

        const { accessToken } = response.data

        // Mettre à jour le token dans le stockage local
        localStorage.setItem("accessToken", accessToken)

        // Mettre à jour le header d'autorisation
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

        // Réessayer la requête originale
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
