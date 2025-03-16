import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export class CreateJobDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @IsNumber()
  @IsOptional()
  salaryExpectation?: number;
} 