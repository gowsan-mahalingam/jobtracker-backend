import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobStatus } from './enums/job-status.enum';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  const mockJob = {
    id: 1,
    company: 'Test Company',
    position: 'Software Engineer',
    status: JobStatus.TO_APPLY,
    salaryExpectation: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateJobDto = {
    company: 'Test Company',
    position: 'Software Engineer',
    status: JobStatus.TO_APPLY,
    salaryExpectation: 50000,
  };

  const mockUpdateJobDto = {
    status: JobStatus.IN_PROGRESS,
    salaryExpectation: 55000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: {
            create: jest.fn().mockResolvedValue(mockJob),
            save: jest.fn().mockResolvedValue(mockJob),
            find: jest.fn().mockResolvedValue([mockJob]),
            findOne: jest.fn().mockResolvedValue(mockJob),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const result = await service.create(mockCreateJobDto);

      expect(result).toEqual(mockJob);
      expect(repository.create).toHaveBeenCalledWith(mockCreateJobDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of jobs', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockJob]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockJob);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when job is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const updatedJob = { ...mockJob, ...mockUpdateJobDto };
      jest.spyOn(repository, 'save').mockResolvedValue(updatedJob);

      const result = await service.update(1, mockUpdateJobDto);

      expect(result).toEqual(updatedJob);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalledWith(updatedJob);
    });

    it('should throw NotFoundException when job is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, mockUpdateJobDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a job', async () => {
      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when job is not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
