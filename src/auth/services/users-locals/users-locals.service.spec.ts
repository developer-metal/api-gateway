import { Test, TestingModule } from '@nestjs/testing';
import { UsersLocalsService } from './users-locals.service';

describe('UsersLocalsService', () => {
  let service: UsersLocalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLocalsService]
    }).compile();

    service = module.get<UsersLocalsService>(UsersLocalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
