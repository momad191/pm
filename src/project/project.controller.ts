import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req
} from '@nestjs/common';
import { Request } from 'express';

import { ProjectService } from './project.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SearchProjectDto } from './dto/search-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Post(':companyId')
  create(@Body() dto: CreateProjectDto, @Param('companyId') companyId: string) {
    // const createdBy = (req as any).user?._id;
    return this.projectService.create(dto, companyId);
  }

  @Get(':companyId/dashboard')
  dashboard(@Param('companyId') companyId: string) {
    return this.projectService.dashboard(companyId);
  }


  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.projectService.findAll(companyId);
  }

  @Get(':companyId/search')
  search(@Query() query: SearchProjectDto, @Param('companyId') companyId: string) {
    return this.projectService.search(query, companyId);
  }

  @Get(':companyId/:id')
  findOne(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.projectService.findOne(id,companyId);
  }

  @Patch(':companyId/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @Param('companyId') companyId: string) {
    return this.projectService.update(id, dto, companyId);
  }

  @Delete(':companyId/:id')
  remove(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.projectService.remove(id,companyId);
  }
}
