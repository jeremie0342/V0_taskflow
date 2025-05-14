import apiClient from "./api-client"
import type { Project, ProjectWithDetails, ProjectQueryParams, PaginatedResponse, ProjectMember } from "../types"

export const projectsService = {
  getProjects: async (params?: ProjectQueryParams): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get("/projects", { params })
    return response.data
  },

  getProject: async (id: string): Promise<ProjectWithDetails> => {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post("/projects", projectData)
    return response.data
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}`, projectData)
    return response.data
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  },

  archiveProject: async (id: string): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}/archive`)
    return response.data
  },

  unarchiveProject: async (id: string): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}/unarchive`)
    return response.data
  },

  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await apiClient.get(`/projects/${projectId}/members`)
    return response.data
  },

  addProjectMember: async (projectId: string, userId: string, projectRoleId: string): Promise<ProjectMember> => {
    const response = await apiClient.post(`/projects/${projectId}/members`, { userId, projectRoleId })
    return response.data
  },

  removeProjectMember: async (projectId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/members/${memberId}`)
  },
}
