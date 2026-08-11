import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { RiskCreatedEvent } from '../../../risk/events/risk-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class RiskCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('risk.created')
  async handleRiskCreated(event: RiskCreatedEvent) {
    const { risk } = event;

    const riskId = risk?._id?.toString();

    const companyId = risk?.companyId?.toString();
 
    const projectId = risk?.projectId?.toString();

     const createdBy = risk?.createdBy?.toString();

    const taskId = risk?.taskId?.toString();

    const riskCode = risk?.riskId;

    const level = risk?.level;

    const description = risk?.description;

    // =====================================================
    // IMPORTANT
    // =====================================================
    // The Risk schema currently does not contain:
    //
    // createdBy
    // assignedTo
    // reportedBy
    //
    // Therefore this listener expects the event to optionally
    // provide the related project manager and task assignee.
    //
    // Example event:
    //
    // {
    //   risk,
    //   projectManagerId,
    //   taskAssigneeId
    // }
    //
    // =====================================================

    const projectManagerId =
      event?.projectManagerId?.toString();

    const taskAssigneeId =
      event?.taskAssigneeId?.toString();

    // =====================================================
    // 1. Notify Project Manager
    // =====================================================

    if (projectManagerId) {
      await this.notificationService.create({
        companyId,

        projectId,

        createdBy,

        userId: projectManagerId,

        title: 'New Project Risk Identified',

        message: `A new ${level} risk "${riskCode}" has been identified for the project.`,

        type: NotificationType.RISK_CREATED,

        referenceId: riskId,

        referenceType: NotificationReferenceType.RISK,

        priority:
          level === 'HIGH'
            ? NotificationPriority.HIGH
            : NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}/risks/${riskId}`,
      });
    }

    // =====================================================
    // 2. Notify Task Assignee
    // =====================================================

    if (
      taskAssigneeId &&
      taskAssigneeId !== projectManagerId
    ) {
      await this.notificationService.create({
        companyId,

        projectId,
        
        createdBy,

        userId: taskAssigneeId,

        title: 'Risk Identified on Your Task',

        message: `A ${level} risk has been identified on a task assigned to you: "${description}".`,

        type: NotificationType.RISK_CREATED,

        referenceId: riskId,

        referenceType: NotificationReferenceType.RISK,

        priority:
          level === 'HIGH'
            ? NotificationPriority.HIGH
            : NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}/tasks/${taskId}`,
      });
    }
  }
}