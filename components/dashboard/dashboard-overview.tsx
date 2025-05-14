"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArchiveIcon, CheckCircleIcon, ClockIcon, FolderIcon } from "lucide-react"
import { useDashboardOverview } from "@/lib/hooks/use-dashboard"

export function DashboardOverview() {
  const { data: stats, isLoading, error } = useDashboardOverview()

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
            <FolderIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projets archivés</CardTitle>
            <ArchiveIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
            <CheckCircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tâches en retard</CardTitle>
            <ClockIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20" />
          </CardContent>
        </Card>
      </>
    )
  }

  if (error) {
    return <div className="col-span-4 p-4 text-center text-red-500">Erreur lors du chargement des statistiques</div>
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
          <FolderIcon className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeProjects || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Projets archivés</CardTitle>
          <ArchiveIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.archivedProjects || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
          <CheckCircleIcon className="w-4 h-4 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.tasksInProgress || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tâches en retard</CardTitle>
          <ClockIcon className="w-4 h-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.overdueTasks || 0}</div>
        </CardContent>
      </Card>
    </>
  )
}
