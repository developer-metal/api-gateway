import { Controller, Get, Post, Param, Delete, Logger, Res, HttpStatus, UseInterceptors, UploadedFile, ParseFilePipeBuilder, Query, Patch, Body } from '@nestjs/common';
import { BulkDataUploadService } from '../services/bulk-data-upload.service';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer/multer.config';
import { UpdateBulkDataUploadDto } from '../dto/update-bulk-data-upload.dto';
@Controller('bulk-data-upload')
export class BulkDataUploadController {
  private readonly logger = new Logger(BulkDataUploadController.name);
  private readonly bulkDataService: BulkDataUploadService;
  constructor(_bulkDataService: BulkDataUploadService) {
    this.bulkDataService = _bulkDataService;
  }
  @Post()
  @UseInterceptors(FileInterceptor('market_place', multerOptions))
  @ApiOperation({ summary: 'upload file excel', description: 'Permite subir un archivo excel, para su posterior guardado en BD', operationId: 'saveFileUpload' }) 
  async saveFileUpload(@Res() response: any, @UploadedFile(new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 50000
  })
  .build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  })) file: Express.Multer.File): Promise<any> {
    try {
      this.logger.log(`[controller - saveFileUpload ] OK`);
      const payload = await this.bulkDataService.saveFileUpload(file);
     return response.status(HttpStatus.CREATED).send({code: HttpStatus.CREATED, payload: payload});
    } catch(error) {
    this.logger.error(`[controller - saveFileUpload ] Error ${JSON.stringify(error)}`);
    return response.status(500).send({
      code: error.code,
      error: {
        message: error.message
      }
    });
  }
  }
  @Get()
  @ApiOperation({ summary: 'realiza una busquedad de precio x producto', description: 'Prealiza una busquedad de precio x producto', operationId: 'saveFileUpload' }) 
  async productPricefindOne(@Res() response: any, @Query('slug') slug: string): Promise<any> {
      try {
        this.logger.log(`[controller - productfindOne ] OK`);
        const payloadResponse = await this.bulkDataService.productPricefindOne(slug);
        return response.status(HttpStatus.OK).send({code: HttpStatus.OK, payload: payloadResponse});
      } catch(error) {
        this.logger.error(`[controller - productfindOne ] Error ${JSON.stringify(error)}`);
        return response.status(500).send({
          code: error.code,
          error: {
            message: error.message
          }
        });
      }
  }
  @Delete(':id')
  @ApiOperation({ summary: 'eliminacion de informacion de producto', description: 'eliminacion de informacion de producto', operationId: 'saveFileUpload' }) 
  async removeProductPrice(@Res() response: any, @Param('id') id: string): Promise<any> {
    try {
      this.logger.log(`[controller - removeProductPrice ] OK`);
      const deleteProductPrice = await this.bulkDataService.removeProductPrice(id);
      return response.status(HttpStatus.OK).send({code: HttpStatus.OK, payload: deleteProductPrice});
    } catch(error) {
      this.logger.error(`[controller - removeProductPrice ] Error ${JSON.stringify(error)}`);
      return response.status(500).send({
        code: error.code,
        error: {
          message: error.message
        }
      });
    }
  }
  @Patch(':id')
  @ApiOperation({ summary: 'actualizacion de informacion producto', description: 'eliminacion de informacion producto', operationId: 'updateProductPrice' }) 
  async updateProductPrice(@Res() response: any, @Param('id') id: string, @Body() updateProduct: UpdateBulkDataUploadDto): Promise<any> {
    try {
      this.logger.log(`[controller - updateProductPrice ] OK`);
      const updateProductPrice = await this.bulkDataService.updateProductPrice(id, updateProduct);
      return response.status(HttpStatus.OK).send({code: HttpStatus.OK, payload: updateProductPrice});
    } catch(error) {
      this.logger.error(`[controller - updateProductPrice ] Error ${JSON.stringify(error)}`);
      return response.status(500).send({
        code: error.code,
        error: {
          message: error.message
        }
      });
    }
  }
}
