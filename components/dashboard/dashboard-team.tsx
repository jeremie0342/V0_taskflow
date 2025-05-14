"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDashboardTeam } from "@/lib/hooks/use-dashboard"

export function DashboardTeam() {
  const { data: members, isLoading, error } = useDashboardTeam()

  const getWorkloadColor = (workload: number) => {
    if (workload < 30) return "bg-emerald-500"
    if (workload < 70) return "bg-amber-500"
    return "bg-rose-500"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Équipe</CardTitle>
          <CardDescription>Membres de l'équipe et leur charge de travail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Équipe</CardTitle>
          <CardDescription>Membres de l'équipe et leur charge de travail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">Erreur lors du chargement des données de l'équipe</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipe</CardTitle>
        <CardDescription>Membres de l'équipe et leur charge de travail</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!members || members.length === 0 ? (
            <div className="text-center text-muted-foreground">Aucun membre d'équipe à afficher</div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/api/avatar/${member.user.id}`} alt={member.user.username} />
                    <AvatarFallback>
                      {member.user.firstname[0]}
                      {member.user.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.user.firstname} {member.user.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
                      <span>{member.user.email}</span>
                      <Badge variant="outline">{member.projectRole.name}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 w-full md:w-1/3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Charge de travail</span>
                    <span className="font-medium">{member.stats.workload}%</span>
                  </div>
                  <Progress
                    value={member.stats.workload}
                    className="h-2"
                    indicatorClassName={getWorkloadColor(member.stats.workload)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {member.stats.completedTasks}/{member.stats.totalTasks} tâches
                    </span>
                    {member.stats.overdueTasks > 0 && (
                      <span className="text-rose-500">{member.stats.overdueTasks} en retard</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
