import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DateNow } from '../../../common/utils/validateDate';
import { v4 as uuidv4 } from 'uuid';
import { GenerateToken } from '../../../common/enums/bff-success-general.enum';
@Injectable()
export class GeneratorsTokenService {
    private readonly logger = new Logger();
    private jwtService: JwtService
    constructor(jwtService: JwtService) {
        this.jwtService = jwtService;
    }
async GeneratorsTokenService(): Promise<any> {
    try {
        let generatorId: string = uuidv4();
        this.logger.log(`[GeneratorsTokenService - GET ] Ok`);
        const payload = { code: generatorId, date_generate:  DateNow() };
        const access_token = await this.jwtService.signAsync(payload);
        const dataToken = { code: GenerateToken.SUCCESS_GENERATE_TOKEN, token: access_token };
        return dataToken;
    } catch(error) {
         this.logger.error(`[GeneratorsTokenService -Error ] ${error}`);
         throw error;
        }
    }
}