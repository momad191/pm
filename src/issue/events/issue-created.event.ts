import { IssueDocument } from '../schemas/issue.schema';

export class IssueCreatedEvent {
  constructor(public readonly issue: IssueDocument) {}
}
