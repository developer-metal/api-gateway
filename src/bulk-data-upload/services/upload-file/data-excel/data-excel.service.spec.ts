import { Test, TestingModule } from '@nestjs/testing';
import { DataExcelService } from './data-excel.service';

describe('DataExcelService', () => {
  let service: DataExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataExcelService]
    }).compile();

    service = module.get<DataExcelService>(DataExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
