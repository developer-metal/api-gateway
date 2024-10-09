import { Test, TestingModule } from '@nestjs/testing';
import { GroupProjectsService } from './group-projects.service';

describe('GroupProjectsService', () => {
  let service: GroupProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupProjectsService]
    }).compile();

    service = module.get<GroupProjectsService>(GroupProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
