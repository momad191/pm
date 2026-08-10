import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { TeamUpdatedEvent } from '../../../team/events/team-updated.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class TeamUpdatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('team.updated')
  async handleTeamUpdated(event: TeamUpdatedEvent) {
    const { team } = event;

    const teamId = team?._id?.toString();

    const companyId = team?.companyId?.toString();

    const teamName = team?.name;

    const teamLead = team?.teamLead?.toString();

    const members = (team?.members || []).map((member) =>
      member?.toString(),
    );

    const updatedBy = team?.updatedBy?.toString();

    // =====================================================
    // Safety Checks
    // =====================================================

    if (!teamId || !companyId || !teamName) {
      return;
    }

    // =====================================================
    // 1. Notify Team Lead
    // =====================================================

    if (teamLead && teamLead !== updatedBy) {
      await this.notificationService.create({
        companyId,

        userId: teamLead,

        createdBy: updatedBy,

        title: 'Team Updated',

        message: `The team "${teamName}" has been updated.`,

        type: NotificationType.TEAM_UPDATED,

        referenceId: teamId,

        referenceType: NotificationReferenceType.TEAM,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/teams/${teamId}`,
      });
    }

    // =====================================================
    // 2. Notify Team Members
    // =====================================================

    for (const memberId of members) {
      if (!memberId) {
        continue;
      }

      // Don't notify the user who performed the update
      if (memberId === updatedBy) {
        continue;
      }

      // Don't send duplicate notification to team lead
      if (memberId === teamLead) {
        continue;
      }

      await this.notificationService.create({
        companyId,

        userId: memberId,

        createdBy: updatedBy,

        title: 'Team Updated',

        message: `The team "${teamName}" has been updated.`,

        type: NotificationType.TEAM_UPDATED,

        referenceId: teamId,

        referenceType: NotificationReferenceType.TEAM,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/teams/${teamId}`,
      });
    }

    // =====================================================
    // 3. Notify User Who Updated The Team
    // =====================================================

    if (updatedBy) {
      await this.notificationService.create({
        companyId,

        userId: updatedBy,

        createdBy: updatedBy,

        title: 'Team Updated Successfully',

        message: `Team "${teamName}" was updated successfully.`,

        type: NotificationType.TEAM_UPDATED,

        referenceId: teamId,

        referenceType: NotificationReferenceType.TEAM,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/teams/${teamId}`,
      });
    }
  }
}
 
