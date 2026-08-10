import { RiskDocument } from '../schemas/risk.schema';

export class RiskCreatedEvent {
  constructor(public readonly risk: RiskDocument) {}
}
