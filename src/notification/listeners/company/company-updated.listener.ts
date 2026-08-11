import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CompanyUpdatedEvent } from '../../../company/events/company-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class CompanyUpdatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('company.updated')
  async handleCompanyUpdated(event: CompanyUpdatedEvent) {
    const { company } = event;

    const companyId = company?._id?.toString();

    const companyCode = company?.companyId;

    const companyName = company?.companyName;

    const companyCreator = company?.createdBy?.toString();

    const updatedBy = company?.updatedBy?.toString();

    // =====================================================
    // Validate required information
    // =====================================================

    if (!companyId || !companyName) {
      return;
    }

    // =====================================================
    // Notify User Who Updated The Company
    // =====================================================

    if (updatedBy) {
      await this.notificationService.create({
        companyId: companyId,

        userId: updatedBy,

        updatedBy: updatedBy,

        title: 'Company Updated Successfully',

        message: `Company "${companyName}" was updated successfully.`,

        type: NotificationType.COMPANY_UPDATED, 

        referenceId: companyId,

        referenceType: NotificationReferenceType.COMPANY,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/companies/${companyId}`,
      });
    }

    // =====================================================
    // Optional:
    // Notify Company Creator if different from updater
    // =====================================================

    if (
      companyCreator &&
      companyCreator !== updatedBy
    ) {
      await this.notificationService.create({
        companyId: companyId,

        userId: companyCreator,

        updatedBy: updatedBy,

        title: 'Company Updated',

        message: `Company "${companyName}" was updated successfully.`,

        type: NotificationType.COMPANY_UPDATED,

        referenceId: companyId,

        referenceType: NotificationReferenceType.COMPANY,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/companies/${companyId}`,
      });
    }
  }
}
 
