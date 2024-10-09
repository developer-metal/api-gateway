import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { RecaptchaService } from './recaptcha/recaptcha.service';
@Injectable()
export class AuthService {
    private readonly httpService: HttpService;
    private readonly logger = new Logger();
    private readonly configService: ConfigService;
    private readonly recaptchaService: RecaptchaService;
    constructor(httpService: HttpService, configService: ConfigService, recaptchaService: RecaptchaService) {
        this.httpService = httpService;
        this.configService = configService;
        this.recaptchaService = recaptchaService;
    }
    async getAuth(req: any, headers: any): Promise<any> {
        try {
          const { body: { captcha } } = req;
          await this.recaptchaService.someAction(captcha);
          await this.AuthApi(req, headers);
        } catch (error) {
          this.logger.error(`'[bff - Authservice -  getAuth]: '${error}`);
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              error: error
            },
            HttpStatus.UNAUTHORIZED
          );
        }
      }
      async AuthApi(req: any, headers: any): Promise<void> {
        const host: string = this.configService.get('hostApi');
        const endpoint: string = this.configService.get('endpointCsrf');
        const apikey: string = this.configService.get('apiKey');
        this.logger.log(`'[bff - Authservice -  getAuth] Ok`);
        const headerCustom: any = { 'authorization': 'Bearer ' + apikey };
        const response = await this.httpService.axiosRef.get<AxiosResponse>(host + endpoint, { headers: headerCustom }) as any;
        const { data: { payload } } = response;  
        const customHeader = {...headers, 'csrf-token': payload, 'authorization': 'Bearer ' + apikey };
        req.headers = customHeader;
      }
}