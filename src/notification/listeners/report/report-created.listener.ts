import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { ReportCreatedEvent } from '../../../report/events/report-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class ReportCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('report.created')
  async handleReportCreated(event: ReportCreatedEvent) {
    const { report } = event;

    const reportId = report?._id?.toString();

    const companyId = report?.companyId?.toString();

    const createdBy = report?.createdBy?.toString();

    const generatedBy = report?.generatedBy?.toString();

    const projectId = report?.projectId?.toString();

    const reportTitle =
      report?.title || 'New Report';

    const reportType = report?.reportType;

    // =====================================================
    // Report Type Label
    // =====================================================

    const reportTypeLabelMap: Record<string, string> = {
      PROJECT_STATUS: 'Project Status',
      RISK_REPORT: 'Risk',
      ISSUE_REPORT: 'Issue',
      DELAY_REPORT: 'Delayed Task',
      TEAM_PERFORMANCE: 'Team Performance',
    };

    const reportTypeLabel =
      reportTypeLabelMap[reportType] || 'Report';

    // =====================================================
    // Safety Check
    // =====================================================

    if (!reportId || !companyId || !generatedBy) {
      return;
    }

    // =====================================================
    // 1. Notify Report Generator
    // =====================================================

    await this.notificationService.create({
      companyId,

      projectId,

      userId: generatedBy,

      createdBy,

      title: `${reportTypeLabel} Report Generated`,

      message: `Your ${reportTypeLabel.toLowerCase()} report "${reportTitle}" has been generated successfully.`,

      type: NotificationType.REPORT_CREATED,

      referenceId: reportId,

      referenceType: NotificationReferenceType.REPORT,

      priority: NotificationPriority.NORMAL,

      actionUrl: `/reports/${reportId}`,
    });

    // =====================================================
    // 2. Notify Creator
    //
    // Only if the creator is different from the
    // user who generated the report.
    // =====================================================

    if (
      createdBy &&
      createdBy !== generatedBy
    ) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: createdBy,

        createdBy,

        title: 'Report Created Successfully',

        message: `Report "${reportTitle}" was created successfully.`,

        type: NotificationType.REPORT_CREATED,

        referenceId: reportId,

        referenceType: NotificationReferenceType.REPORT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/reports/${reportId}`,
      });
    }
  }
}
 
