import { TaskDocument } from '../schemas/task.schema';

export class TaskCreatedEvent {
  constructor(public readonly task: TaskDocument) {}
}
