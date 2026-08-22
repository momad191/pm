import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Risk, RiskDocument, RiskStatus } from './schemas/risk.schema';

import { CreateRiskDto } from './dto/create-risk.dto';

import { UpdateRiskDto } from './dto/update-risk.dto';

import { SearchRiskDto } from './dto/search-risk.dto';

import { RiskCounter, RiskCounterDocument } from './schemas/counter.schema';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { RiskCreatedEvent } from './events/risk-created.event';
import { RiskUpdatedEvent } from './events/risk-updated.event';

@Injectable()
export class RiskService {
  constructor(
    @InjectModel(Risk.name)
    private readonly riskModel: Model<RiskDocument>,
    @InjectModel(RiskCounter.name)
    private counterModel: Model<RiskCounterDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getNextRiskId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'riskId' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

    return counter.seq;
  }

  async create(createRiskDto: CreateRiskDto, companyId: string) {
    companyId = companyId;
    const nextRiskId = await this.getNextRiskId();

    const exists = await this.riskModel.findOne({
      riskId: createRiskDto.riskId,

      isDeleted: false,
    });

    if (exists) {
      throw new ConflictException('Risk ID already exists');
    }

    const risk = await this.riskModel.create({
      ...createRiskDto,
      riskId: `RISK-${nextRiskId.toString()}`,
    });

    let current_risk: any

    current_risk = await this.riskModel.findById(risk._id).populate('projectId').populate('taskId')


    const projectManagerId = current_risk?.projectId?.managerId

    const taskAssigneeId = current_risk?.taskId?.assignedTo



    // console.log("--------------------------", projectManagerId)
    // console.log("--------------------------", taskAssigneeId)
    // console.log("--------------------------", current)

    this.eventEmitter.emit('risk.created', new RiskCreatedEvent(risk, projectManagerId, taskAssigneeId));


    return risk;
  }

  async findAll(companyId: string) {
    return this.riskModel
      .find({
        isDeleted: false,
        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string, companyId: string) {
    companyId = companyId;
    const risk = await this.riskModel

      .findById(id)

      .populate('projectId')

      .populate('taskId');

    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    return risk;
  }

  async update(
    id: string,

    updateRiskDto: UpdateRiskDto,

    companyId: string
  ) {

    companyId = companyId;
    const risk = await this.riskModel.findByIdAndUpdate(
      id,

      updateRiskDto,

      {
        returnDocument: 'after',
      },
    );

    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    this.eventEmitter.emit('risk.updated', new RiskUpdatedEvent(risk));

    return risk;
  }

  async remove(id: string, companyId: string) {
    companyId = companyId;
    const risk = await this.riskModel.findByIdAndUpdate(
      id,

      {
        isDeleted: true,
      },

      {
        returnDocument: 'after',
      },
    );

    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    return {
      success: true,

      message: 'Risk deleted successfully',
    };
  }

  async search(query: SearchRiskDto, companyId: string) {
    const {
      keyword,

      projectId,

      taskId,

      level,

      status,

      page = 1,

      limit = 10,

      sortBy = 'createdAt',

      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
      companyId: companyId
    };

    if (keyword) {
      filter.$or = [
        {
          riskId: {
            $regex: keyword,

            $options: 'i',
          },
        },

        {
          description: {
            $regex: keyword,

            $options: 'i',
          },
        },

        {
          mitigationPlan: {
            $regex: keyword,

            $options: 'i',
          },
        },
      ];
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (taskId) {
      filter.taskId = taskId;
    }

    if (level) {
      filter.level = level;
    }

    if (status) {
      filter.status = status;
    }

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const data = await this.riskModel

      .find(filter)

      .populate('projectId')

      .populate('taskId')

      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })

      .skip((currentPage - 1) * pageSize)

      .limit(pageSize);

    const total = await this.riskModel.countDocuments(filter);

    return {
      success: true,

      total,

      page: currentPage,

      limit: pageSize,

      totalPages: Math.ceil(total / pageSize),

      data,
    };
  }

  async findByProject(projectId: string, companyId: string) {
    return this.riskModel

      .find({
        projectId,

        isDeleted: false,

        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .sort({
        createdAt: -1,
      });
  }

  async findByTask(taskId: string,companyId: string) {
    return this.riskModel

      .find({
        taskId,

        isDeleted: false,

        companyId:companyId
      })

      .populate('projectId')

      .populate('taskId')

      .sort({
        createdAt: -1,
      });
  }

  async updateStatus(
    id: string,

    updateRiskDto: UpdateRiskDto,

    companyId: string
  ) {

    companyId=companyId;


    const risk = await this.riskModel.findByIdAndUpdate(
      id,

      updateRiskDto,

      {
        returnDocument: 'after',
      },
    );




    if (!risk) {
      throw new NotFoundException('Risk not found');
    }




    this.eventEmitter.emit('risk.updated', new RiskUpdatedEvent(risk));

    return risk;
  }
}
