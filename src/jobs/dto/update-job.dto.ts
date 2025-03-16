import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsNumber()
  @IsOptional()
  salaryExpectation?: number;
} 