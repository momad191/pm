import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Issue, IssueDocument, IssueStatus } from './schemas/issue.schema';

import { CreateIssueDto } from './dto/create-issue.dto';

import { UpdateIssueDto } from './dto/update-issue.dto';

import { SearchIssueDto } from './dto/search-issue.dto';

import { IssueCounter, IssueCounterDocument } from './schemas/counter.schema';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { IssueCreatedEvent } from './events/issue-created.event';
import { IssueUpdatedEvent } from './events/issue-updated.event';

@Injectable()
export class IssueService {
  constructor(
    @InjectModel(Issue.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(IssueCounter.name)
    private readonly counterModel: Model<IssueCounterDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getNextIssueId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'issueId' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

    return counter.seq;
  }

  async create(createIssueDto: CreateIssueDto, companyId: string) {
    companyId = companyId;
    const nextIssueId = await this.getNextIssueId();

    const issue = await this.issueModel.create({
      ...createIssueDto,
      issueId: `ISSUE-${nextIssueId.toString()}`,
    });

    this.eventEmitter.emit('issue.created', new IssueCreatedEvent(issue));

    return issue;
  }

  async findAll(companyId: string) {
    return this.issueModel
      .find({
        isDeleted: false,
        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password')

      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string, companyId: string) {

    companyId = companyId;

    const issue = await this.issueModel

      .findById(id)

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password');

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    return issue;
  }

  async update(
    id: string,
    updateIssueDto: UpdateIssueDto,
    companyId: string
  ) {
    companyId = companyId;
    const issue = await this.issueModel.findByIdAndUpdate(
      id,

      updateIssueDto,

      {
        returnDocument: 'after',
      },
    );

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    this.eventEmitter.emit('issue.updated', new IssueUpdatedEvent(issue));

    return issue;
  }

  async remove(id: string, companyId: string) {
    companyId = companyId;
    const issue = await this.issueModel.findByIdAndUpdate(
      id,

      {
        isDeleted: true,
      },

      {
        returnDocument: 'after',
      },
    );

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    return {
      success: true,

      message: 'Issue deleted successfully',
    };
  }

  async search(query: SearchIssueDto, companyId: string) {
    const {
      keyword,

      projectId,

      taskId,

      assignedTo,

      status,

      severity,

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
          issueId: {
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
          resolutionNotes: {
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

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (status) {
      filter.status = status;
    }

    if (severity) {
      filter.severity = severity;
    }

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const data = await this.issueModel

      .find(filter)

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password')

      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })

      .skip((currentPage - 1) * pageSize)

      .limit(pageSize);

    const total = await this.issueModel.countDocuments(filter);

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
    return this.issueModel
      .find({
        projectId,

        isDeleted: false,
        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password')

      .sort({
        createdAt: -1,
      });
  }

  async findByTask(taskId: string, companyId: string) {
    return this.issueModel
      .find({
        taskId,

        isDeleted: false,

        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password')

      .sort({
        createdAt: -1,
      });
  }

  async findByUser(userId: string, companyId: string) {
    return this.issueModel
      .find({
        assignedTo: userId,

        isDeleted: false,

        companyId: companyId
      })

      .populate('projectId')

      .populate('taskId')

      .populate('assignedTo', '-password')

      .populate('reportedBy', '-password')

      .sort({
        createdAt: -1,
      });
  }

  async updateStatus(
    id: string,

    status: string,

    companyId: string
  ) {

    companyId=companyId;
    const issue = await this.issueModel.findById(id);

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    issue.status = status as IssueStatus;

    if (status === 'RESOLVED') {
      issue.resolvedAt = new Date();
    }

    if (status === 'CLOSED') {
      issue.closedAt = new Date();
    }

    await issue.save();

    return issue;
  }
}
