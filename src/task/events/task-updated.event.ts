import { TaskDocument } from '../schemas/task.schema';

export class TaskUpdatedEvent {
  constructor(
    public readonly task: TaskDocument,
    public readonly updatedBy?: string,
  ) {}
} 
