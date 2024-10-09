import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { GroupProject } from 'src/auth/schemas/GroupProject.schema';
import { GroupProjectsProviders } from '../../../models/groupProject.providers';
import { InjectModel } from '@nestjs/mongoose';
import { GroupProjectsDto } from '../../../../auth/dto/Authorizations/groupProjects.dto';
import { BFFErrorCodes } from '../../../../common/enums/bff-error-codes.enum';
import { BFFSuccessCodes } from 'src/common/enums/bff-success-general.enum';
import { DateNow } from '../.././../../common/utils/validateDate';
@Injectable()
export class GroupProjectsService {
    private readonly logger = new Logger();
    private groupProjectsModel: Model<GroupProject>;
    constructor(
      @InjectModel(GroupProjectsProviders.name) groupProjects: Model<GroupProject>
    ) {
      this.groupProjectsModel = groupProjects;
    }
    async saveGroupProjects(body: GroupProjectsDto): Promise<any> {
        try {
          this.logger.log(`[GroupProjectsService - saveGroupProjects - ${JSON.stringify(body)}]`);
            const messageCustom: any = {};
            const formaProject = {...body, active: true, creationDate: DateNow(), updateDate: DateNow() };
            const groupProject = new this.groupProjectsModel(formaProject);
            await groupProject.save();
            this.logger.log(`[GroupProjectsService - saveGroupProjects - Save ] Ok`);
            messageCustom.message = BFFSuccessCodes.SUCCESS_GROUP_PROJECTS;
            return messageCustom;
        } catch (error) {
            this.logger.error(`[GroupProjectsService - saveGroupProjects -Error ] ${error.message}`);  
            const errorCustom: any = {};
            errorCustom.message = BFFErrorCodes.ERROR_GROUP_PROJECT_EXIST;
           throw errorCustom;
        }
    }
    async readGroupProjects(id: string): Promise<any> {
      try {
        const respo = await this.groupProjectsModel.findOne({_id: id}).exec();
        this.logger.log(`[GroupProjectsService - readGroupProjects - OK]`);
        return respo;
      } catch (error) {
          this.logger.error(`[GroupProjectsService - readGroupProjects -Error ] ${error}`);  
          const errorCustom: any = {};
          errorCustom.message = BFFErrorCodes.ERROR_READ_GROUP_PROJECT;
         throw errorCustom;
      }
  }
  async allGroupProjects(data: any): Promise<any> {
    try {
      const nameGroup: string = data.name ?? '';
      const dataAll = await this.groupProjectsModel.find({name: { $regex: nameGroup, $options: 'i'}}).exec();
      this.logger.log(`[GroupProjectsService - allGroupProjects - OK]`);
      return dataAll;
    } catch (error) {
        this.logger.error(`[GroupProjectsService - allGroupProjects - Error ] ${error}`);  
        const errorCustom: any = {};
        errorCustom.message = BFFErrorCodes.ERROR_ALL_GROUP_PROJECT;
       throw errorCustom;
    }
}
async updateGroupProjects(id: string, data: GroupProjectsDto): Promise<any> {
  try {
    const customMessage: any = {};
    const formatGroup = {...data, updateDate: DateNow()};
    const dataAll = await this.groupProjectsModel.findByIdAndUpdate(id, formatGroup).exec();
    if (dataAll) { customMessage.message = BFFSuccessCodes.SUCCESS_UPDATE_GROUP_PROJECTS; }
    return customMessage;
  } catch (error) {
      this.logger.error(`[GroupProjectsService - updateGroupProjects - Error ] ${error}`);  
      const errorCustom: any = {};
      errorCustom.message = BFFErrorCodes.ERROR_UPDATE_GROUP_PROJECT;
     throw errorCustom;
  }
}
async deleteGroupProjects(id: string): Promise<any> {
  try {
    const customMessage: any = {};
    const validActive = await this.groupProjectsModel.findOne({_id: id, active: true}).exec();
    if (validActive?.active) {
      customMessage.message = BFFErrorCodes.ERROR_DELETE_GROUP_PROJECT_ACTIVE;
      return customMessage;
    }
    this.logger.log(`[GroupProjectsService - deleteGroupProjects - OK ${JSON.stringify(validActive)}`);
    const dataAll = await this.groupProjectsModel.findByIdAndDelete(id).exec();
    if (dataAll) { customMessage.message = BFFSuccessCodes.SUCCESS_DELETE_GROUP_PROJECTS; }
    return customMessage;
  } catch (error) {
      this.logger.error(`[GroupProjectsService - deleteGroupProjects - Error ] ${error}`);  
      const errorCustom: any = {};
      errorCustom.message = BFFErrorCodes.ERROR_DELETE_GROUP_PROJECT;
     throw errorCustom;
  }
}
}