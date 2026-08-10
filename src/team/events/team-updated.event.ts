import { TeamDocument } from '../schemas/team.schema';

export class TeamUpdatedEvent {
  constructor(public readonly team: TeamDocument,public readonly updatedBy?: string,) {}
}
