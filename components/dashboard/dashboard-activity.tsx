"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useDashboardActivity } from "@/lib/hooks/use-dashboard"

export function DashboardActivity() {
  const { data: activities, isLoading, error } = useDashboardActivity()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "COMMENT_ADDED":
        return <MessageSquare className="w-4 h-4 text-sky-500" />
      case "DOCUMENT_UPLOADED":
        return <FileText className="w-4 h-4 text-emerald-500" />
      case "TASK_COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "TASK_OVERDUE":
        return <AlertCircle className="w-4 h-4 text-rose-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Dernières actions sur vos projets</CardDescription>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start mb-4 space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Dernières actions sur vos projets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">Erreur lors du chargement des activités</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Dernières actions sur vos projets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {!activities || activities.length === 0 ? (
            <div className="text-center text-muted-foreground">Aucune activité récente</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/api/avatar/${activity.user.id}`} alt={activity.user.username} />
                  <AvatarFallback>
                    {activity.user.firstname[0]}
                    {activity.user.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {activity.user.firstname} {activity.user.lastname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                    {getActivityIcon(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
