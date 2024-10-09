import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { ValidationForm } from '../../../gateway/dto/form.dto';

@Injectable()
export class GatewayService {
    private readonly httpService: HttpService;
    private readonly logger = new Logger();
    private readonly configService: ConfigService;
    constructor(httpService: HttpService, configService: ConfigService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async postCreateForm(headersCustom, body): Promise<any> {
      const host: string = this.configService.get('hostApi');
      const sendform: string = this.configService.get('endpointSendform');
        this.logger.log(`'[GatewayService -  getAuth] Ok`);
        try {
          const headCustom =  { 'user-agent': headersCustom['user-agent'], 'Content-Type': 'application/json', 'csrf-token': headersCustom['csrf-token'], 'authorization': headersCustom['authorization'] };
          const response = await this.httpService.axiosRef.post<AxiosResponse>(host + sendform, body, {headers: headCustom }) as any;
          const { data } = response;
          return data;
        } catch (error) {
          this.logger.log(`'[GatewayService - postCreateForm] Ok2 ${JSON.stringify(error)}`);
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Error al enviar formulario'
            },
            HttpStatus.BAD_REQUEST
          );
        }
      }
     async validateForm(headersCustom, body: ValidationForm): Promise<any> {
        const host: string = this.configService.get('hostApi');
        const endpoint: string = this.configService.get('endpointSendform') + '/validadtionForm';
        this.logger.log(`'[GatewayService -  validateForm] Ok`);
        try {
          const headCustom =  { 'csrf-token': headersCustom['csrf-token'], 'authorization': headersCustom['authorization'] };
          const response = await this.httpService.axiosRef.post<AxiosResponse>(host + endpoint, body, {headers: headCustom }) as any;
          const { data } = response;
          return data;
        } catch (error) {
          this.logger.log(`'[GatewayService - validateForm] Error ${JSON.stringify(error)}`);
          throw { code: 500, message: 'Error al validar formulario'}
        }
     }
  async saveSurveyService(headersCustom, body: any): Promise<any> {
      const host: string = this.configService.get('hostApi');
      const operation: string = this.configService.get('sendSurvey');
      this.logger.log(`'[GatewayService -  saveSurveyService] Ok`);
      try {
      const headCustom =  { 'csrf-token': headersCustom['csrf-token'], 'user-agent': headersCustom['user-agent'], 'Content-Type': 'application/json', 'authorization': headersCustom['authorization'] };
      const response = await this.httpService.axiosRef.post<AxiosResponse>(host + operation, body, {headers: headCustom }) as any;
        const { data } = response;
        return data;
      } catch (error) {
        this.logger.log(`'[GatewayService - saveSurveyService] Error ${JSON.stringify(error)}`);
        throw { code: 500, message: 'Error guardar survey'}
      }
   }
}