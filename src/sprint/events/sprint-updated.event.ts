import { SprintDocument } from '../schemas/sprint.schema';

export class SprintUpdatedEvent {
  constructor(public readonly sprint: SprintDocument) {}
}
