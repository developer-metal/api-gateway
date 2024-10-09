import { plainToClass } from "class-transformer";
import { CreateFeedbackDto } from "../dto/create-feedback.dto";
import { validate } from "class-validator";
import { Logger } from "@nestjs/common";
const validationGeneral = async (data: any): Promise<boolean> => {
const createFeedbackDto = plainToClass(CreateFeedbackDto, data?.body);
const errors = await validate(createFeedbackDto);
    if (errors.length > 0) {
     new Logger().debug(`[validationGeneral] Error: ${JSON.stringify(errors[0]?.constraints)}`);
    return false
    }
    return true;
}
export default validationGeneral;

