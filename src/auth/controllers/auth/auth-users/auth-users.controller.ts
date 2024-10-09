import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { AuthRegisterUserDto } from './../../../dto/Users/auth-register-user';
import { UsersService } from '../../../services/usersAws/users.service';
import { ConfirmRegisterDto, ResendConfirmRegisterDto } from '../../../dto/Users/confirm-register.dto';
import { AuthLoginUserDto } from '../../../dto/Users/auth-login-user.dto';
import { ChangePasswordDto } from '../../../../auth/dto/Users/change-password.dto';
import { GroupProjectsService } from '../../../../auth/services/users-locals/group-projects/group-projects.service';
import { GroupProjectsDto } from '../../../../auth/dto/Authorizations/groupProjects.dto';
import { ProfilesDto } from '../../../../auth/dto/Users/profiles.dto';
import { ProfilesService } from '../../../../auth/services/users-locals/profiles/profiles.service';
@Controller('auth-users')
export class AuthUsersController {
    private readonly logger = new Logger();
    private _usersService: UsersService;
    private _groupProjectsService: GroupProjectsService;
    private _profilesServices: ProfilesService;
        constructor(_usersService: UsersService, _groupProjectsService: GroupProjectsService, _profilesService: ProfilesService) {
            this._usersService = _usersService;
            this._groupProjectsService = _groupProjectsService;
            this._profilesServices = _profilesService;
    }
@Post('/register')
    async register(@Res() response, @Body() authRegisterUserDto: AuthRegisterUserDto) {
    try { 
    const payload = await this._usersService.registerUser(authRegisterUserDto);
    this.logger.log(`[controller - auth-users - register ] Ok`);
    return response.status(HttpStatus.CREATED).send({
        code: HttpStatus.CREATED,
        payload
    });
    } catch(error) {
        this.logger.error(`[controller - auth-users - register] Error: ${JSON.stringify(error)}`);
          return response.status(500).send({
            error: {
              code: error.message
            }
          });
    }
}
@Post('/confirmation-register')
    async confirmation(@Res() response, @Body() data: ConfirmRegisterDto) {
        try { 
            const payload =  await this._usersService.confirmRegister(data);
            this.logger.log(`[controller - auth-users - confirmation-register ] Ok`);
            return response.status(HttpStatus.OK).send({
                code: HttpStatus.OK,
                payload
            });
        } catch(error) {
            this.logger.error(`[controller - auth-users - confirmation-register] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Post('/resend-confirmation')
    async resendConfirmation(@Res() response, @Body() data: ResendConfirmRegisterDto) {
        try { 
            const payload =  await this._usersService.resendConfirmationCode(data);
            this.logger.log(`[controller - auth-users - resendConfirmation ] Ok`);
            return response.status(HttpStatus.OK).send({
                code: HttpStatus.OK,
                payload
            });
        } catch(error) {
            this.logger.error(`[controller - auth-users - resendConfirmation] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
  @Post('/send-code')
  async forgotPassword(@Res() response, @Body() data: ResendConfirmRegisterDto) {
      try { 
          const payload =  await this._usersService.forgotPassword(data);
          this.logger.log(`[controller - auth-users - forgotPassword ] Ok`);
          return response.status(HttpStatus.OK).send({
              code: HttpStatus.OK,
              payload
          });
      } catch(error) {
          this.logger.error(`[controller - auth-users - forgotPassword] Error: ${JSON.stringify(error)}`);
          return response.status(500).send({
            error: {
              code: error.message
            }
          });
      }
  }
  @Post('/validation-code-password')
  async validationCodeAndPassword(@Res() response, @Body() data: ChangePasswordDto) {
      try { 
          const payload = await this._usersService.validationCodeAndPassword(data);
          this.logger.log(`[controller - auth-users - validationCodeAndPassword ] Ok`);
          return response.status(HttpStatus.OK).send({
              code: HttpStatus.OK,
              payload
          });
      } catch(error) {
          this.logger.error(`[controller - auth-users - validationCodeAndPassword] Error: ${JSON.stringify(error)}`);
          return response.status(500).send({
            error: {
              code: error.message
            }
          });
      }
  }
@Post('/login')
    async login(@Res() response, @Body() authLoginUserDto: AuthLoginUserDto) {
        try { 
         const payload = await this._usersService.authenticateUser(authLoginUserDto);
        this.logger.log(`[controller - auth-users - login ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload
        });
        } catch(error) {
            this.logger.error(`[controller - auth-users - login] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Post('/sign-out')
    async signOut(@Res() response, @Body() data: ResendConfirmRegisterDto) {
        try { 
        const  {message }: any = await this._usersService.sessionSingOut(data);
        this.logger.log(`[controller - sign-out - login ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload: message
        });
        } catch(error) {
            this.logger.error(`[controller - sign-out - login] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Post('/group-projects')
    async saveGroupProjects(@Res() response, @Body() data: GroupProjectsDto) {
        try { 
          this.logger.log(`[controller - saveGroupProjects - authorizations ] ${JSON.stringify(data)}`);
        const  { message }: any = await this._groupProjectsService.saveGroupProjects(data);
        this.logger.log(`[controller - saveGroupProjects - authorizations ] Ok`);
        return response.status(HttpStatus.CREATED).send({
            code: HttpStatus.OK,
            payload: message
        });
        } catch(error) {
            this.logger.error(`[controller - saveGroupProjects - authorizations] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }

    @Get(':id')
    async readGroupProjects(@Res() response, @Param('id') id:  string) {
        try { 
          this.logger.log(`[controller - readGroupProjects - authorizations ] ${JSON.stringify(id)}`);
        const responseData: any = await this._groupProjectsService.readGroupProjects(id);
        this.logger.log(`[controller - readGroupProjects - authorizations ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload: responseData
        });
        } catch(error) {
            this.logger.error(`[controller - readGroupProjects - authorizations] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }

    @Post('/all-group-projects')
    async allGroupProjects(@Res() response, @Query() data:  any) {
        try { 
          this.logger.log(`[controller - allGroupProjects - authorizations ] ${JSON.stringify(data)}`);
        const responseData: any = await this._groupProjectsService.allGroupProjects(data);
        this.logger.log(`[controller - allGroupProjects - authorizations ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload: responseData
        });
        } catch(error) {
            this.logger.error(`[controller - allGroupProjects - authorizations] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Patch(':id')
    async updateGroupProjects(@Res() response, @Param('id') id: any, @Body() data: any) {
        try {
        const responseUpdate: any = await this._groupProjectsService.updateGroupProjects(id, data);
        this.logger.log(`[controller - updateGroupProjects - authorizations ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload: responseUpdate
        });
        } catch(error) {
            this.logger.error(`[controller - updateGroupProjects - authorizations] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Delete(':id')
    async deleteGroupProjects(@Res() response, @Param('id') id: any) {
        try {
        const responseDelete: any = await this._groupProjectsService.deleteGroupProjects(id);
        this.logger.log(`[controller - deleteGroupProjects - authorizations ] Ok`);
        return response.status(HttpStatus.OK).send({
            code: HttpStatus.OK,
            payload: responseDelete
        });
        } catch(error) {
            this.logger.error(`[controller - deleteGroupProjects - authorizations] Error: ${JSON.stringify(error)}`);
            return response.status(500).send({
              error: {
                code: error.message
              }
            });
        }
    }
    @Post('/profile-create')
    async profileCreate(@Res() response, @Body() body: ProfilesDto) {
    try { 
    const payload = await this._profilesServices.saveProfiles(body);
    this.logger.log(`[controller - auth-users - profileCreate ] Ok`);
    return response.status(HttpStatus.CREATED).send({
        code: HttpStatus.CREATED,
        payload
    });
    } catch(error) {
        this.logger.error(`[controller - auth-users - profileCreate] Error: ${JSON.stringify(error)}`);
          return response.status(500).send({
            error: {
              code: error.message
            }
          });
    }
}
@Post('/profile-all')
async getProfiles(@Res() response, @Query() data:  any) {
try { 
const payload = await this._profilesServices.getProfiles(data);
this.logger.log(`[controller - auth-users - getProfiles ] Ok`);
return response.status(HttpStatus.OK).send({
    code: HttpStatus.OK,
    payload
});
} catch(error) {
    this.logger.error(`[controller - auth-users - getProfiles] Error: ${JSON.stringify(error)}`);
      return response.status(500).send({
        error: {
          code: error.message
        }
      });
}
}
}