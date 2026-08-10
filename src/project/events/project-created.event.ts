import { ProjectDocument } from '../schemas/project.schema';

export class ProjectCreatedEvent {
  constructor(public readonly project: ProjectDocument) {}
}
