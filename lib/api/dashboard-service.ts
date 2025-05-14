import apiClient from "./api-client"
import type { DashboardOverview, ChartData, TeamMember } from "../types"

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get("/dashboard/overview")
    return response.data
  },

  getChartData: async (): Promise<ChartData> => {
    const response = await apiClient.get("/dashboard/charts")
    return response.data
  },

  getActivity: async (): Promise<any[]> => {
    const response = await apiClient.get("/dashboard/activity")
    return response.data
  },

  getTeam: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get("/dashboard/team")
    return response.data
  },
}
