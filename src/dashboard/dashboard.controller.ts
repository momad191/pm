import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  // =====================================================
  // Dashboard Overview
  // GET /dashboard/overview?companyId=...
  // =====================================================

  @Get('overview')
  getOverview(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getOverview(companyId);
  }

  // =====================================================
  // Project Health Dashboard
  // GET /dashboard/project-health?companyId=...
  // =====================================================

  @Get('project-health')
  getProjectHealth(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getProjectHealth(companyId);
  }

  // =====================================================
  // Team Workload Dashboard
  // GET /dashboard/workload?companyId=...
  // =====================================================

  @Get('workload')
  getWorkload(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getWorkload(companyId);
  }

  // =====================================================
  // Executive Dashboard
  // GET /dashboard/executive?companyId=...
  // =====================================================

  @Get('executive')
  getExecutiveDashboard(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getExecutiveDashboard(
      companyId,
    );
  }

  // =====================================================
  // Dashboard Charts
  // GET /dashboard/charts?companyId=...
  // =====================================================

  @Get('charts')
  getCharts(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getCharts(companyId);
  }

  // =====================================================
  // Single Project Dashboard
  // GET /dashboard/project/:id?companyId=...
  // =====================================================

  @Get('project/:id')
  getProjectDashboard(
    @Param('id') id: string,
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getProjectDashboard(
      id,
      companyId,
    );
  }

  // =====================================================
  // Manager Dashboard
  // GET /dashboard/manager/:managerId?companyId=...
  // =====================================================

  @Get('manager/:managerId')
  getManagerDashboard(
    @Param('managerId') managerId: string,
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getManagerDashboard(
      managerId,
      companyId,
    );
  }

  // =====================================================
  // Team Dashboard
  // GET /dashboard/team/:userId?companyId=...
  // =====================================================

  @Get('team/:userId')
  getTeamDashboard(
    @Param('userId') userId: string,
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getTeamDashboard(
      userId,
      companyId,
    );
  }

  // =====================================================
  // Risk Analysis Dashboard
  // GET /dashboard/risk-analysis?companyId=...
  // =====================================================

  @Get('risk-analysis')
  getRiskAnalysis(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getRiskAnalysis(companyId);
  }

  // =====================================================
  // Performance Dashboard
  // GET /dashboard/performance?companyId=...
  // =====================================================

  @Get('performance')
  getPerformance(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getPerformance(companyId);
  }

  // =====================================================
  // Trends Dashboard
  // GET /dashboard/trends?companyId=...
  // =====================================================

  @Get('trends')
  getTrends(
    @Query('companyId') companyId: string,
  ) {
    return this.dashboardService.getTrends(companyId);
  }
}