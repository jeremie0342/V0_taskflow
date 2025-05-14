"use client"

import { useEffect, useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  dueStart: string
  dueEnd: string
  priorityId: string
  priority: {
    name: string
    color: string
  }
}

export function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const start = format(startOfMonth(currentDate), "yyyy-MM-dd")
        const end = format(endOfMonth(currentDate), "yyyy-MM-dd")

        const response = await api.get(`/tasks`, {
          params: {
            startDate: start,
            endDate: end,
            limit: 100,
          },
        })

        setTasks(response.data.data)
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [currentDate])

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      const dueStart = new Date(task.dueStart)
      const dueEnd = new Date(task.dueEnd)

      // Vérifier si la date est entre dueStart et dueEnd
      return date >= dueStart && date <= dueEnd
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
          <CardDescription>Échéances des tâches</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle>Calendrier</CardTitle>
          <CardDescription>Échéances des tâches</CardDescription>
        </div>
        <div className="flex items-center ml-auto space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="font-medium">{format(currentDate, "MMMM yyyy", { locale: fr })}</div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-xs font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7 }).map(
            (_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ),
          )}

          {days.map((day) => {
            const dayTasks = getTasksForDay(day)
            return (
              <div
                key={day.toString()}
                className={cn(
                  "h-10 flex flex-col items-center justify-center rounded-md text-sm",
                  !isSameMonth(day, currentDate) && "text-muted-foreground opacity-50",
                  isToday(day) && "bg-primary text-primary-foreground",
                  dayTasks.length > 0 && !isToday(day) && "bg-muted",
                )}
              >
                <div className="flex items-center justify-center w-6 h-6">{format(day, "d")}</div>
                {dayTasks.length > 0 && (
                  <div className="flex -space-x-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: task.priority.color }}
                      />
                    ))}
                    {dayTasks.length > 3 && <div className="w-1 h-1 rounded-full bg-gray-400" />}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
