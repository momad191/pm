import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { TaskUpdatedEvent } from '../../../task/events/task-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class TaskUpdatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('task.updated')
  async handleTaskUpdated(event: TaskUpdatedEvent) {
    const { task } = event;

    const taskId = task?._id?.toString();

    const companyId = task?.companyId?.toString();

    const assignedTo = task?.assignedTo?.toString();

    const updatedBy = task?.updatedBy?.toString();

    const taskTitle = task?.title;

    // =====================================================
    // Safety checks
    // =====================================================

    if (!taskId || !companyId || !taskTitle) {
      return;
    }

    // =====================================================
    // 1. Notify Assigned User
    // =====================================================

    if (assignedTo) {
      await this.notificationService.create({
        companyId,

        projectId: task?.projectId?.toString(),

        userId: assignedTo,

        updatedBy: updatedBy,

        title: 'Task Updated',

        message: `The task "${taskTitle}" has been updated.`,

        type: NotificationType.TASK_UPDATED,

        referenceId: taskId,

        referenceType: NotificationReferenceType.TASK,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/tasks/${taskId}`,
      });
    }

    // =====================================================
    // 2. Notify User Who Updated The Task
    // =====================================================

    if (updatedBy && updatedBy !== assignedTo) {
      await this.notificationService.create({
        companyId,

        projectId: task?.projectId?.toString(),

        userId: updatedBy,

        updatedBy: updatedBy,

        title: 'Task Updated Successfully',

        message: `Task "${taskTitle}" was updated successfully.`,

        type: NotificationType.TASK_UPDATED,

        referenceId: taskId,

        referenceType: NotificationReferenceType.TASK,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/tasks/${taskId}`,
      });
    }
  }
}

