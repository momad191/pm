import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { ReportUpdatedEvent } from '../../../report/events/report-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class ReportUpdatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('report.updated')
  async handleReportUpdated(event: ReportUpdatedEvent) {
    const { report } = event; 

    const reportId = report?._id?.toString();

    const companyId = report?.companyId?.toString();

    const createdBy = report?.createdBy?.toString();

    const updatedBy = report?.updatedBy?.toString();

    const generatedBy = report?.generatedBy?.toString();

    const projectId = report?.projectId?.toString();

    const reportTitle =
      report?.title || 'Report';

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

    if (!reportId || !companyId) {
      return;
    }

    // =====================================================
    // Determine User Who Performed The Update
    //
    // Prefer updatedBy.
    // If updatedBy is not available, fallback to
    // generatedBy.
    // =====================================================

    const updaterId = updatedBy || generatedBy;

    // =====================================================
    // 1. Notify User Who Updated The Report
    // =====================================================

    if (updaterId) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: updaterId,

        createdBy: createdBy || updaterId,

        title: `${reportTypeLabel} Report Updated`,

        message: `The ${reportTypeLabel.toLowerCase()} report "${reportTitle}" was updated successfully.`,

        type: NotificationType.REPORT_UPDATED,

        referenceId: reportId,

        referenceType: NotificationReferenceType.REPORT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/reports/${reportId}`,
      });
    }

    // =====================================================
    // 2. Notify Original Creator
    //
    // Only when the creator is different from the
    // user who performed the update.
    // =====================================================

    if (
      createdBy &&
      updaterId &&
      createdBy !== updaterId
    ) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: createdBy,

        createdBy: updaterId,

        title: `${reportTypeLabel} Report Updated`,

        message: `Your report "${reportTitle}" was updated successfully.`,

        type: NotificationType.REPORT_UPDATED,

        referenceId: reportId,

        referenceType: NotificationReferenceType.REPORT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/reports/${reportId}`,
      });
    }
  }
}
 
