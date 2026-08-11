import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { UserUpdatedEvent } from '../../../user/events/user-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class UserUpdatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('user.updated')
  async handleUserUpdated(event: UserUpdatedEvent) {
    const { user } = event;

    // =====================================================
    // Safe values
    // =====================================================

    const userId = user?._id?.toString();

    const companyId = user?.companyId?.toString();

    const updatedBy = user?.updatedBy?.toString();

    const firstName = user?.firstName ?? '';

    const lastName = user?.lastName ?? '';

    const fullName =
      `${firstName} ${lastName}`.trim() ||
      user?.username ||
      user?.email ||
      'User';

    // =====================================================
    // Validate required values
    // =====================================================

    if (!userId || !companyId) {
      return;
    }

    // =====================================================
    // 1. Notify Updated User
    // =====================================================

    await this.notificationService.create({
      companyId: companyId,

      userId: userId,

      createdBy: updatedBy,

      title: 'Profile Updated',

      message: `Your user profile "${fullName}" was updated successfully.`,

      type: NotificationType.USER_UPDATED,

      referenceId: userId,

      referenceType: NotificationReferenceType.USER,

      priority: NotificationPriority.NORMAL,

      actionUrl: `/users/${userId}`,
    });

    // =====================================================
    // 2. Notify User Who Performed The Update
    // =====================================================

    if (updatedBy && updatedBy !== userId) {
      await this.notificationService.create({
        companyId: companyId,

        userId: updatedBy,

        createdBy: updatedBy,

        title: 'User Updated Successfully',

        message: `User "${fullName}" was updated successfully.`,

        type: NotificationType.USER_UPDATED,

        referenceId: userId,

        referenceType: NotificationReferenceType.USER,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/users/${userId}`,
      });
    }
  }
}
 
