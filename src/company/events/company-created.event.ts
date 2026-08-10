import { CompanyDocument } from '../schemas/company.schema';

export class CompanyCreatedEvent {
  constructor(public readonly company: CompanyDocument) {}
}
