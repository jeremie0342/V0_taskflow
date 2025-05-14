"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../api/dashboard-service"

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => dashboardService.getOverview(),
  })
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: () => dashboardService.getChartData(),
  })
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: () => dashboardService.getActivity(),
  })
}

export function useDashboardTeam() {
  return useQuery({
    queryKey: ["dashboard-team"],
    queryFn: () => dashboardService.getTeam(),
  })
}
