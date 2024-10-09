import { Module } from '@nestjs/common';
import { BulkDataUploadService } from './services/bulk-data-upload.service';
import { BulkDataUploadController } from './controllers/bulk-data-upload.controller';
import { DataExcelService } from './services/upload-file/data-excel/data-excel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BulkDataProviders } from './models/bulk-data.providers';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([BulkDataProviders])
  ],
  controllers: [BulkDataUploadController],
  providers: [BulkDataUploadService, DataExcelService]
})
export class BulkDataUploadModule {}
