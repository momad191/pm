import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsMongoId,
} from 'class-validator';

import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsMongoId()
  companyId: string;


  @IsMongoId()
  createdBy?: string;


  @IsMongoId()
  updatedBy?: string;

  @IsString()
  teamId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
