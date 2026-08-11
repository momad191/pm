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

import { RiskCreatedListener } from './listeners/risk/risk-created.listener';
import { RiskUpdatedListener } from './listeners/risk/risk-updated.listener';



import { UserCreatedListener } from './listeners/user/user-created.listener';
import { UserUpdatedListener } from './listeners/user/user-updated.listener';


import { CompanyCreatedListener } from './listeners/company/company-created.listener';
import { CompanyUpdatedListener } from './listeners/company/company-updated.listener';


import { ReportCreatedListener } from './listeners/report/report-created.listener';
import { ReportUpdatedListener } from './listeners/report/report-updated.listener';




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
    TeamUpdatedListener,
    RiskCreatedListener,
    RiskUpdatedListener,
    UserCreatedListener,
    UserUpdatedListener,
    CompanyCreatedListener,
    CompanyUpdatedListener,
    ReportCreatedListener,
    ReportUpdatedListener

  ],

  exports: [NotificationService],
})
export class NotificationModule { }
