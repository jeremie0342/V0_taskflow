"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"
import Link from "next/link"

interface Task {
  id: string
  title: string
  dueEnd: string
  status: {
    name: string
    color: string
  }
  priority: {
    name: string
    color: string
  }
  assignees: Array<{
    member: {
      user: {
        id: string
        firstname: string
        lastname: string
        username: string
      }
    }
  }>
  project: {
    id: string
    name: string
  }
}

export function DashboardTasks() {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [assignedResponse, upcomingResponse, overdueResponse] = await Promise.all([
          api.get("/tasks", { params: { assignedToMe: true, limit: 5 } }),
          api.get("/tasks", { params: { upcoming: true, limit: 5 } }),
          api.get("/tasks", { params: { overdue: true, limit: 5 } }),
        ])

        setAssignedTasks(assignedResponse.data.data)
        setUpcomingTasks(upcomingResponse.data.data)
        setOverdueTasks(overdueResponse.data.data)
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const renderTaskList = (tasks: Task[]) => {
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
                <div className="text-xs text-muted-foreground">Projet: {task.project.name}</div>
              </div>
              <Badge style={{ backgroundColor: task.priority.color || undefined }} variant="outline">
                {task.priority.name}
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
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.member.user.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={`/api/avatar/${assignee.member.user.id}`} alt={assignee.member.user.username} />
                    <AvatarFallback className="text-xs">
                      {assignee.member.user.firstname[0]}
                      {assignee.member.user.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
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
