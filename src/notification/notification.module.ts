import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { NotificationController } from './notification.controller';

import { NotificationService } from './notification.service';

import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

import { ProjectCreatedListener } from './listeners/project-created.listener';

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

  providers: [NotificationService, ProjectCreatedListener,],

  exports: [NotificationService],
})
export class NotificationModule {}
