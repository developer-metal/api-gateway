import { Test, TestingModule } from '@nestjs/testing';
import { BulkDataUploadService } from './bulk-data-upload.service';

describe('BulkDataUploadService', () => {
  let service: BulkDataUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkDataUploadService]
    }).compile();

    service = module.get<BulkDataUploadService>(BulkDataUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
