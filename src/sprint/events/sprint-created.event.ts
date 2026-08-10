import { SprintDocument } from '../schemas/sprint.schema';

export class SprintCreatedEvent {
  constructor(public readonly sprint: SprintDocument) {}
}
