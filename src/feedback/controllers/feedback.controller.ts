import { Controller, Get, Post, Res, Logger, HttpStatus, Req, Body, Query } from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { FeedbackErrorCode } from '../../common/enums/error.class';
import validationGeneral from '../validations/validation-general';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger();
  private readonly feedbackService: FeedbackService;
  constructor(_feedbackService: FeedbackService) {
    this.feedbackService = _feedbackService;
  }
  @Post()
  @ApiOperation({ summary: 'save feedbak', description: 'Permite el registro de feedbak', operationId: 'saveFeedback' })  
  async saveFeedback(@Req() request: Request, @Res() response: any) {
    try {
      this.logger.log(`[controller - createFeedback ] OK`);
      if (await validationGeneral(request) === false) {
        return response.status(HttpStatus.BAD_REQUEST).send({ code: 400, messages: FeedbackErrorCode.ERROR_VALIDATION_FIELD});
      }
      const responsePayload = await this.feedbackService.saveFeedbackService(request);
      return response.status(HttpStatus.OK).send({payload: responsePayload});
    } catch(error) {
    this.logger.error(`[controller - createFeedback ] Error ${JSON.stringify(error)}`);
    return response.status(500).send({
      code: error.code,
      error: {
        message: error.message
      }
    });
  }
  }
  @Get()
  @ApiOperation({ summary: 'findAll feedbak', description: 'Permite la consulta de feedbak', operationId: 'findAllFeedback' })  
  async findAllFeedback(@Res() response: any, @Body() body: any, @Query() params: any){
    try {
        this.logger.log(`[controller - findAllFeedback ] OK `);
        const formaData: string = params?.export;
      if (params.hasOwnProperty('export') && formaData.toUpperCase() === 'CSV') {
        response.header('Content-Type', 'text/csv');
        response.header('Content-Disposition', 'attachment; filename=feedback.csv');
        const responseExport = await this.feedbackService.exportCsv(body, params);
        return response.type('text/csv').send(fs.readFileSync(responseExport));
      }
      const responseAll = await this.feedbackService.findAllFeedbackServices(body);
      return response.status(HttpStatus.OK).send({payload: responseAll});
    } catch(error) {
    this.logger.error(`[controller - findAllFeedback ] Error ${JSON.stringify(error)}`);
    return response.status(500).send({
      code: error.code,
      error: {
        message: error.message
      }
    });
  }
  }
}