import apiClient from "./api-client"
import type { Task, TaskWithDetails, TaskQueryParams, PaginatedResponse, Assignee, Comment, TaskStatus } from "../types"

export const tasksService = {
  getTasks: async (params?: TaskQueryParams): Promise<PaginatedResponse<Task>> => {
    const response = await apiClient.get("/tasks", { params })
    return response.data
  },

  getTask: async (id: string): Promise<TaskWithDetails> => {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  },

  createTask: async (taskData: Partial<Task> & { assigneeIds?: string[] }): Promise<Task> => {
    const response = await apiClient.post("/tasks", taskData)
    return response.data
  },

  updateTask: async (id: string, taskData: Partial<Task> & { assigneeIds?: string[] }): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}`, taskData)
    return response.data
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  },

  archiveTask: async (id: string): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}/archive`)
    return response.data
  },

  unarchiveTask: async (id: string): Promise<Task> => {
    const response = await apiClient.patch(`/tasks/${id}/unarchive`)
    return response.data
  },

  getTaskAssignees: async (taskId: string): Promise<Assignee[]> => {
    const response = await apiClient.get(`/tasks/${taskId}/assignees`)
    return response.data
  },

  addTaskAssignee: async (taskId: string, memberId: string): Promise<Assignee> => {
    const response = await apiClient.post(`/tasks/${taskId}/assignees`, { memberId })
    return response.data
  },

  removeTaskAssignee: async (taskId: string, assigneeId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}/assignees/${assigneeId}`)
  },

  getTaskComments: async (taskId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/tasks/${taskId}/comments`)
    return response.data
  },

  addTaskComment: async (taskId: string, content: string, taggedMemberIds?: string[]): Promise<Comment> => {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, { content, taggedMemberIds })
    return response.data
  },

  getTasksByStatus: async (projectId: string): Promise<Array<{ status: TaskStatus; tasks: Task[] }>> => {
    const response = await apiClient.get(`/tasks/by-status`, { params: { projectId } })
    return response.data
  },

  getTasksStats: async (projectId: string): Promise<any> => {
    const response = await apiClient.get(`/tasks/stats`, { params: { projectId } })
    return response.data
  },
}
