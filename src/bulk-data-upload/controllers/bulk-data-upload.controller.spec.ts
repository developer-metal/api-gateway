import { Test, TestingModule } from '@nestjs/testing';
import { BulkDataUploadController } from './bulk-data-upload.controller';
import { BulkDataUploadService } from '../services/bulk-data-upload.service';

describe('BulkDataUploadController', () => {
  let controller: BulkDataUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkDataUploadController],
      providers: [BulkDataUploadService]
    }).compile();

    controller = module.get<BulkDataUploadController>(BulkDataUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
