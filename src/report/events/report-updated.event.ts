import { ReportDocument } from '../schemas/report.schema';

export class ReportUpdatedEvent {
  constructor(public readonly previousReport: ReportDocument) {}
}
