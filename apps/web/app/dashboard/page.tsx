import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar"
import { DashboardActivity } from "@/components/dashboard/dashboard-activity"
import { DashboardTasks } from "@/components/dashboard/dashboard-tasks"
import { DashboardTeam } from "@/components/dashboard/dashboard-team"

export const metadata: Metadata = {
  title: "Dashboard - Gestion de Tâches",
  description: "Vue d'ensemble de vos projets et tâches",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader title="Dashboard" description="Vue d'ensemble de vos projets et tâches" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardOverview />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-4">
          <DashboardCharts />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <DashboardCalendar />
        </div>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-2 lg:col-span-4">
          <DashboardActivity />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <DashboardTasks />
        </div>
      </div>

      <div className="mt-6">
        <DashboardTeam />
      </div>
    </DashboardLayout>
  )
}
