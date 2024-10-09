import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Profiles } from '../../../../auth/schemas/Profiles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ProfilesProviders } from '../../../models/profiles.providers';
import { DateNow } from '../../../../common/utils/validateDate';
import { BFFSuccessCodes } from '../../../../common/enums/bff-success-general.enum';
import { BFFErrorCodes } from '../../../../common/enums/bff-error-codes.enum';
import { ProfilesDto } from '../../../../auth/dto/Users/profiles.dto';
@Injectable()
export class ProfilesService {
    private readonly logger = new Logger();
    private profileProviders: Model<Profiles>;
    constructor(
      @InjectModel(ProfilesProviders.name) profiles: Model<Profiles>
    ) {
      this.profileProviders = profiles;
    }
    async saveProfiles(body: ProfilesDto): Promise<any> {
        try {
            const messageCustom: any = {};
            const profiles = {...body, active: true, creationDate: DateNow(), updateDate: DateNow() };
            const saveProfiles = new this.profileProviders(profiles);
            await saveProfiles.save();
            this.logger.log(`[ProfilesService - saveProfiles - Save ] Ok`);
            messageCustom.message = BFFSuccessCodes.SUCCESS_PROFILES;
            return messageCustom;
        } catch (error) {
            this.logger.error(`[ProfilesService - saveProfiles -Error ] ${error}`);  
            const errorCustom: any = {};
            errorCustom.message = BFFErrorCodes.ERROR_PROFILE_EXIST;
           throw errorCustom;
        }
    }

    async getProfiles(data: ProfilesDto): Promise<any> {
        try {
            const profilesName: string = data.name ?? '';
            const dataProfiles = await this.profileProviders.find({name: { $regex: profilesName, $options: 'i'}}).exec();
            this.logger.log(`[ProfilesService - getProfiles - OK]`);
            return dataProfiles;
        } catch (error) {
            this.logger.error(`[ProfilesService - getProfiles -Error ] ${error}`);  
            const errorCustom: any = {};
            errorCustom.message = BFFErrorCodes.ERROR_GET_PROFILES;
           throw errorCustom;
        }
    }
}