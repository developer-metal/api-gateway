import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FormRequest, ValidationForm } from '../../../gateway/dto/form.dto';
import { GatewayService } from '../../../gateway/services/gateway/gateway.service';
import { CreateSatisfactionSurveyDto } from '../../../gateway/dto/create-satisfaction-survey.dto';

@Controller('bff-gateway')
@ApiTags('Formulario contacto')
export class GatewayController {
    private readonly logger = new Logger();
    private formGeneralService: GatewayService;
    constructor(gateway: GatewayService) {
        this.formGeneralService = gateway;
    }
    @Post()
    @ApiOperation({ summary: 'creacion de formulario', description: 'Permite registro de formulario y envio de Emails (Agradecimiento y Cuestionario de preguntas)', operationId: 'createForm' })
    async createForm(@Res() response: any,@Req() req: any, @Body() body: FormRequest): Promise<any> {
      const { headers } = req;
      this.logger.log(`[bff-controller - createForm ] Ok`);
      try {
        const { payload } = await this.formGeneralService.postCreateForm(headers, body);
        return response.status(HttpStatus.OK).send({
          code: HttpStatus.OK,
          payload
        });
      } catch (error) {
        this.logger.error(`[bff-controller - createForm ] Error ${JSON.stringify(error)}`);
        return response.status(error.response.status).send({
          time: new Date().toISOString(),
          error: {
            code: error.response.status,
            message: error.response.message
          }
        });
      }
    }
@Post('validateForm')
@ApiOperation({ summary: 'validacion formulario', description: 'Permite validacion formulario (Top Limit Form))' })
async validateForm(@Res() response: any,@Req() req: any, @Body() body: ValidationForm): Promise<any> {
  const { headers } = req;
  this.logger.log(`[bff-controller - validateForm ] Ok`);
  try {
    const { payload } = await this.formGeneralService.validateForm(headers, body);
    return response.status(HttpStatus.OK).send({
      code: HttpStatus.OK,
      payload
    });
  } catch (error) {
    this.logger.error(`[bff-controller - validateForm ] Error ${JSON.stringify(error)}`);
    return response.status(error.status).send({
      time: new Date().toISOString(),
      error: {
        code: error.status,
        message: error.message
      }
    });
  }
}
@Post('survey')//votaciones v2
@ApiOperation({ summary: 'save CES', description: 'Permite registros CES' })
async saveSurvey(@Res() response: any,@Req() req: any, @Body() body: CreateSatisfactionSurveyDto): Promise<any> {
  const { headers } = req;
  this.logger.log(`[backend - controller - saveSurvey ] Ok`);
  try {
    const { payload } = await this.formGeneralService.saveSurveyService(headers, body);
    return response.status(HttpStatus.OK).send({ payload });
  } catch (error) {
    this.logger.error(`[backend - controller - saveSurvey ] Error ${JSON.stringify(error)}`);
    return response.status(error.status).send({
      time: new Date().toISOString(),
      error: {
        code: error.status,
        message: error.message
      }
    });
  }
}
}