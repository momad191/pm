import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { TeamService } from './team.service';

import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { SearchTeamDto } from './dto/search-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  /**
   * ------------------------------------
   * Create Team
   * POST /team
   * ------------------------------------
   */
  @Post(':companyId')
  create(
    @Body()
    createTeamDto: CreateTeamDto,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.create(createTeamDto, companyId);
  }

  /**
   * ------------------------------------
   * Get All Teams
   * GET /team
   * ------------------------------------
   */
  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.teamService.findAll(companyId);
  }

  /**
   * ------------------------------------
   * Search Teams
   * GET /team/search
   * ------------------------------------
   */
  @Get(':companyId/search')
  search(
    @Query()
    query: SearchTeamDto,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.search(query, companyId);
  }

  /**
   * ------------------------------------
   * Get Teams By Team Lead
   * GET /team/lead/:userId
   * ------------------------------------
   */
  @Get(':companyId/lead/:userId')
  findByLead(
    @Param('userId')
    userId: string,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.findByLead(userId, companyId);
  }

  /**
   * ------------------------------------
   * Get Teams By Member
   * GET /team/member/:userId
   * ------------------------------------
   */
  @Get(':companyId/member/:userId')
  findByMember(
    @Param('userId')
    userId: string,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.findByMember(userId, companyId);
  }

  /**
   * ------------------------------------
   * Get Team By Id
   * GET /team/:id
   * ------------------------------------
   */
  @Get(':companyId/:id')
  findOne(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.findOne(id, companyId);
  }

  /**
   * ------------------------------------
   * Update Team
   * PATCH /team/:id
   * ------------------------------------
   */
  @Patch(':companyId/:id')
  update(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string,
    @Body()
    updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeamDto, companyId);
  }

  /**
   * ------------------------------------
   * Add Member
   * PATCH /team/:id/add-member
   * ------------------------------------
   */
  @Patch(':companyId/:id/add-member')
  addMember(
    @Param('id')
    id: string,

    @Param('companyId') companyId: string,

    @Body('userId')
    userId: string,
  ) {
    return this.teamService.addMember(id, userId, companyId);
  }

  /**
   * ------------------------------------
   * Remove Member
   * PATCH /team/:id/remove-member
   * ------------------------------------
   */
  @Patch(':companyId/:id/remove-member')
  removeMember(
    @Param('id')
    id: string,

    @Param('companyId') companyId: string,

    @Body('userId')
    userId: string,
  ) {
    return this.teamService.removeMember(id, userId, companyId);
  }

  /**
   * ------------------------------------
   * Change Team Lead
   * PATCH /team/:id/change-lead
   * ------------------------------------
   */
  @Patch(':companyId/:id/change-lead')
  changeLead(
    @Param('id')
    id: string,

    @Param('companyId') companyId: string,

    @Body('teamLead')
    teamLead: string,
  ) {
    return this.teamService.changeLead(id, teamLead, companyId);
  }

  /**
   * ------------------------------------
   * Change Team Status
   * PATCH /team/:id/status
   * ------------------------------------
   */
  @Patch(':companyId/:id/status')
  changeStatus(
    @Param('id')
    id: string,

    @Param('companyId') companyId: string,

    @Body('status')
    status: string,
  ) {
    return this.teamService.changeStatus(id, status,companyId);
  }

  /**
   * ------------------------------------
   * Soft Delete Team
   * DELETE /team/:id
   * ------------------------------------
   */
  @Delete(':companyId/:id')
  remove(
    @Param('id')
    id: string,
    @Param('companyId') companyId: string
  ) {
    return this.teamService.remove(id,companyId);
  }
} 
