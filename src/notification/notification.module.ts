import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { NotificationController } from './notification.controller';

import { NotificationService } from './notification.service';

import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

import { ProjectCreatedListener } from './listeners/project/project-created.listener';
import { ProjectUpdatedListener } from './listeners/project/project-updated.listener';

import { TaskCreatedListener } from './listeners/task/task-created.listener';
import { TaskUpdatedListener } from './listeners/task/task-updated.listener';

import { TeamCreatedListener } from './listeners/team/team-created.listener';
import { TeamUpdatedListener } from './listeners/team/team-updated.listener';



@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],

  controllers: [NotificationController],

  providers: [
    NotificationService,
    ProjectCreatedListener,
    ProjectUpdatedListener,
    TaskCreatedListener,
    TaskUpdatedListener,
    TeamCreatedListener,
    TeamUpdatedListener
  ],

  exports: [NotificationService],
})
export class NotificationModule { }
