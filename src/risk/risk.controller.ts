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

import { RiskService } from './risk.service';

import { CreateRiskDto } from './dto/create-risk.dto';

import { UpdateRiskDto } from './dto/update-risk.dto';

import { SearchRiskDto } from './dto/search-risk.dto';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly riskService: RiskService,
  ) { }

  /**
   * POST /risk
   */
  @Post(':companyId')
  create(
    @Body()
    createRiskDto: CreateRiskDto,
    @Param('companyId') companyId: string
  ) {
    return this.riskService.create(
      createRiskDto,
      companyId
    );
  }

  /**
   * GET /risk
   */
  @Get(':companyId') 
  findAll(@Param('companyId') companyId: string) {
    return this.riskService.findAll(companyId);
  }

  /**
   * GET /risk/search
   */
  @Get(':companyId/search')
  search(
    @Query()
    query: SearchRiskDto,
    @Param('companyId') companyId: string
  ) {
    return this.riskService.search(
      query,
      companyId
    );
  }

  /**
   * GET /risk/project/:projectId
   */
  @Get(':companyId/project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
    @Param('companyId') companyId: string
  ) {
    return this.riskService.findByProject(
      projectId,
      companyId
    );
  }

  /**
   * GET /risk/task/:taskId
   */
  @Get(':companyId/task/:taskId')
  findByTask(
    @Param('taskId')
    taskId: string,
    @Param('companyId') companyId: string
  ) {
    return this.riskService.findByTask(
      taskId,
      companyId
    );
  }

  /**
   * GET /risk/:id
   */
  @Get(':companyId/:id')
  findOne(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.riskService.findOne(id, companyId);
  }

  /**
   * PATCH /risk/:id
   */
  @Patch(':companyId/:id')
  update(
    @Param('id')
    id: string,
    

    @Body()
    updateRiskDto: UpdateRiskDto,

    @Param('companyId') companyId: string

  ) {
    return this.riskService.update(
      id,
      updateRiskDto,
      companyId
    );
  }

  /**
   * PATCH /risk/:id/status
   */
  @Patch(':companyId/:id/status')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    updateRiskDto: UpdateRiskDto,

    @Param('companyId') companyId: string
  ) {
    return this.riskService.updateStatus(
      id,
      updateRiskDto,
      companyId
    );
  }

  /**
   * DELETE /risk/:id
   */
  @Delete(':companyId/:id')
  remove(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string

  ) {
    return this.riskService.remove(id,companyId);
  }
} 