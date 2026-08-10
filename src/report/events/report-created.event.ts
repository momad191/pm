import { ReportDocument } from '../schemas/report.schema';

export class ReportCreatedEvent {
  constructor(public readonly report: ReportDocument) {}
}
