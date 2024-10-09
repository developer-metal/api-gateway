import { Injectable, Logger } from '@nestjs/common';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackProviders } from '../../feedback/models/feedback.providers';
import { DateNow } from '../../common/utils/validateDate';
import { FeedbackErrorCode, ProductError } from '../../common/enums/error.class';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../config/config-jwt';
import { CsvExportService } from './csv-export/csv-export.service';
import { FeedbackSuccessCode } from '../../common/enums/bff-success-general.enum';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private feedbackProviders: Model<CreateFeedbackDto>;
  private jwtService: JwtService;
  private csvExportService: CsvExportService;
  constructor(@InjectModel(FeedbackProviders.name) feedback: Model<CreateFeedbackDto>,
  jwtService: JwtService, csvExportService: CsvExportService) {
    this.feedbackProviders = feedback;
    this.jwtService = jwtService;
    this.csvExportService = csvExportService;
  }
  async saveFeedbackService(requestCreateFeedback: any): Promise<any> {
   try {
      const { body, headers } = requestCreateFeedback;
      let browser: string = headers['user-agent'];
      const token_user: string = body?.token_user;
      let product_service: string = body?.product_service;
      const payload = await this.jwtService.verifyAsync(token_user, { secret: jwtConstants.secret } );
      if (!payload) { 
        this.logger.warn(`[FeedbackService - saveFeedbackService - Error Token ] ${JSON.stringify(payload)}`);
        throw new ProductError(FeedbackErrorCode.TOKEN_IVALID, 'Token invalid');}
      const responseFeedback: any = await this.feedbackProviders.findOne({ $and: [{ product_service: { $regex: product_service, $options: 'i'}, token_user: {$regex: payload?.code, $options: 'i'} }]}).exec();
      if (responseFeedback) {
        if (body?.flag === false && body?.message?.toUpperCase() === 'DELETE') {
          await this.feedbackProviders.deleteOne({token_user: payload?.code, product_service }).exec();
          this.logger.warn(`[FeedbackService - saveFeedbackService - delete ] Feedback remove.`);
          return { code: FeedbackErrorCode.DELETE_FEEDBACK_CODE, message: 'Feedback remove.' };
        }
        await this.feedbackProviders.findByIdAndUpdate({_id: responseFeedback?._id}, { $set: { ...body, token_user: payload?.code, browser_client: browser, update_date: DateNow() } });
        this.logger.warn(`[FeedbackService - saveFeedbackService - update ] Feedback already exists`);
        return { code: FeedbackSuccessCode.UPDATE_FEEDBACK_CODE, message: 'Feedback update' };
      }
      const formData: any = {...body, active: true , token_user: payload?.code, browser_client: browser, creation_date: DateNow(), update_date: DateNow()}
      const saveFeedback = new this.feedbackProviders(formData);
      saveFeedback.save();
      this.logger.log(`[FeedbackService - saveFeedbackService - Save ] Ok`);
      return { code: FeedbackSuccessCode.SUCCESS_FEEDBACK_CODE, message: 'Feedback Success' };
   } catch(error) {
    this.logger.error(`[FeedbackService - saveFeedbackService - Error ] ${JSON.stringify(error)}`);
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError') {
      throw new ProductError(FeedbackErrorCode.TOKEN_IVALID, 'Token invalid');
    }
    throw error;
   }
  }
  async exportCsv(body: any, params: any): Promise<any> {
    const responseAll = await this.findAllFeedbackServices(body);
      const exportData: any = params?.export;
      if (params.hasOwnProperty('export') && exportData?.toUpperCase() === 'CSV') {
        this.logger.log(`[FeedbackService - exportCsv - OK`);
        const responseExport = await this.csvExportService.exportCsv(responseAll); 
        if (!responseExport) {
          throw new ProductError(FeedbackErrorCode.ERROR_CSV_EXPORT, 'Error al exportar el archivo CSV.');
        }
        return responseExport;
     }
     return responseAll;
  }
  async findAllFeedbackServices(body: any): Promise<any> {
    let $regex: object = {};
    let creation_date: object = {};
    const queryCustom: Array<object> = [];
    if (body.hasOwnProperty('product_service')) {
      $regex = body.product_service;
      queryCustom.push({ product_service: { $regex, $options: 'i' } });
    }
    if (body.hasOwnProperty('date_start') && body.hasOwnProperty('date_end')){
      creation_date = {
        $gte: body.date_start,
        $lte: body.date_end
      };
      queryCustom.push({ creation_date });
    }
    const { date_start, date_end, ...restNew } = body;
    for (const key in restNew) {
      $regex = body[key];
      queryCustom.push({ [key]: { $regex, $options: 'i' } });
    }
   
    if (queryCustom.length === 0) {
      const response  = await this.feedbackProviders.find().exec();
      const responseFormat = this.groupProductCount(response);
        if (response.length === 0) {
          throw new Error('No se encontraron resultados asociados a la busqueda.');
        }
      return responseFormat;
    }
    this.logger.log(`[FeedbackService - findAllFeedbackServices ] OK`);
    const responseCustom = await this.feedbackProviders.find({ $and: queryCustom }).exec();
    const responseFormat = this.groupProductCount(responseCustom);
    if (responseCustom.length === 0) {
      throw new Error('No se encontraron resultados asociados a la busqueda.');
    }
    return responseFormat;
  }
  groupProductCount = (data: any): any => {
    let responseFormat = data.map((item: any) => ({
      product_service: item.product_service,
      count_like: data.filter((itemFilter: any) => itemFilter.product_service == item.product_service && itemFilter.flag).length,
      count_dislike: data.filter((itemFilter: any) => itemFilter.product_service == item.product_service && !itemFilter.flag).length,
      count_total: data.filter((itemFilter: any) => itemFilter.product_service == item.product_service).length,
      messages_dislike: this.calcularPorcentajePorMensaje(data, item),
      creation_date: item.creation_date,
      update_date: item.update_date
    }));
   return this.removeDuplicates(responseFormat);
  }
 removeDuplicates(responseFormat) {
    const uniqueItems: Array<any> = [];
    const seen: any = new Set();
    responseFormat.forEach((item) => {
        if (!seen.has(item.product_service)) {
            seen.add(item.product_service);
            uniqueItems.push(item);
        }
    });
    return uniqueItems;
}
calcularPorcentajePorMensaje(data: any,item: any) {
  const filterData: any = data.filter((itemFilter: any) => itemFilter.product_service == item.product_service && itemFilter.message != 'N/A');
  const messagesCount: { [key: string]: number } = {};
  filterData.forEach((itemFilter: any) => {
      if (messagesCount[itemFilter.message]) {
          messagesCount[itemFilter.message]++;
      } else {
          messagesCount[itemFilter.message] = 1;
      }
  });
  const totalMessages = filterData.length;
  const percentages: { [key: string]: string } = {};
  for (const message in messagesCount) {
      const percentage = Math.round((messagesCount[message] * 100) / totalMessages);
      percentages[message] = percentage.toString() + '%';
  }
  return percentages;
}
}