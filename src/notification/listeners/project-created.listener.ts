import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { ProjectCreatedEvent } from '../../project/events/project-created.event';

import { NotificationService } from '../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../schemas/notification.schema';

@Injectable()
export class ProjectCreatedListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('project.created')
  async handleProjectCreated(event: ProjectCreatedEvent) {
    const { project } = event;

    const projectId = project?._id?.toString();

    const createdBy = project?.createdBy?.toString();

    const companyId = project?.companyId?.toString();

    const projectName = project?.name;

    const managerId = project?.managerId?.toString();

    // =====================================================
    // 1. Notify Project Manager
    // =====================================================

    if (managerId) {
      await this.notificationService.create({
        companyId: companyId,

        projectId: projectId,

        userId: managerId,

        createdBy: createdBy,

        title: 'New Project Assigned',

        message: `You have been assigned as manager of project "${projectName}".`,

        type: NotificationType.PROJECT_CREATED,

        referenceId: projectId,

        referenceType: NotificationReferenceType.PROJECT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}`,
      });
    }

    // =====================================================
    // 2. Notify Project Creator
    // =====================================================

    if (createdBy && createdBy !== managerId) {
      await this.notificationService.create({
        companyId: companyId,

        userId: createdBy,

        title: 'Project Created Successfully',

        message: `Project "${projectName}" was created successfully.`,

        type: NotificationType.PROJECT_CREATED,

        referenceId: projectId,

        referenceType: NotificationReferenceType.PROJECT,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/projects/${projectId}`,
      });
    }
  }
}
