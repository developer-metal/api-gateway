import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateBulkDataUploadDto } from '../dto/create-bulk-data-upload.dto';
import { Logger } from '@nestjs/common';

const validationGeneral = async (data: any[]): Promise<boolean> => {
    try {
        const uploaderDtoArray = data.map(obj => plainToClass(CreateBulkDataUploadDto, obj));
        const validationPromises = uploaderDtoArray.map(dto => validate(dto));
        const validationResults = await Promise.all(validationPromises) as any[];
        const hasErrors = validationResults.some(errors => errors.length > 0);
        if (hasErrors) {
            validationResults.map((errors, index) => {
                if (errors.length > 0) {
                    new Logger().warn(`[validationGeneral] Error: ${index}: ${JSON.stringify(errors[0]?.constraints)}`);
                }
            });    
            return false;     
        }
        return true;
    } catch (error) {
        new Logger().error(`[validationGeneral] Error ${JSON.stringify(error)}`);
        return false;
    }
};
export default validationGeneral;
