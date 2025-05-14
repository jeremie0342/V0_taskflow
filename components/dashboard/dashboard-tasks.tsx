"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useTasks } from "@/lib/hooks/use-tasks"

export function DashboardTasks() {
  const { data: assignedTasksData, isLoading: isLoadingAssigned } = useTasks({
    assignedToMe: true,
    limit: 5,
  })

  const { data: upcomingTasksData, isLoading: isLoadingUpcoming } = useTasks({
    upcoming: true,
    limit: 5,
  })

  const { data: overdueTasksData, isLoading: isLoadingOverdue } = useTasks({
    overdue: true,
    limit: 5,
  })

  const isLoading = isLoadingAssigned || isLoadingUpcoming || isLoadingOverdue

  const renderTaskList = (tasks: any[] = []) => {
    if (tasks.length === 0) {
      return <div className="text-center py-4 text-muted-foreground">Aucune tâche à afficher</div>
    }

    return (
      <div className="space-y-4">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="block p-3 transition-colors border rounded-lg hover:bg-muted"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-muted-foreground">Projet: {task.project?.name || "N/A"}</div>
              </div>
              <Badge style={{ backgroundColor: task.priority?.color || undefined }} variant="outline">
                {task.priority?.name || "N/A"}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.dueEnd), { addSuffix: true, locale: fr })}
                </span>
              </div>
              <div className="flex -space-x-2">
                {task.assignees?.slice(0, 3).map((assignee: any) => (
                  <Avatar key={assignee.member.user.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={`/api/avatar/${assignee.member.user.id}`} alt={assignee.member.user.username} />
                    <AvatarFallback className="text-xs">
                      {assignee.member.user.firstname[0]}
                      {assignee.member.user.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees?.length > 3 && (
                  <Avatar className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs bg-muted">+{task.assignees.length - 3}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes tâches</CardTitle>
          <CardDescription>Vos tâches assignées et à venir</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const assignedTasks = assignedTasksData?.data || []
  const upcomingTasks = upcomingTasksData?.data || []
  const overdueTasks = overdueTasksData?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes tâches</CardTitle>
        <CardDescription>Vos tâches assignées et à venir</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assigned">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assigned">Assignées</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="overdue">
              En retard
              {overdueTasks.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {overdueTasks.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assigned">{renderTaskList(assignedTasks)}</TabsContent>
          <TabsContent value="upcoming">{renderTaskList(upcomingTasks)}</TabsContent>
          <TabsContent value="overdue">
            {overdueTasks.length > 0 && (
              <div className="p-2 mb-4 text-sm border rounded-md bg-rose-50 text-rose-500 border-rose-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Vous avez {overdueTasks.length} tâche(s) en retard</span>
                </div>
              </div>
            )}
            {renderTaskList(overdueTasks)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
