import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 400
  }))
  async create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    try {
      return await this.jobsService.create(createJobDto);
    } catch (error) {
      throw new BadRequestException('Unable to create job. Please check your data.');
    }
  }

  @Get()
  findAll(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  @UsePipes(new ParseIntPipe({ 
    errorHttpStatusCode: 400,
    exceptionFactory: () => new BadRequestException('ID must be a valid integer')
  }))
  async findOne(@Param('id') id: number): Promise<Job> {
    try {
      const job = await this.jobsService.findOne(id);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      throw new BadRequestException('An error occurred while searching for the job');
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 400
  }))
  async update(
    @Param('id', new ParseIntPipe({ 
      errorHttpStatusCode: 400,
      exceptionFactory: () => new BadRequestException('ID must be a valid integer')
    })) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    try {
      if (Object.keys(updateJobDto).length === 0) {
        throw new BadRequestException('No data provided for update');
      }
      
      const job = await this.jobsService.update(id, updateJobDto);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('An error occurred while updating the job');
    }
  }

  @Delete(':id')
  remove(@Param('id', new  ParseIntPipe({
    errorHttpStatusCode: 400,
    exceptionFactory: () => new BadRequestException('Id must be a valid integer')
  })) id: number): Promise<void> {
    return this.jobsService.remove(id);
  }
}
