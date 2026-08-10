import { CompanyDocument } from '../schemas/company.schema';

export class CompanyUpdatedEvent {
  constructor(public readonly company: CompanyDocument) {}
}
