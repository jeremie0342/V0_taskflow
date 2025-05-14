import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common"
import type { ProjectsService } from "./projects.service"
import type { CreateProjectDto } from "./dto/create-project.dto"
import type { UpdateProjectDto } from "./dto/update-project.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import type { ProjectQueryDto } from "./dto/project-query.dto"
import { User } from "../auth/decorators/user.decorator"

@Controller("projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles("ADMIN", "PROJECT_MANAGER")
  create(@Body() createProjectDto: CreateProjectDto, @User() user) {
    return this.projectsService.create(createProjectDto, user.id)
  }

  @Get()
  findAll(@Query() query: ProjectQueryDto, @User() user) {
    return this.projectsService.findAll(query, user.id)
  }

  @Get(":id")
  findOne(@Param('id') id: string, @User() user) {
    return this.projectsService.findOne(id, user.id)
  }

  @Patch(":id")
  @Roles("ADMIN", "PROJECT_MANAGER")
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @User() user) {
    return this.projectsService.update(id, updateProjectDto, user.id)
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/archive')
  @Roles('ADMIN', 'PROJECT_MANAGER')
  archive(@Param('id') id: string) {
    return this.projectsService.archive(id);
  }

  @Patch(':id/unarchive')
  @Roles('ADMIN', 'PROJECT_MANAGER')
  unarchive(@Param('id') id: string) {
    return this.projectsService.unarchive(id);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.projectsService.getMembers(id);
  }

  @Get(":id/tasks")
  getTasks(@Param('id') id: string, @Query() query: any) {
    return this.projectsService.getTasks(id, query)
  }
}
