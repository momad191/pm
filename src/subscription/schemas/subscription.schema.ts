import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;
 
@Schema({
  timestamps: true,
})
export class Subscription {
  /**
   * Subscription Name
   *
   * Example:
   * FREE
   * BASIC
   * PROFESSIONAL
   * ENTERPRISE
   */
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  /**
   * Subscription Duration
   *
   * Duration in days.
   *
   * Example:
   * 30  = Monthly
   * 365 = Yearly
   */
  @Prop({
    required: true,
    min: 1,
  })
  duration: number;

  /**
   * Maximum Number of Users
   */
  @Prop({
    required: true,
    min: 1,
  })
  number_of_users: number;

  /**
   * Maximum Number of Projects
   */
  @Prop({
    required: true,
    min: 1,
  })
  number_of_projects: number;

  /**
   * Maximum Storage
   *
   * Storage value in GB.
   *
   * Example:
   * 5   = 5 GB
   * 50  = 50 GB
   * 500 = 500 GB
   */
  @Prop({
    required: true,
    min: 1,
  })
  storage: number;

  /**
   * Soft Delete
   */
  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const SubscriptionSchema =
  SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({
  name: 1,
});

SubscriptionSchema.index({
  isDeleted: 1,
});

SubscriptionSchema.index({
  createdAt: -1,
});