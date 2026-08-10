import { ProjectDocument } from '../schemas/project.schema';
export class ProjectUpdatedEvent {
  constructor(
    public readonly project: ProjectDocument,
    /** * Previous project manager before the update. * Useful for detecting manager changes. */
    public readonly previousManagerId?: string,
  ) {}
}
