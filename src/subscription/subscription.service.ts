import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import {
  Subscription,
  SubscriptionDocument,
} from './schemas/subscription.schema';

import { CreateSubscriptionDto } from './dto/create-subscription.dto';

import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  // =====================================================
  // Create
  // =====================================================

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionModel.create(
      createSubscriptionDto,
    );
  }

  // =====================================================
  // Find All
  // =====================================================

  async findAll() {
    return this.subscriptionModel
      .find({
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  // =====================================================
  // Find One
  // =====================================================

  async findOne(id: string) {
    const subscription =
      await this.subscriptionModel.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!subscription) {
      throw new NotFoundException(
        'Subscription not found',
      );
    }

    return subscription;
  }

  // =====================================================
  // Update
  // =====================================================

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const subscription =
      await this.subscriptionModel.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          $set: updateSubscriptionDto,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    if (!subscription) {
      throw new NotFoundException(
        'Subscription not found',
      );
    }

    return subscription;
  }

  // =====================================================
  // Soft Delete
  // =====================================================

  async remove(id: string) {
    const subscription =
      await this.subscriptionModel.findOneAndUpdate(
        {
          _id: id,
          isDeleted: false,
        },
        {
          $set: {
            isDeleted: true,
          },
        },
        {
          new: true,
        },
      );

    if (!subscription) {
      throw new NotFoundException(
        'Subscription not found',
      );
    }

    return {
      message: 'Subscription deleted successfully',
    };
  }
}