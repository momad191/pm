import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SearchTaskDto } from './dto/search-task.dto';

import { TaskCounter, TaskCounterDocument } from './schemas/counter.schema';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from './events/task-created.event';
import { TaskUpdatedEvent } from './events/task-updated.event';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(TaskCounter.name)
    private counterModel: Model<TaskCounterDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getNextTaskId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'taskId' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

    return counter.seq;
  }

  async create(createTaskDto: CreateTaskDto, companyId: string) {
    companyId = companyId;
    const taskId = `TASK-${await this.getNextTaskId()}`;

    const existingTask = await this.taskModel.findOne({
      taskId,
      isDeleted: false,
    });

    if (existingTask) {
      throw new ConflictException('Task ID already exists');
    }

    const cleanData: Partial<CreateTaskDto> & { taskId: string } = {
      ...createTaskDto,
      taskId,
    };

    // Remove empty assigned user
    if (!cleanData.assignedTo) {
      delete cleanData.assignedTo;
    }

    // Remove empty assigned team
    if (!cleanData.assignedToTeam) {
      delete cleanData.assignedToTeam;
    }

    const task = new this.taskModel(cleanData);

    await task.save();

    this.eventEmitter.emit('task.created', new TaskCreatedEvent(task));

    return task;
  }

  async findAll(companyId: string) {
    return this.taskModel
      .find({
        isDeleted: false,
        companyId: companyId
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .populate('assignedToTeam')
      .sort({
        createdAt: -1,
      });
  }

  async findOne(id: string, companyId: string) {
    companyId = companyId
    const task = await this.taskModel
      .findById(id)
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedToTeam')
      .populate('assignedTo', '-password');

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }


  async update(id: string, updateTaskDto: UpdateTaskDto, companyId: string) {
    const cleanData: any = { ...updateTaskDto };

    // Remove empty assigned user
    if (!cleanData.assignedTo) {
      delete cleanData.assignedTo;
    }
    // Remove empty assigned team
    if (!cleanData.assignedToTeam) {
      delete cleanData.assignedToTeam;
    }

    const task = await this.taskModel.findByIdAndUpdate(id, cleanData, {
      returnDocument: 'after',
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.eventEmitter.emit('task.updated', new TaskUpdatedEvent(task));
    return task;
  }

  // async remove(id: string) {
  //   const task = await this.taskModel.findByIdAndUpdate(
  //     id,
  //     {
  //       isDeleted: true,
  //     },
  //     {
  //       returnDocument: 'after',
  //     },
  //   );

  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }

  //   return {
  //     success: true,
  //     message: 'Task deleted successfully',
  //   };
  // }

  async remove(id: string, companyId: string): Promise<{ message: string }> {
    companyId = companyId
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid task ID');
    const deleted = await this.taskModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('task not found');
    return { message: `task ${id} deleted` };
  }

  async search(query: SearchTaskDto, companyId: string) {
    const {
      keyword,
      projectId,
      sprintId,
      assignedTo,
      assignedToTeam,
      priority,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: Record<string, unknown> = {
      isDeleted: false,
      companyId: companyId
    };

    if (keyword) {
      filter.$or = [
        {
          taskId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          title: {
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
      ];
    }

    if (projectId) {
      filter.projectId = projectId;
    }

    if (sprintId) {
      filter.sprintId = sprintId;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }
    if (assignedToTeam) {
      filter.assignedToTeam = assignedToTeam;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (status) {
      filter.status = status;
    }

    const currentPage = Number(page);

    const pageSize = Number(limit);

    const data = await this.taskModel
      .find(filter)
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .populate('assignedToTeam')
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    const total = await this.taskModel.countDocuments(filter);

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
    return this.taskModel
      .find({
        projectId,
        isDeleted: false,
        companyId: companyId
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .populate('assignedToTeam')
      .sort({
        createdAt: -1,
      });
  }

  async findBySprint(sprintId: string, companyId: string) {
    companyId = companyId;
    return this.taskModel
      .find({
        sprintId,
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .populate('assignedToTeam')
      .sort({
        createdAt: -1,
      });
  }

  async findByUser(userId: string, companyId: string) {
    companyId = companyId;
    return this.taskModel
      .find({
        assignedTo: userId,
        isDeleted: false,
      })
      .populate('projectId')
      .populate('sprintId')
      .populate('assignedTo', '-password')
      .populate('assignedToTeam')
      .sort({
        createdAt: -1,
      });
  }

  async updateStatus(id: string, updateTaskDto: UpdateTaskDto, companyId: string) {

    companyId = companyId;
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      returnDocument: 'after',
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    this.eventEmitter.emit('task.updated', new TaskUpdatedEvent(task));

    return task;
  }
}
