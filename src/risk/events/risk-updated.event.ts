import { RiskDocument } from '../schemas/risk.schema';

export class RiskUpdatedEvent {
  constructor(public readonly risk: RiskDocument) {}
}
