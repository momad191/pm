import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

import { Company, CompanySchema } from './schemas/company.schema';

import { CompanyCounter, CompanyCounterSchema } from './schemas/counter.schema';

import { User, UserSchema } from '../user/schemas/user.schema';

import { EmailModule } from '../email/email.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: CompanyCounter.name, schema: CompanyCounterSchema },
      {name: User.name,schema: UserSchema},
    ]),
    EmailModule,
  ],

  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule { }
