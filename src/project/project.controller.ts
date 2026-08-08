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

  @Post()
  create(@Body() dto: CreateProjectDto) 
  {
    // const createdBy = (req as any).user?._id;
    return this.projectService.create(dto);
  }

  @Get('dashboard')
  dashboard() {
    return this.projectService.dashboard();
  }


  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get('search')
  search(@Query() query: SearchProjectDto) {
    return this.projectService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
