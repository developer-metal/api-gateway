import { BuldataUploadSchema } from '../schemas/bulk-data.schema';

export const BulkDataProviders = {
  name: 'BuldataUpload',
  useFactory: () => BuldataUploadSchema
};
