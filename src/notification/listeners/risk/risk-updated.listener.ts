import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { RiskUpdatedEvent } from '../../../risk/events/risk-updated.event';

import { NotificationService } from '../../notification.service';

import {
    NotificationPriority,
    NotificationReferenceType,
    NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class RiskUpdatedListener {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @OnEvent('risk.updated')
    async handleRiskUpdated(
        event: RiskUpdatedEvent,
    ) {
        const { risk } = event;

        const riskId = risk?._id?.toString();

        const companyId = risk?.companyId?.toString();

        const projectId = risk?.projectId?.toString();

        const updatedBy = risk?.updatedBy?.toString();

        const userId = risk?.updatedBy?.toString();

        const taskId = risk?.taskId?.toString();

        const riskCode = risk?.riskId;

        const level = risk?.level;

        const status = risk?.status;

        const description = risk?.description;

        // =====================================================
        // Validate required data
        // =====================================================

        if (!riskId || !companyId) {
            return;
        }

        // =====================================================
        // Notify Project/Task Context
        //
        // Since the Risk schema does not contain:
        // - createdBy
        // - assignedTo
        // - managerId
        //
        // we cannot directly notify a specific user here.
        //
        // The notification is therefore created as a
        // project-level risk update notification.
        // =====================================================

        await this.notificationService.create({
            companyId,

            projectId,

            updatedBy,

            userId,

            title: 'Risk Updated',

            message: `Risk "${riskCode || riskId}" was updated. Level: ${level || 'N/A'
                }, Status: ${status || 'N/A'}.`,

            type: NotificationType.RISK_UPDATED,

            referenceId: riskId,

            referenceType: NotificationReferenceType.RISK,

            priority:
                level === 'HIGH'
                    ? NotificationPriority.HIGH
                    : NotificationPriority.NORMAL,

            actionUrl: `/risks/${riskId}`,
        });

        // =====================================================
        // Optional detailed notification context
        // =====================================================

        // taskId and description are intentionally extracted
        // above so they can be included later when your
        // notification model supports additional metadata.
        //
        // Example:
        //
        // metadata: {
        //   taskId,
        //   riskId: riskCode,
        //   level,
        //   status,
        //   description,
        // }
    }
}

