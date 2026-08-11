import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { CompanyCreatedEvent } from '../../../company/events/company-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class CompanyCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('company.created')
  async handleCompanyCreated(
    event: CompanyCreatedEvent,
  ) {
    const { company } = event;

    const companyId = company?._id?.toString(); 

     const createdBy = company?.createdBy?.toString();

    const companyCode = company?.companyId;

    const companyName = company?.companyName;

    const ownerName = company?.ownerName;

    const ownerEmail = company?.ownerEmail;

    // =====================================================
    // Validate required information
    // =====================================================

    if (!companyId || !companyName) {
      return;
    }

    // =====================================================
    // Notify Company Owner
    // =====================================================

    /**
     * If ownerEmail is available but you don't have the
     * owner's User ObjectId in the Company document,
     * we cannot use userId here.
     *
     * The notification is therefore created without
     * userId unless your system later resolves the owner
     * email to a User.
     */

    await this.notificationService.create({
      companyId: companyId,

      createdBy:createdBy,

      userId:createdBy,

      title: 'Company Created Successfully',

      message: ownerName
        ? `Company "${companyName}" was created successfully for ${ownerName}.`
        : `Company "${companyName}" was created successfully.`,

      type: NotificationType.COMPANY_CREATED,

      referenceId: companyId,

      referenceType:
        NotificationReferenceType.COMPANY,

      priority:
        NotificationPriority.NORMAL,

      actionUrl: `/companies/${companyId}`,
    });

    // =====================================================
    // Optional logging / future email notification
    // =====================================================

    /**
     * companyCode:
     *   ${companyCode}
     *
     * ownerEmail:
     *   ${ownerEmail}
     *
     * These values can later be used for:
     *
     * 1. Email notification
     * 2. Welcome email
     * 3. Company onboarding notification
     * 4. Owner user lookup
     */
  }
}
 
