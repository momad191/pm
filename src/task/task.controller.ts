import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { TaskService } from './task.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }
 
  /**
   * POST /task
   */
  @Post(':companyId')
  create(
    @Body()
    createTaskDto: CreateTaskDto,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.create(createTaskDto, companyId);
  }

  /**
   * GET /task
   */
  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.taskService.findAll(companyId);
  }

  /**
   * GET /task/search
   */
  @Get(':companyId/search')
  search(
    @Query()
    query: SearchTaskDto,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.search(query, companyId);
  }

  /**
   * GET /task/project/:projectId
   */
  @Get(':companyId/project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.findByProject(projectId, companyId);
  }

  /**
   * GET /task/sprint/:sprintId
   */
  @Get(':companyId/sprint/:sprintId')
  findBySprint(
    @Param('sprintId')
    sprintId: string,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.findBySprint(sprintId, companyId);
  }

  /**
   * GET /task/user/:userId
   */
  @Get(':companyId/user/:userId')
  findByUser(
    @Param('userId')
    userId: string,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.findByUser(userId, companyId);
  }

  /**
   * GET /task/:id
   */
  @Get(':companyId/:id')
  findOne(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.findOne(id, companyId);
  }

  /**
   * PATCH /task/:id
   */
  @Patch(':companyId/:id')
  update(
    
  @Param('id')id: string,

  @Body() updateTaskDto: UpdateTaskDto,

  @Param('companyId') companyId: string

  ) {
    return this.taskService.update(id, updateTaskDto, companyId);
  }

  /**
   * PATCH /task/:id/status
   */
  @Patch(':companyId/:id/status')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    updateTaskDto: UpdateTaskDto,
 
  @Param('companyId') companyId: string

  ) {
    return this.taskService.updateStatus(id, updateTaskDto,companyId);
  }

  /**
   * DELETE /task/:id
   */
  @Delete(':companyId/:id')
  remove(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.taskService.remove(id,companyId);
  }
}
