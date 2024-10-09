import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorsTokenController } from './generators-token.controller';

describe('GeneratorsTokenController', () => {
  let controller: GeneratorsTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorsTokenController]
    }).compile();

    controller = module.get<GeneratorsTokenController>(GeneratorsTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
