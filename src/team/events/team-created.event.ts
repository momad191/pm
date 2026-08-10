import { TeamDocument } from '../schemas/team.schema';

export class TeamCreatedEvent {
  constructor(
    public readonly team: TeamDocument,
    public readonly createdBy?: string,

  ) { }
}
 