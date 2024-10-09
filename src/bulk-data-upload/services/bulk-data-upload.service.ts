import { Injectable, Logger } from '@nestjs/common';
import { DataExcelService } from './upload-file/data-excel/data-excel.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BulkDataProviders } from '../models/bulk-data.providers';
import { DateNow } from 'src/common/utils/validateDate';
import { CreateBulkDataUploadDto } from '../dto/create-bulk-data-upload.dto';
import validationGeneral from '../validations/validation-general';
import { FeedbackErrorCode, ProductError } from '../../common/enums/error.class';
import { UpdateBulkDataUploadDto } from '../dto/update-bulk-data-upload.dto';
@Injectable()
export class BulkDataUploadService {
  private readonly logger = new Logger(BulkDataUploadService.name);
  private readonly _dataExcelService: DataExcelService;
  private excelModel : Model<any>;
  constructor(@InjectModel(BulkDataProviders.name) excelModel: Model<CreateBulkDataUploadDto>, bulkDataService: DataExcelService) {
    this._dataExcelService = bulkDataService;
    this.excelModel = excelModel;
  }
  async saveFileUpload(createBulkDataUploadDto: any): Promise<any> {
    this.logger.log(`[service - saveFileUpload ] OK`);
    const responseFormat = await this._dataExcelService.readExcel(createBulkDataUploadDto);
    if (await validationGeneral(responseFormat) === false) {
      throw { code: 400, messages: 'Error en la validación de los datos'};
    }
    const responseMessage = await this.saveDataBulkUpload(responseFormat);
    return responseMessage;
  }
  async saveDataBulkUpload(data: any): Promise<any> {
    try {
      const regexConditions = this.queryUniqueProducts(data);
      const uniqueProducts = this.formatUniqueProducts(data);
    const responseLoad = await this.excelModel.find({ $or: regexConditions }).exec();
    const bulkOps = uniqueProducts.map((item: any) => {
      const query = { product_slug: String(item.product_slug) };
      const update = { $set: { ...item, active: true, update_date: DateNow() }, $setOnInsert: { creation_date: DateNow() }};
      const existingDocument = responseLoad.find(doc => doc?.product_slug == item?.product_slug);
        if (existingDocument) {
          return { updateOne: { filter: query, update: update } };
        } else {
          return { insertOne: { document: { ...update.$set, ...update.$setOnInsert } } };
        }
    });
    await this.excelModel.bulkWrite(bulkOps);
    const responseSave = await this.excelModel.find().exec();
    return responseSave;
    } catch(error) {
      this.logger.error(`[service - saveDataBulkUpload ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }
  queryUniqueProducts(data: any): any {
    const product = data.map(item => item.product_slug);
    let uniqueProductSlugs = [...new Set(product)];
    const regexConditions = uniqueProductSlugs.map(slug => ({
      product_slug: { $regex: slug, $options: 'i' }
    }));
    return regexConditions;
  }
  formatUniqueProducts(data: any): any {
    const uniqueProductsObj = data.reduce((acc, item) => {
      acc[item.product_slug] = item;
      return acc;
    },  {});
    const uniqueProducts = Object.values(uniqueProductsObj);
    return uniqueProducts;
  }
  async productPricefindOne(product_name: string): Promise<any> {
    try {
      this.logger.log(`[service - productfindOne ] OK`);
      const responseProductPric = await this.excelModel.findOne({ product_slug: { $regex: product_name, $options: 'ix' }}).exec();
      if (responseProductPric.length === 0) {
        throw new ProductError(FeedbackErrorCode.ERROR_FIND_PRODUCT, 'No se encontraron resultados asociados al producto.');
      }
      return responseProductPric;
    } catch(error) {
      this.logger.error(`[service - productfindOne ] Error ${JSON.stringify(error)}`);
      throw new ProductError(FeedbackErrorCode.ERROR_FIND_PRODUCT, 'No se encontraron resultados asociados al producto.');
    }
  }
 async removeProductPrice(id: string): Promise<any> {
   try {
      this.logger.log(`[service - removeProductPrice ] OK`);
      const messageSuccess: string = 'El producto se ha eliminado correctamente.';
      const responseDelete = await this.excelModel.findByIdAndDelete({_id: id}).exec();
      if (!responseDelete) {
        throw new ProductError(FeedbackErrorCode.ERROR_REMOVE_PRODUCT, 'No se pudo realizar la eliminacion del registro.');
      }
      return messageSuccess;
    } catch(error) {
      this.logger.error(`[service - removeProductPrice ] Error ${JSON.stringify(error)}`);
      throw new ProductError(FeedbackErrorCode.ERROR_REMOVE_PRODUCT, 'No se pudo realizar la eliminacion del registro.');
    }
  }
  async updateProductPrice(id: string, body: UpdateBulkDataUploadDto): Promise<any> {
    try {
      this.logger.log(`[service - updateProductPrice ] OK`);
      const messageSuccess: string = 'El producto se ha actualizado correctamente.';
      const responseUpdate = await this.excelModel.findByIdAndUpdate({_id: id}, body).exec();
      if (!responseUpdate) {
        throw new ProductError(FeedbackErrorCode.ERROR_UPDATE_PRODUCT, 'No se pudo realizar la actualización del registro.');
      }
      return messageSuccess;
    } catch(error) {
      this.logger.error(`[service - updateProductPrice ] Error ${JSON.stringify(error)}`);
      throw new ProductError(FeedbackErrorCode.ERROR_UPDATE_PRODUCT, 'No se pudo realizar la actualización del registro.');
    }
  }
}
