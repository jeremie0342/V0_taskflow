"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { tasksService } from "../api/tasks-service"
import type { TaskQueryParams, Task } from "../types"

export function useTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => tasksService.getTasks(params),
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => tasksService.getTask(id),
    enabled: !!id,
  })
}

export function useTasksByStatus(projectId: string) {
  return useQuery({
    queryKey: ["tasks-by-status", projectId],
    queryFn: () => tasksService.getTasksByStatus(projectId),
    enabled: !!projectId,
  })
}

export function useTasksStats(projectId: string) {
  return useQuery({
    queryKey: ["tasks-stats", projectId],
    queryFn: () => tasksService.getTasksStats(projectId),
    enabled: !!projectId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskData: Partial<Task> & { assigneeIds?: string[] }) => tasksService.createTask(taskData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      if (variables.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks-by-status", variables.projectId] })
        queryClient.invalidateQueries({ queryKey: ["tasks-stats", variables.projectId] })
      }
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> & { assigneeIds?: string[] } }) =>
      tasksService.updateTask(id, data),
    onSuccess: (updatedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] })
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks-by-status", updatedTask.projectId] })
        queryClient.invalidateQueries({ queryKey: ["tasks-stats", updatedTask.projectId] })
      }
    },
  })
}

export function useArchiveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksService.archiveTask(id),
    onSuccess: (updatedTask, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task", id] })
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks-by-status", updatedTask.projectId] })
        queryClient.invalidateQueries({ queryKey: ["tasks-stats", updatedTask.projectId] })
      }
    },
  })
}

export function useUnarchiveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => tasksService.unarchiveTask(id),
    onSuccess: (updatedTask, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["task", id] })
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ["tasks-by-status", updatedTask.projectId] })
        queryClient.invalidateQueries({ queryKey: ["tasks-stats", updatedTask.projectId] })
      }
    },
  })
}

export function useAddTaskComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      content,
      taggedMemberIds,
    }: { taskId: string; content: string; taggedMemberIds?: string[] }) =>
      tasksService.addTaskComment(taskId, content, taggedMemberIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] })
    },
  })
}
