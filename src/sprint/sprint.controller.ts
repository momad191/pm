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
 
import { SprintService } from './sprint.service';

import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SearchSprintDto } from './dto/search-sprint.dto';
 
@Controller('sprint')
export class SprintController {
  constructor(
    private readonly sprintService: SprintService,
  ) {}

  /**
   * POST /sprint
   */ 
  @Post(':companyId') 
  create(
    @Body()
    createSprintDto: CreateSprintDto,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.create(
      createSprintDto,
      companyId
    );
  }

  /**
   * GET /sprint
   */
  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.sprintService.findAll(companyId);
  }

  /**
   * GET /sprint/search
   */
  @Get(':companyId/search')
  search(
    @Query()
    query: SearchSprintDto,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.search(
      query,
      companyId
    );
  }

  /**
   * GET /sprint/project/:projectId
   */
  @Get(':companyId/project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.findByProject(
      projectId,
      companyId
    );
  }

  /**
   * GET /sprint/:id
   */
  @Get(':companyId/:id')
  findOne(
    @Param('id') id: string,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.findOne(id,companyId);
  }

  /**
   * PATCH /sprint/:id
   */
  @Patch(':companyId/:id')
  update(
    @Param('id') id: string,
    @Body() updateSprintDto: UpdateSprintDto,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.update(
      id,
      updateSprintDto,
      companyId
    );
  }

  /**
   * PATCH /sprint/:id/activate
   */
  @Patch(':companyId/:id/activate')
  activateSprint(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.activateSprint(
      id,
      companyId
    );
  }

  /**
   * PATCH /sprint/:id/complete
   */
  @Patch(':companyId/:id/complete')
  completeSprint(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.sprintService.completeSprint(
      id,companyId
    );
  }
 
  /**
   * DELETE /sprint/:id
   */
  @Delete(':companyId/:id')
  remove(
    @Param('id')
    id: string,
     @Param('companyId') companyId: string
  ) {
    return this.sprintService.remove(id,companyId);
  }
}