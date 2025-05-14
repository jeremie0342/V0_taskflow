import { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeft,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns"

export default function DashboardPreview() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Données pour les graphiques
  const tasksByStatus = [
    { name: "À faire", value: 12, color: "#94a3b8" },
    { name: "En cours", value: 8, color: "#3b82f6" },
    { name: "En révision", value: 3, color: "#f59e0b" },
    { name: "Terminé", value: 15, color: "#10b981" },
  ]

  const tasksByPriority = [
    { name: "Basse", value: 10, color: "#94a3b8" },
    { name: "Moyenne", value: 18, color: "#f59e0b" },
    { name: "Haute", value: 7, color: "#ef4444" },
    { name: "Urgente", value: 3, color: "#7c3aed" },
  ]

  const tasksCreatedVsCompleted = [
    { date: "01/05", created: 5, completed: 3 },
    { date: "02/05", created: 3, completed: 4 },
    { date: "03/05", created: 7, completed: 2 },
    { date: "04/05", created: 2, completed: 5 },
    { date: "05/05", created: 4, completed: 3 },
    { date: "06/05", created: 6, completed: 4 },
    { date: "07/05", created: 3, completed: 6 },
  ]

  // Données pour le calendrier
  const currentDate = new Date()
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  // Données pour les tâches
  const tasks = [
    {
      id: "1",
      title: "Implémenter l'authentification",
      dueDate: "2025-05-20",
      priority: { name: "Haute", color: "#ef4444" },
      project: { name: "Refonte du site web" },
      assignees: [
        { id: "1", initials: "JD", name: "John Doe" },
        { id: "2", initials: "AS", name: "Alice Smith" },
      ],
    },
    {
      id: "2",
      title: "Créer les maquettes UI",
      dueDate: "2025-05-18",
      priority: { name: "Moyenne", color: "#f59e0b" },
      project: { name: "Application mobile" },
      assignees: [{ id: "3", initials: "RJ", name: "Robert Johnson" }],
    },
    {
      id: "3",
      title: "Optimiser les requêtes SQL",
      dueDate: "2025-05-15",
      priority: { name: "Urgente", color: "#7c3aed" },
      project: { name: "Optimisation de la base de données" },
      assignees: [
        { id: "4", initials: "ML", name: "Marie Leclerc" },
        { id: "5", initials: "TD", name: "Thomas Dubois" },
      ],
    },
  ]

  // Données pour l'activité récente
  const activities = [
    {
      id: "1",
      user: { name: "John Doe", initials: "JD" },
      action: "a commenté sur",
      target: "Implémenter l'authentification",
      time: "il y a 30 minutes",
      icon: <MessageSquare className="w-4 h-4 text-sky-500" />,
    },
    {
      id: "2",
      user: { name: "Alice Smith", initials: "AS" },
      action: "a terminé",
      target: "Créer les modèles de données",
      time: "il y a 2 heures",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: "3",
      user: { name: "Robert Johnson", initials: "RJ" },
      action: "a ajouté un document à",
      target: "Optimisation de la base de données",
      time: "il y a 5 heures",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
    },
  ]

  // Données pour l'équipe
  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Chef de projet",
      initials: "JD",
      stats: {
        workload: 75,
        completedTasks: 12,
        totalTasks: 18,
        overdueTasks: 2,
      },
    },
    {
      id: "2",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      role: "Développeur",
      initials: "AS",
      stats: {
        workload: 45,
        completedTasks: 8,
        totalTasks: 15,
        overdueTasks: 0,
      },
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Designer UI/UX",
      initials: "RJ",
      stats: {
        workload: 90,
        completedTasks: 5,
        totalTasks: 10,
        overdueTasks: 3,
      },
    },
  ]

  const getWorkloadColor = (workload: number) => {
    if (workload < 30) return "bg-emerald-500"
    if (workload < 70) return "bg-amber-500"
    return "bg-rose-500"
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <PanelLeft className="w-6 h-6 mr-2 text-primary" />
            <span className="text-lg font-semibold">TaskManager</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher..." className="pl-8 bg-gray-50" />
          </div>
        </div>
        <nav className="px-2 space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="w-5 h-5 mr-3" />
            Projets
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="w-5 h-5 mr-3" />
            Tâches
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="w-5 h-5 mr-3" />
            Équipe
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="w-5 h-5 mr-3" />
            Messages
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="w-5 h-5 mr-3" />
            Documents
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-5 h-5 mr-3" />
            Paramètres
          </Button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-white">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-emerald-500"
                >
                  <path d="M16 8v8m-8-8v8M4 6h16M6 6h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6Z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Projets archivés</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-gray-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M16 2v3M8 2v3M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Tâches en cours</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-sky-500"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Tâches en retard</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-rose-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Calendar */}
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>Visualisation des données de vos tâches et projets</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">Par statut</TabsTrigger>
                    <TabsTrigger value="priority">Par priorité</TabsTrigger>
                    <TabsTrigger value="activity">Activité</TabsTrigger>
                  </TabsList>
                  <TabsContent value="status" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tasksByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {tasksByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="priority" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tasksByPriority}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {tasksByPriority.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="activity" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tasksCreatedVsCompleted}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="created" fill="#8884d8" name="Tâches créées" />
                        <Bar dataKey="completed" fill="#82ca9d" name="Tâches terminées" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center">
                <div>
                  <CardTitle>Calendrier</CardTitle>
                  <CardDescription>Échéances des tâches</CardDescription>
                </div>
                <div className="flex items-center ml-auto space-x-2">
                  <Button variant="outline" size="icon">
                    <ChevronDown className="w-4 h-4" />
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
                  {Array.from({
                    length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7,
                  }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10" />
                  ))}

                  {days.map((day) => {
                    const isCurrentDay = isToday(day)
                    const hasTasks = Math.random() > 0.7 // Simuler des tâches sur certains jours

                    return (
                      <div
                        key={day.toString()}
                        className={`h-10 flex flex-col items-center justify-center rounded-md text-sm ${
                          isCurrentDay ? "bg-primary text-primary-foreground" : hasTasks ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center justify-center w-6 h-6">{format(day, "d")}</div>
                        {hasTasks && (
                          <div className="flex -space-x-1 overflow-hidden">
                            <div className="w-1 h-1 rounded-full bg-sky-500" />
                            <div className="w-1 h-1 rounded-full bg-rose-500" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity and Tasks */}
          <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Dernières actions sur vos projets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{activity.user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{activity.user.name}</span>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                          {activity.icon}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} <span className="font-medium">{activity.target}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3">
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
                      <Badge variant="destructive" className="ml-2">
                        3
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="assigned">
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div key={task.id} className="p-3 transition-colors border rounded-lg hover:bg-muted">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs text-muted-foreground">Projet: {task.project.name}</div>
                            </div>
                            <Badge style={{ backgroundColor: task.priority.color }} variant="outline">
                              {task.priority.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Échéance: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex -space-x-2">
                              {task.assignees.map((assignee) => (
                                <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="upcoming">
                    <div className="text-center py-4 text-muted-foreground">Chargement des tâches à venir...</div>
                  </TabsContent>
                  <TabsContent value="overdue">
                    <div className="p-2 mb-4 text-sm border rounded-md bg-rose-50 text-rose-500 border-rose-200">
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" x2="12" y1="9" y2="13" />
                          <line x1="12" x2="12.01" y1="17" y2="17" />
                        </svg>
                        <span>Vous avez 3 tâches en retard</span>
                      </div>
                    </div>
                    <div className="text-center py-4 text-muted-foreground">Chargement des tâches en retard...</div>
                  </TabsContent>
                </Tabs>\
