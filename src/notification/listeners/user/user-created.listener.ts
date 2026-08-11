 import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '../../../user/events/user-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class UserCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('user.created')
  async handleUserCreated(event: UserCreatedEvent) {
    const { user } = event;

    // =====================================================
    // Safe values
    // =====================================================

    const userId = user?._id?.toString();

    const companyId = user?.companyId?.toString();

    const createdBy = user?.createdBy?.toString();

    const firstName = user?.firstName ?? '';

    const lastName = user?.lastName ?? '';

    const fullName = `${firstName} ${lastName}`.trim();

    const email = user?.email;

    const role = user?.role;

    // =====================================================
    // 1. Notify the newly created user
    // =====================================================

    if (userId && companyId) {
      await this.notificationService.create({
        companyId,

        userId,

        createdBy,

        title: 'Account Created Successfully',

        message: `Your account has been created successfully${fullName ? `, ${fullName}` : ''}.`,

        type: NotificationType.USER_CREATED,

        referenceId: userId,

        referenceType: NotificationReferenceType.USER,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/users/${userId}`,
      });
    }

    // =====================================================
    // 2. Notify the user who created the account
    // =====================================================

    if (
      createdBy &&
      userId &&
      createdBy !== userId &&
      companyId
    ) {
      await this.notificationService.create({
        companyId,

        userId: createdBy,

        createdBy,

        title: 'User Created Successfully',

        message: `User "${fullName || email || 'New User'}" has been created successfully${role ? ` with role ${role}` : ''}.`,

        type: NotificationType.USER_CREATED,

        referenceId: userId,

        referenceType: NotificationReferenceType.USER,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/users/${userId}`,
      });
    }
  }
}