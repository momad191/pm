import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { TaskCreatedEvent } from '../../../task/events/task-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class TaskCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('task.created')
  async handleTaskCreated(
    event: TaskCreatedEvent,
  ) {
    const { task } = event;

    const taskId = task?._id?.toString();

    const companyId = task?.companyId?.toString();

    const projectId = task?.projectId?.toString();

    const assignedTo = task?.assignedTo?.toString();

    const taskTitle = task?.title;

    // =====================================================
    // Notify Assigned User
    // =====================================================

    if (assignedTo) {
      await this.notificationService.create({
        companyId: companyId,
 
        projectId: projectId,

        userId: assignedTo,

        title: 'New Task Assigned',

        message: `You have been assigned a new task "${taskTitle}".`,

        type: NotificationType.TASK_CREATED,

        referenceId: taskId,

        referenceType:
          NotificationReferenceType.TASK,

        priority:
          task?.priority === 'CRITICAL'
            ? NotificationPriority.HIGH
            : NotificationPriority.NORMAL,

        actionUrl: `/tasks/${taskId}`,
      });
    }
  }
}

