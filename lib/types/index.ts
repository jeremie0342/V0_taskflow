// Types utilisateur
export interface User {
  id: string
  firstname: string
  lastname: string
  username: string
  email: string
  phone?: string
  isActive: boolean
  twoFactorEnabled: boolean
  departmentId?: string
  roleId: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  department?: Department
  role?: Role
  clientProfile?: ClientProfile
}

// Types authentification
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface TwoFactorResponse {
  requireTwoFactor: boolean
  userId: string
}

// Types projets
export interface Project {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  dueStart: string
  dueEnd?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  archivedAt?: string
  projectStatusId: string
  status?: ProjectStatus
}

export interface ProjectWithDetails extends Project {
  status: ProjectStatus
  members: ProjectMember[]
  tasks: Task[]
  tags: ProjectTag[]
}

export interface ProjectStatus {
  id: string
  name: string
  description?: string
  color?: string
  order?: number
}

export interface ProjectMember {
  id: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  projectId: string
  projectRoleId: string
  user: User
  projectRole: ProjectRole
}

export interface ProjectRole {
  id: string
  name: string
  description?: string
  hasAllProjectPermissions: boolean
}

export interface ProjectTag {
  id: string
  projectId: string
  tagId: string
  tag: Tag
}

export interface Tag {
  id: string
  name: string
  color?: string
}

// Types tâches
export interface Task {
  id: string
  title: string
  description?: string
  priorityId: string
  statusId: string
  projectId: string
  timelineId: string
  startDate?: string
  endDate?: string
  dueStart: string
  dueEnd: string
  estimatedHours?: number
  actualHours?: number
  isArchived: boolean
  createdAt: string
  updatedAt: string
  archivedAt?: string
  createdById?: string
  parentTaskId?: string
}

export interface TaskWithDetails extends Task {
  priority: TaskPriority
  status: TaskStatus
  project: Project
  timeline: Timeline
  assignees: Assignee[]
  parentTask?: Task
  subtasks?: Task[]
  comments?: Comment[]
  documents?: Document[]
}

export interface TaskStatus {
  id: string
  name: string
  description?: string
  color?: string
  order: number
}

export interface TaskPriority {
  id: string
  name: string
  description?: string
  color?: string
  order: number
}

export interface Assignee {
  id: string
  taskId: string
  memberId: string
  member: ProjectMember
}

export interface Timeline {
  id: string
  name: string
  description?: string
  projectId: string
}

// Types commentaires
export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  taskId?: string
  projectId?: string
  parentId?: string
  user: User
  taggedMembers?: CommentMemberTag[]
  replies?: Comment[]
}

export interface CommentMemberTag {
  id: string
  commentId: string
  memberId: string
  member: ProjectMember
}

// Types documents
export interface Document {
  id: string
  name: string
  filePath: string
  fileType: string
  size: number
  description?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  userId: string
  projectId?: string
  taskId?: string
  uploadedBy: User
}

// Types notifications
export interface Notification {
  id: string
  title: string
  content?: string
  isRead: boolean
  type: string
  metadata?: any
  userId: string
  projectId?: string
  taskId?: string
  commentId?: string
  documentId?: string
  createdAt: string
  readAt?: string
}

// Types département et rôles
export interface Department {
  id: string
  name: string
  description?: string
  departmentId?: string
  subDepartments?: Department[]
}

export interface Role {
  id: string
  name: string
  description?: string
  hasAllPermissions: boolean
  permissions?: RolePermission[]
}

export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
  permission: Permission
}

export interface Permission {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ClientProfile {
  id: string
  clientTicket: string
  company?: string
  industry?: string
  address?: string
  website?: string
  notes?: string
  userId: string
}

// Types pour les statistiques du dashboard
export interface DashboardOverview {
  activeProjects: number
  archivedProjects: number
  tasksInProgress: number
  overdueTasks: number
}

export interface ChartData {
  tasksByStatus: Array<{ name: string; color: string; count: number }>
  tasksByPriority: Array<{ name: string; color: string; count: number }>
  tasksCreatedVsCompleted: Array<{ date: string; created: number; completed: number }>
}

export interface TeamMember {
  id: string
  user: User
  projectRole: ProjectRole
  stats: {
    totalTasks: number
    completedTasks: number
    overdueTasks: number
    workload: number
  }
}

// Types pour les requêtes
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TaskQueryParams {
  page?: number
  limit?: number
  search?: string
  projectId?: string
  statusId?: string
  priorityId?: string
  assignedToMe?: boolean
  upcoming?: boolean
  overdue?: boolean
  isArchived?: boolean
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ProjectQueryParams {
  page?: number
  limit?: number
  search?: string
  statusId?: string
  isArchived?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
