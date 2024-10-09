import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthRegisterUserDto } from '../../../auth/dto/Users/auth-register-user';
import { InjectModel } from '@nestjs/mongoose';
import { UsersLocalsProviders } from '../../models/usersLocals.providers';
import { Users } from 'src/auth/schemas/UsersLocals.schema';
import { DateNow } from 'src/common/utils/validateDate';
import { ObjectIdConstructor, castinIdObject } from 'src/common/type/objectId.type';

@Injectable()
export class UsersLocalsService {
    private readonly logger = new Logger();
    private usersLocalModel: Model<Users>;
    constructor(
      @InjectModel(UsersLocalsProviders.name) usersLocalsModel: Model<Users>
    ) {
      this.usersLocalModel = usersLocalsModel;
    }
  async saveUsersLocals(body: any): Promise<any> {
    try {
        const { privileges, access_general } = body;
        const accesGeneral: any = castinIdObject(access_general);
        const dataId = privileges.map((item: any) => ({
          accessLevel: castinIdObject(item.accessLevel),
          groupKey: castinIdObject(item.groupKey)
        }));
      const userActive: any = { ...body, access_general: accesGeneral, privileges: dataId, active: false, creationDate: DateNow(), updateDate: DateNow() };
      const user = new this.usersLocalModel(userActive);
      const result = await user.save();
      this.logger.log(`[UsersLocalsService - saveUsersLocals - Save ] Ok`);
      return result;
    } catch (error) {
        this.logger.error(`[UsersLocalsService - saveUsersLocals -Error ] ${error.message}`);  
        throw new Error('Error al crear el usuario.');
    }
  }
  async updateUsersLocals(username: string): Promise<any> {
    try {
        const response = { message: 'Usuario local Activado.' };
        await this.usersLocalModel.updateOne({ email: username }, { active: true, updateDate: DateNow() }).exec();
        this.logger.log(`[UsersLocalsService - updateUsersLocals - Update ] Ok`);
        return response;
    } catch (error) {
        this.logger.error(`[UsersLocalsService - updateUsersLocals - Error ] ${error.message}`);  
        throw new Error(error);
    }
  }
}