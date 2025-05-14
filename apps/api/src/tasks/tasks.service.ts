import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { PrismaService } from "@task-management/prisma"
import type { CreateTaskDto } from "./dto/create-task.dto"
import type { UpdateTaskDto } from "./dto/update-task.dto"
import type { TaskQueryDto } from "./dto/task-query.dto"
import type { NotificationsService } from "../notifications/notifications.service"

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    // Vérifier si l'utilisateur est membre du projet
    const projectMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: createTaskDto.projectId,
        },
      },
    })

    if (!projectMember) {
      throw new ForbiddenException("Vous n'êtes pas membre de ce projet")
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priorityId: createTaskDto.priorityId,
        statusId: createTaskDto.statusId,
        projectId: createTaskDto.projectId,
        timelineId: createTaskDto.timelineId,
        dueStart: new Date(createTaskDto.dueStart),
        dueEnd: new Date(createTaskDto.dueEnd),
        startDate: createTaskDto.startDate ? new Date(createTaskDto.startDate) : null,
        endDate: createTaskDto.endDate ? new Date(createTaskDto.endDate) : null,
        estimatedHours: createTaskDto.estimatedHours,
        parentTaskId: createTaskDto.parentTaskId,
        createdById: projectMember.id,
        assignees: {
          create:
            createTaskDto.assigneeIds?.map((memberId) => ({
              memberId,
            })) || [],
        },
      },
      include: {
        priority: true,
        status: true,
        assignees: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    // Notifier les assignés
    if (task.assignees.length > 0) {
      for (const assignee of task.assignees) {
        await this.notificationsService.create({
          title: "Nouvelle tâche assignée",
          content: `Vous avez été assigné à la tâche "${task.title}"`,
          userId: assignee.member.user.id,
          type: "TASK_ASSIGNED",
          metadata: {
            taskId: task.id,
            projectId: task.projectId,
          },
        })
      }
    }

    return task
  }

  async findAll(query: TaskQueryDto, userId: string) {
    const where: any = {
      deletedAt: null,
    }

    // Filtres
    if (query.projectId) {
      where.projectId = query.projectId
    }

    if (query.statusId) {
      where.statusId = query.statusId
    }

    if (query.priorityId) {
      where.priorityId = query.priorityId
    }

    if (query.isArchived !== undefined) {
      where.isArchived = query.isArchived === "true"
    }

    if (query.search) {
      where.OR = [{ title: { contains: query.search } }, { description: { contains: query.search } }]
    }

    // Filtre par date
    if (query.startDate && query.endDate) {
      where.OR = [
        {
          dueStart: {
            gte: new Date(query.startDate),
            lte: new Date(query.endDate),
          },
        },
        {
          dueEnd: {
            gte: new Date(query.startDate),
            lte: new Date(query.endDate),
          },
        },
      ]
    }

    // Filtre par assigné
    if (query.assignedToMe === "true") {
      where.assignees = {
        some: {
          member: {
            userId,
          },
        },
      }
    }

    // Pagination
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    // Tri
    const orderBy: any = {}
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || "asc"
    } else {
      orderBy.createdAt = "desc"
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          priority: true,
          status: true,
          project: true,
          assignees: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ])

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        priority: true,
        status: true,
        project: true,
        timeline: true,
        assignees: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
        parentTask: true,
        subtasks: {
          include: {
            priority: true,
            status: true,
          },
        },
        comments: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            taggedMembers: {
              include: {
                member: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        documents: {
          where: { isArchived: false },
        },
      },
    })

    if (!task || task.deletedAt) {
      throw new NotFoundException(`Tâche avec ID ${id} non trouvée`)
    }

    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    // Vérifier si la tâche existe
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignees: {
          include: {
            member: true,
          },
        },
      },
    })

    if (!task || task.deletedAt) {
      throw new NotFoundException(`Tâche avec ID ${id} non trouvée`)
    }

    // Vérifier si l'utilisateur est membre du projet
    const projectMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: task.projectId,
        },
      },
    })

    if (!projectMember) {
      throw new ForbiddenException("Vous n'êtes pas membre de ce projet")
    }

    // Préparer les données à mettre à jour
    const updateData: any = {}

    if (updateTaskDto.title !== undefined) updateData.title = updateTaskDto.title
    if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description
    if (updateTaskDto.priorityId !== undefined) updateData.priorityId = updateTaskDto.priorityId
    if (updateTaskDto.statusId !== undefined) updateData.statusId = updateTaskDto.statusId
    if (updateTaskDto.timelineId !== undefined) updateData.timelineId = updateTaskDto.timelineId
    if (updateTaskDto.dueStart !== undefined) updateData.dueStart = new Date(updateTaskDto.dueStart)
    if (updateTaskDto.dueEnd !== undefined) updateData.dueEnd = new Date(updateTaskDto.dueEnd)
    if (updateTaskDto.startDate !== undefined)
      updateData.startDate = updateTaskDto.startDate ? new Date(updateTaskDto.startDate) : null
    if (updateTaskDto.endDate !== undefined)
      updateData.endDate = updateTaskDto.endDate ? new Date(updateTaskDto.endDate) : null
    if (updateTaskDto.estimatedHours !== undefined) updateData.estimatedHours = updateTaskDto.estimatedHours
    if (updateTaskDto.actualHours !== undefined) updateData.actualHours = updateTaskDto.actualHours
    if (updateTaskDto.parentTaskId !== undefined) updateData.parentTaskId = updateTaskDto.parentTaskId

    // Mettre à jour les assignés si nécessaire
    if (updateTaskDto.assigneeIds) {
      // Supprimer les assignations existantes
      await this.prisma.assignee.deleteMany({
        where: { taskId: id },
      })

      // Créer les nouvelles assignations
      if (updateTaskDto.assigneeIds.length > 0) {
        await this.prisma.assignee.createMany({
          data: updateTaskDto.assigneeIds.map((memberId) => ({
            taskId: id,
            memberId,
          })),
        })

        // Notifier les nouveaux assignés
        const currentAssigneeIds = task.assignees.map((a) => a.memberId)
        const newAssigneeIds = updateTaskDto.assigneeIds.filter((memberId) => !currentAssigneeIds.includes(memberId))

        if (newAssigneeIds.length > 0) {
          const newAssignees = await this.prisma.projectMember.findMany({
            where: {
              id: { in: newAssigneeIds },
            },
            include: {
              user: true,
            },
          })

          for (const assignee of newAssignees) {
            await this.notificationsService.create({
              title: "Nouvelle tâche assignée",
              content: `Vous avez été assigné à la tâche "${task.title}"`,
              userId: assignee.user.id,
              type: "TASK_ASSIGNED",
              metadata: {
                taskId: task.id,
                projectId: task.projectId,
              },
            })
          }
        }
      }
    }

    // Mettre à jour la tâche
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        priority: true,
        status: true,
        project: true,
        assignees: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    return updatedTask
  }

  async remove(id: string) {
    // Soft delete
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async archive(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    })
  }

  async unarchive(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
      },
    })
  }

  async getTasksByStatus(projectId: string) {
    const statuses = await this.prisma.taskStatus.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      orderBy: {
        order: "asc",
      },
    })

    const result = []

    for (const status of statuses) {
      const tasks = await this.prisma.task.findMany({
        where: {
          projectId,
          statusId: status.id,
          deletedAt: null,
          isArchived: false,
        },
        include: {
          priority: true,
          assignees: {
            include: {
              member: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      })

      result.push({
        status,
        tasks,
      })
    }

    return result
  }

  async getTasksStats(projectId: string) {
    // Statistiques par statut
    const tasksByStatus = await this.prisma.$queryRaw`
      SELECT ts.name, ts.color, COUNT(t.id) as count
      FROM Task t
      JOIN TaskStatus ts ON t.statusId = ts.id
      WHERE t.projectId = ${projectId}
      AND t.deletedAt IS NULL
      GROUP BY ts.id
      ORDER BY ts.order ASC
    `

    // Statistiques par priorité
    const tasksByPriority = await this.prisma.$queryRaw`
      SELECT tp.name, tp.color, COUNT(t.id) as count
      FROM Task t
      JOIN TaskPriority tp ON t.priorityId = tp.id
      WHERE t.projectId = ${projectId}
      AND t.deletedAt IS NULL
      GROUP BY tp.id
      ORDER BY tp.order ASC
    `

    // Tâches créées vs terminées par jour (7 derniers jours)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const tasksCreatedVsCompleted = await this.prisma.$queryRaw`
      SELECT 
        DATE(t.createdAt) as date,
        COUNT(t.id) as created,
        SUM(CASE WHEN t.statusId = (
          SELECT id FROM TaskStatus 
          WHERE name = 'Done' 
          AND (projectId = ${projectId} OR projectId IS NULL)
          LIMIT 1
        ) THEN 1 ELSE 0 END) as completed
      FROM Task t
      WHERE t.projectId = ${projectId}
      AND t.createdAt >= ${sevenDaysAgo}
      AND t.deletedAt IS NULL
      GROUP BY DATE(t.createdAt)
      ORDER BY DATE(t.createdAt) ASC
    `

    // Tâches en retard
    const now = new Date()
    const overdueTasks = await this.prisma.task.count({
      where: {
        projectId,
        dueEnd: {
          lt: now,
        },
        statusId: {
          not: {
            in: await this.prisma.taskStatus
              .findMany({
                where: {
                  OR: [{ name: "Done" }, { name: "Completed" }, { name: "Cancelled" }],
                  projectId,
                },
                select: { id: true },
              })
              .then((statuses) => statuses.map((s) => s.id)),
          },
        },
        deletedAt: null,
      },
    })

    return {
      tasksByStatus,
      tasksByPriority,
      tasksCreatedVsCompleted,
      overdueTasks,
    }
  }
}
