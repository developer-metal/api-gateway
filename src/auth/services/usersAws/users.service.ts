import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CognitoUser, CognitoUserAttribute, CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AuthRegisterUserDto } from '../../dto/Users/auth-register-user';
import { ConfirmRegisterDto, ResendConfirmRegisterDto } from '../../dto/Users/confirm-register.dto';
import { AuthLoginUserDto } from '../../dto/Users/auth-login-user.dto';
import { BFFErrorCodes } from '../../../common/enums/bff-error-codes.enum';
import { BFFSuccessCodes } from '../../../common/enums/bff-success-general.enum';
import { UsersLocalsService } from '../users-locals/users-locals.service';
import { ChangePasswordDto } from '../../../auth/dto/Users/change-password.dto';
@Injectable()
export class UsersService {
    private readonly userPool: CognitoUserPool;
    private readonly logger = new Logger();
    private UsersLocalsService: UsersLocalsService;
    constructor(_usersLocalsService: UsersLocalsService) {
      this.UsersLocalsService = _usersLocalsService;
    this.userPool = new CognitoUserPool({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID
      });
    }
    async registerUser(authRegisterUserDto: AuthRegisterUserDto ) {
        const { name, email, password } = authRegisterUserDto;
        const errorCustom: any = {};
        const attributeList = [ new CognitoUserAttribute({Name: 'name', Value: name}), new CognitoUserAttribute({Name: 'email', Value: email}) ];
        return new Promise((resolve, reject) => {
          this.userPool.signUp(email, password, attributeList, null,async (err: any, result: any) => {
              if (!result || err) {
                errorCustom.message = err.code === 'UsernameExistsException' ? BFFErrorCodes.USER_ALREADY_REGISTERED : BFFErrorCodes.USER_ERROR_REGISTER;
                this.logger.log(`[UsersService - registerUser ] Error: ${JSON.stringify(result)}`);
                reject(errorCustom);
              } else {
                try {
                await this.UsersLocalsService.saveUsersLocals(authRegisterUserDto);
                this.logger.log(`[UsersService - registerUser ] Ok`);
                resolve(result.user);
                } catch (error) {
                  this.logger.log(`[UsersService - registerUser - local ]: ${JSON.stringify(error)}`);
                  throw new HttpException(
                    {
                      status: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: error.message
                    },
                    HttpStatus.BAD_REQUEST
                  );
                }
              }
            }
          );
        });   
      }
    async confirmRegister(data: ConfirmRegisterDto) {
        const {username, code} = data
        const dataUser = new CognitoUser({Username: username, Pool: this.userPool });
        const errorCustom: any = {};
        const messageCustom: any = {};
        return new Promise((resolve, reject) => {
          dataUser.confirmRegistration(code, true,async (err, result) => {
                    if (!result) {
                        errorCustom.message = err.code === 'ExpiredCodeException' ? BFFErrorCodes.EXPIRATE_CODE_PROVIDED : BFFErrorCodes.USER_ERROR_REGISTER;
                        this.logger.log(`[UsersService - confirmRegister ] Error: ${JSON.stringify(result)}`);
                        reject(errorCustom);
                    } else {
                        messageCustom.message = 'Usuario Activado correctamente.';
                        this.logger.log(`[UsersService - confirmRegister ] Ok`);
                        await this.UsersLocalsService.updateUsersLocals(username);
                        resolve(messageCustom);
                    }
                }
            );
        });
    }
    async resendConfirmationCode(data: ResendConfirmRegisterDto) {
      const {username } = data;
      const dataUser = new CognitoUser({Username: username, Pool: this.userPool });
      return new Promise((resolve, reject) => {
        dataUser.resendConfirmationCode(async (err, result) => {
                  if (!result || err) {
                      this.logger.log(`[UsersService - resendConfirmationCode ] Error: ${JSON.stringify(result)}`);
                      reject(result);
                  } else {
                    this.logger.log(`[UsersService - resendConfirmationCode ] OK: ${result}`);
                      resolve(result);
                  }
              }
          );
      });
  }
    async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
        const { email, password } = authLoginUserDto;
        const userData = { Username: email, Pool: this.userPool};
        const authenticationDetails = new AuthenticationDetails({ Username: email, Password: password });
        const userCognito = new CognitoUser(userData);
        const errorCustom: any = {};
        return new Promise((resolve, reject) => {
          userCognito.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {    
              const { name, email_verified, exp, email } = result.getIdToken().decodePayload();
           resolve({
                accessToken: result.getAccessToken().getJwtToken(),
                refreshToken: result.getRefreshToken().getToken(),
                dataUser: {
                  name_person: name,
                  email_verified: email_verified,
                  exp: exp,
                  username: email
                }
              });
            },
            onFailure: (err) => {
                errorCustom.message = err.code === 'NotAuthorizedException' ? BFFErrorCodes.USER_NOT_AUTHORIZE : BFFErrorCodes.ERROR_LOGIN_USER;
                this.logger.log(`[UsersService - authenticateUser ] Error: ${JSON.stringify(err)}`);
              reject(errorCustom);
            }
          });
        });
      }
      async sessionSingOut(data: ResendConfirmRegisterDto) {
        const errorCustom: any = {};
        const sussesCustom: any = {};
        return new Promise((resolve, reject) => {
          try {
            const { username } = data;
            const userData = { Username: username, Pool: this.userPool};
            const userCognito = new CognitoUser(userData);
            userCognito.signOut();
              if (userCognito !== null) {
                sussesCustom.message = BFFSuccessCodes.SUCCESS_SIGN_OUT;
                this.logger.log(`[UsersService - sessionSingOut ] Ok`);
                  resolve(sussesCustom);
              }
          } catch (error) {
            errorCustom.message = BFFErrorCodes.ERROR_SIGN_OUT;
            this.logger.log(`[UsersService - sessionSingOut ] Error: ${JSON.stringify(error)}`);
              reject(errorCustom);
          }
        });
      }
      async forgotPassword(data: ResendConfirmRegisterDto) {
        const dataUser = new CognitoUser({Username: data.username, Pool: this.userPool });
        return new Promise((resolve, reject) => {
          dataUser.forgotPassword({
                  onSuccess: (result) => {
                    this.logger.log(`[UsersService - forgotPassword ] sendcode ${JSON.stringify(result)} `);
                      resolve(result);
                  },
                  onFailure: (err) => {
                    this.logger.log(`[UsersService - forgotPassword ] Error ${JSON.stringify(err)} `);
                    reject(err);
                  }
                });
        });
      }
      async validationCodeAndPassword(data: ChangePasswordDto) {
        const {verificationCode, username, password } = data;
        const errorCustom: any = {};
        const dataUser= new CognitoUser({Username: username, Pool: this.userPool });
        return new Promise((resolve, reject) => {
          dataUser.confirmPassword(verificationCode, password, {
            onSuccess: () => {
              this.logger.log(`[UsersService - validationCodeAndPassword ] Ok`);
              resolve('Password actualizado correctamente.');
            },
            onFailure: (err: any) => {
              this.logger.log(`[UsersService - validationCodeAndPassword ] Error ${JSON.stringify(err)}`);
              let errorMessage: string;
              if (err?.code === 'CodeMismatchException') {
                errorMessage = BFFErrorCodes.ERROR_CHANGE_PASSWORD_CODE;
              } else if (err?.code === 'LimitExceededException') {
                errorMessage = BFFErrorCodes.EXPIRATE_CODE_PROVIDED;
              } else {
                errorMessage = err;
              }
              errorCustom.message = errorMessage;
              reject(errorCustom);
            }
          });
        });
      }
}