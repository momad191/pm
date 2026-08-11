import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  DELAY = 'DELAY',

  HIGH_RISK = 'HIGH_RISK',

  OPEN_ISSUE = 'OPEN_ISSUE',

  DEADLINE = 'DEADLINE',

  LOW_COMPLETION = 'LOW_COMPLETION',

  TASK_CREATED = 'TASK_CREATED',

  TASK_UPDATED = 'TASK_UPDATED',

  TASK_ASSIGNED = 'TASK_ASSIGNED',

  TASK_COMPLETED = 'TASK_COMPLETED',

  ISSUE_RESOLVED = 'ISSUE_RESOLVED',

  PROJECT_CREATED = 'PROJECT_CREATED',

  PROJECT_UPDATED = 'PROJECT_UPDATED',

  SPRINT_STARTED = 'SPRINT_STARTED',

  TEAM_CREATED = 'TEAM_CREATED',

   TEAM_UPDATED='TEAM_UPDATED',

   RISK_CREATED= 'RISK_CREATED',

   RISK_UPDATED= 'RISK_UPDATED',

   USER_CREATED='USER_CREATED',

   USER_UPDATED= 'USER_UPDATED',

   COMPANY_CREATED='COMPANY_CREATED',

   COMPANY_UPDATED='COMPANY_UPDATED',

   REPORT_CREATED='REPORT_CREATED',

   REPORT_UPDATED='REPORT_UPDATED'
}

export enum NotificationReferenceType {
  PROJECT = 'PROJECT',

  SPRINT = 'SPRINT',
 
  TASK = 'TASK',

  RISK = 'RISK',

  ISSUE = 'ISSUE',

  TEAM = 'TEAM',

  USER= 'USER',

  COMPANY='COMPANY',

  REPORT='REPORT'
}

export enum NotificationPriority {
  LOW = 'LOW',

  NORMAL = 'NORMAL',

  HIGH = 'HIGH',

  URGENT = 'URGENT',
}

export enum NotificationSource {
  SYSTEM = 'SYSTEM',

  PROJECT = 'PROJECT',

  TASK = 'TASK',

  SPRINT = 'SPRINT',

  ISSUE = 'ISSUE',

  RISK = 'RISK',

  AUTH = 'AUTH',
}

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: false,
    index: true,
  })
  projectId: Types.ObjectId;

  @Prop({})
  referenceId?: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 500,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  message: string;

  @Prop({
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @Prop({
    default: false,
  })
  isRead: boolean;

  @Prop({
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    enum: NotificationReferenceType,
  })
  referenceType?: NotificationReferenceType;

  @Prop({
    default: false,
  })
  isArchived: boolean;

  @Prop({
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  })
  expiresAt?: Date;

  @Prop({
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Prop({
    required: false,
    trim: true,
    maxlength: 1000,
  })
  actionUrl: string;

  @Prop({
    enum: NotificationSource,
    default: NotificationSource.SYSTEM,
  })
  source: NotificationSource;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// NotificationSchema.index({
//   userId: 1,
// });

NotificationSchema.index({
  type: 1,
});

NotificationSchema.index({
  isRead: 1,
});

NotificationSchema.index({
  isDeleted: 1,
});

NotificationSchema.index({
  createdAt: -1,
});

NotificationSchema.index({
  referenceId: 1,
});

NotificationSchema.index({
  referenceType: 1,
});

NotificationSchema.index({
  isArchived: 1,
});

NotificationSchema.index({
  userId: 1,
  isRead: 1,
});

NotificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

NotificationSchema.index({
  userId: 1,
  createdAt: -1,
});

NotificationSchema.index({
  userId: 1,
  isArchived: 1,
});

NotificationSchema.index({
  userId: 1,
  priority: 1,
});

NotificationSchema.index({
  userId: 1,
  type: 1,
});
