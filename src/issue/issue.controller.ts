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

import { IssueService } from './issue.service';

import { CreateIssueDto } from './dto/create-issue.dto';

import { UpdateIssueDto } from './dto/update-issue.dto';

import { SearchIssueDto } from './dto/search-issue.dto';


@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) { }

  @Post(':companyId')
  create(
    @Body()
    createIssueDto: CreateIssueDto,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.create(createIssueDto, companyId);
  }

  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.issueService.findAll(companyId);
  }

  @Get(':companyId/search')
  search(
    @Query()
    query: SearchIssueDto,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.search(query, companyId);
  }

  @Get(':companyId/project/:projectId')
  findByProject(
    @Param('projectId')
    projectId: string,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.findByProject(projectId, companyId);
  }

  @Get(':companyId/task/:taskId')
  findByTask(
    @Param('taskId')
    taskId: string,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.findByTask(taskId, companyId);
  }

  @Get(':companyId/user/:userId')
  findByUser(
    @Param('userId')
    userId: string,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.findByUser(userId, companyId);
  }

  @Get(':companyId/:id')
  findOne(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.findOne(id,companyId);
  }

  @Patch(':companyId/:id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateIssueDto: UpdateIssueDto,

    @Param('companyId') companyId: string
  ) {
    return this.issueService.update(id, updateIssueDto,companyId);
  }

  @Patch(':companyId/:id/status')
  updateStatus(
    @Param('id')
    id: string,

    @Param('companyId') companyId: string,

    @Body()
    body: {
      status: string;
    },
    
  ) {
    return this.issueService.updateStatus(id, body.status,companyId);
  }

  @Delete(':companyId/:id')
  remove(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.issueService.remove(id,companyId);
  }
}
 