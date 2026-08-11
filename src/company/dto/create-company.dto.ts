import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  IsMongoId
} from 'class-validator';

import { CompanyStatus } from '../schemas/company.schema';

export class CreateCompanyDto {

  @IsMongoId()
  createdBy?: string;


  @IsMongoId()
  updatedBy?: string;


  @IsString()
  @MinLength(2)
  @MaxLength(50)
  companyId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(150)
  companyName: string;


  @IsString()
  @MaxLength(500)
  legalName?: string;


  @IsString()
  @MaxLength(500)
  managerFirstName?: string;


  @IsString()
  @MaxLength(500)
  managerLastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  currency?: string;

  @IsOptional()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  commercialRegistration?: string;
}
