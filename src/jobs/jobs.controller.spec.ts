import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from './enums/job-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { ParseIntPipe } from '@nestjs/common';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  const mockJob = {
    id: 1,
    company: 'Test Company',
    position: 'Software Engineer',
    status: JobStatus.TO_APPLY,
    salaryExpectation: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateJobDto: CreateJobDto = {
    company: 'Test Company',
    position: 'Software Engineer',
    status: JobStatus.TO_APPLY,
    salaryExpectation: 50000,
  };

  const mockUpdateJobDto: UpdateJobDto = {
    status: JobStatus.IN_PROGRESS,
    salaryExpectation: 55000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: {
            create: jest.fn().mockResolvedValue(mockJob),
            save: jest.fn().mockResolvedValue(mockJob),
            find: jest.fn().mockResolvedValue([mockJob]),
            findOne: jest.fn().mockResolvedValue(mockJob),
            delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockJob);

      const result = await controller.create(mockCreateJobDto);

      expect(result).toEqual(mockJob);
      expect(service.create).toHaveBeenCalledWith(mockCreateJobDto);
    });

    it('should throw BadRequestException when creation fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error());

      await expect(controller.create(mockCreateJobDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of jobs', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockJob]);

      const result = await controller.findAll();

      expect(result).toEqual([mockJob]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockJob);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockJob);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when job is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when id is invalid', async () => {
      const invalidId = 'invalid';
      const pipe = new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () => new BadRequestException('ID must be a valid integer'),
      });

      await expect(pipe.transform(invalidId, { type: 'param', data: 'id' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const updatedJob = { ...mockJob, ...mockUpdateJobDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedJob);

      const result = await controller.update(1, mockUpdateJobDto);

      expect(result).toEqual(updatedJob);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateJobDto);
    });

    it('should throw NotFoundException when job is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(1, mockUpdateJobDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when no data is provided', async () => {
      await expect(controller.update(1, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when id is invalid', async () => {
      const invalidId = 'invalid';
      const pipe = new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () => new BadRequestException('ID must be a valid integer'),
      });

      await expect(pipe.transform(invalidId, { type: 'param', data: 'id' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a job', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException when id is invalid', async () => {
      const invalidId = 'invalid';
      const pipe = new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () => new BadRequestException('ID must be a valid integer'),
      });

      await expect(pipe.transform(invalidId, { type: 'param', data: 'id' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
