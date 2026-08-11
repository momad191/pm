import { IsMongoId, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsMongoId()
  projectId: string;

  @IsMongoId()
  createdBy?: string;

  @IsMongoId()
  updatedBy?: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  generatedBy: string;
}
