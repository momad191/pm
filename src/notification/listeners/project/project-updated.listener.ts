import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ProjectUpdatedEvent } from '../../../project/events/project-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema'; 
 
@Injectable()
export class ProjectUpdatedListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('project.updated')
  async handleProjectUpdated(event: ProjectUpdatedEvent) {
    const { project, previousManagerId } = event;

    const projectId = project?._id?.toString();

    const companyId = project?.companyId?.toString();

    const projectName = project?.name;

    const createdBy = project?.createdBy?.toString();

    const managerId = project?.managerId?.toString();

    // =====================================================
    // Safety checks
    // =====================================================

    if (!projectId || !companyId || !projectName) {
      return;
    }

    // =====================================================
    // 1. Manager Changed
    // =====================================================

    if (managerId && managerId !== previousManagerId) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: managerId,

        createdBy,

        title: 'Project Assignment Updated',

        message: `You have been assigned as manager of project "${projectName}".`,

        type: NotificationType.PROJECT_UPDATED,

        referenceId: projectId,

        referenceType: NotificationReferenceType.PROJECT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}`,
      });
    }

    // =====================================================
    // 2. Notify Current Project Manager
    //
    // Only notify if the manager was not newly assigned
    // above, otherwise they would receive two notifications.
    // =====================================================

    if (managerId && managerId === previousManagerId) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: managerId,

        createdBy,

        title: 'Project Updated',

        message: `Project "${projectName}" has been updated.`,

        type: NotificationType.PROJECT_UPDATED,

        referenceId: projectId,

        referenceType: NotificationReferenceType.PROJECT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}`,
      });
    }

    // =====================================================
    // 3. Notify Creator
    //
    // Avoid duplicate notification when creator is
    // already the project manager.
    // =====================================================

    if (createdBy && createdBy !== managerId) {
      await this.notificationService.create({
        companyId,

        projectId,

        userId: createdBy,

        createdBy,

        title: 'Project Updated Successfully',

        message: `Project "${projectName}" was updated successfully.`,

        type: NotificationType.PROJECT_UPDATED,

        referenceId: projectId,

        referenceType: NotificationReferenceType.PROJECT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}`,
      });
    }
  }
}
