"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { projectsService } from "../api/projects-service"
import type { ProjectQueryParams } from "../types"
import type { Project } from "../types"

export function useProjects(params?: ProjectQueryParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectsService.getProjects(params),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
  })
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => projectsService.getProjectMembers(projectId),
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectData: Partial<Project>) => projectsService.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => projectsService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] })
    },
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectsService.archiveProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", id] })
    },
  })
}

export function useUnarchiveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectsService.unarchiveProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["project", id] })
    },
  })
}

export function useAddProjectMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, userId, projectRoleId }: { projectId: string; userId: string; projectRoleId: string }) =>
      projectsService.addProjectMember(projectId, userId, projectRoleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] })
    },
  })
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      projectsService.removeProjectMember(projectId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-members", variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] })
    },
  })
}
