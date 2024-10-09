import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorsTokenService } from './generators-token.service';

describe('GeneratorsTokenService', () => {
  let service: GeneratorsTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorsTokenService]
    }).compile();

    service = module.get<GeneratorsTokenService>(GeneratorsTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
