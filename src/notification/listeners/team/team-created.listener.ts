import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { TeamCreatedEvent } from '../../../team/events/team-created.event';

import { NotificationService } from '../../notification.service';

import {
  NotificationPriority,
  NotificationReferenceType,
  NotificationType,
} from '../../schemas/notification.schema';

@Injectable()
export class TeamCreatedListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('team.created')
  async handleTeamCreated(event: TeamCreatedEvent) {
    const { team } = event;

    const teamId = team?._id?.toString();

    const companyId = team?.companyId?.toString();

    const teamName = team?.name;

    const teamLead = team?.teamLead?.toString();

    const members = (team?.members || []).map((member) =>
      member?.toString(),
    );

    const createdBy = event?.createdBy?.toString();

    // =====================================================
    // Safety Checks
    // =====================================================

    if (!teamId || !companyId || !teamName) {
      return;
    }

    // =====================================================
    // 1. Notify Team Lead
    // =====================================================

    if (teamLead) {
      await this.notificationService.create({
        companyId,

        userId: teamLead,

        createdBy,

        title: 'Team Created',

        message: `You have been assigned as team lead of "${teamName}".`,

        type: NotificationType.TEAM_CREATED,

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
      // Don't send another notification to the team lead
      if (!memberId || memberId === teamLead) {
        continue;
      }

      await this.notificationService.create({
        companyId,

        userId: memberId,

        createdBy,

        title: 'Added to Team',

        message: `You have been added to the team "${teamName}".`,

        type: NotificationType.TEAM_CREATED,

        referenceId: teamId,

        referenceType: NotificationReferenceType.TEAM,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/teams/${teamId}`,
      });
    }

    // =====================================================
    // 3. Notify Team Creator
    // =====================================================

    if (
      createdBy &&
      createdBy !== teamLead &&
      !members.includes(createdBy)
    ) {
      await this.notificationService.create({
        companyId,

        userId: createdBy,

        createdBy,

        title: 'Team Created Successfully',

        message: `Team "${teamName}" was created successfully.`,

        type: NotificationType.TEAM_CREATED,

        referenceId: teamId,

        referenceType: NotificationReferenceType.TEAM,

        priority: NotificationPriority.NORMAL,

        actionUrl: `/teams/${teamId}`,
      });
    }
  }
}
 
