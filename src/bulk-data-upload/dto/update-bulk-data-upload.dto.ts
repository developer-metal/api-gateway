import { PartialType } from '@nestjs/swagger';
import { CreateBulkDataUploadDto } from './create-bulk-data-upload.dto';

export class UpdateBulkDataUploadDto extends PartialType(CreateBulkDataUploadDto) {}
