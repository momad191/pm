import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /**
   * Duration in days
   */
  @IsInt()
  @Min(1)
  duration: number;

  /**
   * Maximum number of users
   */
  @IsInt()
  @Min(1)
  number_of_users: number;

  /**
   * Maximum number of projects
   */
  @IsInt()
  @Min(1)
  number_of_projects: number;

  /**
   * Storage in GB
   */
  @IsNumber()
  @Min(1)
  storage: number;
}