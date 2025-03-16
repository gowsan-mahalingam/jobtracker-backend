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
    exceptionFactory: () => new BadRequestException('L\'ID doit être un nombre entier valide')
  }))
  async findOne(@Param('id') id: number): Promise<Job> {
    try {
      const job = await this.jobsService.findOne(id);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Le job avec l'ID ${id} n'a pas été trouvé`);
      }
      throw new BadRequestException('Une erreur est survenue lors de la recherche du job');
    }
  }

  @Patch(':id')
  @UsePipes(new ParseIntPipe({ 
    errorHttpStatusCode: 400,
    exceptionFactory: () => new BadRequestException('L\'ID doit être un nombre entier valide')
  }))
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    errorHttpStatusCode: 400
  }))
  async update(
    @Param('id') id: number,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    try {
      if (Object.keys(updateJobDto).length === 0) {
        throw new BadRequestException('Aucune donnée fournie pour la mise à jour');
      }
      
      const job = await this.jobsService.update(id, updateJobDto);
      return job;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Le job avec l'ID ${id} n'a pas été trouvé`);
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Une erreur est survenue lors de la mise à jour du job');
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.jobsService.remove(id);
  }
}
