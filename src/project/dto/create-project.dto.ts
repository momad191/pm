import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsMongoId,
} from 'class-validator';

import { ProjectStatus } from '../schemas/project.schema';

export class CreateProjectDto {
  @IsMongoId()
  companyId: string;

  @IsMongoId()
  createdBy?: string;


  @IsMongoId()
  updatedBy?: string;


  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  managerId: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsEnum(['new', 'in_progress', 'completed'])
  status?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  completionPercentage?: number;

  @IsOptional()
  @IsString()
  month: string;

  @IsOptional()
  @IsString()
  year: string;
}
