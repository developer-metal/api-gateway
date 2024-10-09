import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';

@Injectable()
export class DataExcelService {
  private readonly logger = new Logger(DataExcelService.name);

  async readExcel(file: Express.Multer.File): Promise<any> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      const formattedData = json.map((item: any) => {
        const productSlug = item.productSlug;
        const price = String(item.price);
        const currency = item.currency;
        const pill = String(item.pill);
        const priceDescriptionTemplate = item.priceDescriptions;
        const iva = item.iva;
        const discount = String(item.discount);
        const selectors = { price, currency, pill, discount, iva };
        const priceDescription = this.replacePlaceholders(priceDescriptionTemplate, selectors);
        return {
          product_slug: productSlug,
          price: price,
          currency: currency,
          pill: pill,
          price_description: priceDescription,
          iva: iva,
          discount: discount
        };
      });
      return formattedData;
    } catch (error) {
      this.logger.error(`[service - readExcel ] Error ${JSON.stringify(error)}`);
      throw error;
    }
  }
  private replacePlaceholders(template: string, select: { [key: string]: string }): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_val, key) => select[key] ?? '');
  }
}
