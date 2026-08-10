import { IssueDocument } from '../schemas/issue.schema';

export class IssueUpdatedEvent {
  constructor(
    public readonly issue: IssueDocument,
    /** * Previous issue details before the update. * Useful for detecting changes. */
    // public readonly previousIssue: IssueDocument,
  ) {}
}
