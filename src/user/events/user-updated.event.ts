import { UserDocument } from '../schemas/user.schema';

export class UserUpdatedEvent {
  constructor(public readonly user: UserDocument) {}
}
