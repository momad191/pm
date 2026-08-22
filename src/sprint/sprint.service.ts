import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Sprint, SprintDocument, SprintStatus } from './schemas/sprint.schema';

import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SearchSprintDto } from './dto/search-sprint.dto';

import { SprintCounter, SprintCounterDocument } from './schemas/counter.schema';


import { EventEmitter2 } from '@nestjs/event-emitter';
import { SprintCreatedEvent } from './events/sprint-created.event';
import { SprintUpdatedEvent } from './events/sprint-updated.event';


@Injectable()
export class SprintService {
  constructor(
    @InjectModel(Sprint.name)
    private readonly sprintModel: Model<SprintDocument>,
    @InjectModel(SprintCounter.name)
    private counterModel: Model<SprintCounterDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getNextSprintId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'sprintId' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

    return counter.seq;
  }

  async create(createSprintDto: CreateSprintDto,companyId:string) {

    companyId = companyId;
    const nextSprintId = await this.getNextSprintId();

    const existingSprint = await this.sprintModel.findOne({
      sprintId: createSprintDto.sprintId,
      isDeleted: false,
    });

    if (existingSprint) {
      throw new ConflictException('Sprint ID already exists');
    }

    const sprint = await this.sprintModel.create({
      ...createSprintDto,
      sprintId: `SPRINT-${nextSprintId}`,
    });


    this.eventEmitter.emit('sprint.created', new SprintCreatedEvent(sprint));

    return sprint;
  }

  async findAll(companyId:string) {
    return this.sprintModel
      .find({
        isDeleted: false,
        companyId:companyId
      })
      .populate('projectId')
      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string,companyId:string) {

    companyId = companyId;
    const sprint = await this.sprintModel.findById(id).populate('projectId');

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    return sprint;
  }

  async update(id: string, updateSprintDto: UpdateSprintDto,companyId:string) {
    companyId=companyId
    const sprint = await this.sprintModel.findByIdAndUpdate(
      id,
      updateSprintDto,
      {
        returnDocument: 'after',
      },
    );

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    this.eventEmitter.emit('sprint.updated', new SprintUpdatedEvent(sprint));

    return sprint;
  }

  async remove(id: string,companyId:string) {
    companyId=companyId;
    const sprint = await this.sprintModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
      },
      {
        returnDocument: 'after',
      },
    );

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    return {
      success: true,
      message: 'Sprint deleted successfully',
    };
  }

  async search(query: SearchSprintDto, companyId:string) {
     
    const {
      keyword,
      projectId,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
      companyId:companyId
    };

    if (keyword) {
      filter.$or = [
        {
          sprintId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          goal: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (status) {
      filter.status = status;
    }

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const data = await this.sprintModel
      .find(filter)
      .populate('projectId')
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const total = await this.sprintModel.countDocuments(filter);

    return {
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data,
    };
  }

  async findByProject(projectId: string,companyId:string) {
    return this.sprintModel
      .find({
        projectId: projectId,
        isDeleted: false,
        companyId:companyId
      })
      .sort({
        startDate: -1,
      })
      .populate('projectId');
  }

  async activateSprint(id: string,companyId:string) {
    companyId=companyId
    const sprint = await this.sprintModel.findById(id);

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    await this.sprintModel.updateMany(
      {
        projectId: sprint.projectId,
        status: SprintStatus.ACTIVE,
      },
      {
        status: SprintStatus.PLANNED,
      },
    );

    sprint.status = SprintStatus.ACTIVE;

    await sprint.save();

     this.eventEmitter.emit('sprint.updated', new SprintUpdatedEvent(sprint));

    return sprint;
  }

  async completeSprint(id: string,companyId:string) {
    companyId=companyId;
    const sprint = await this.sprintModel.findById(id);

    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    sprint.status = SprintStatus.COMPLETED;

    sprint.progressPercentage = 100;

    await sprint.save();

    this.eventEmitter.emit('sprint.updated', new SprintUpdatedEvent(sprint));

    return sprint;
  }
}
