import { Injectable, Logger } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { FeedbackErrorCode, ProductError} from '../../../common/enums/error.class';
@Injectable()
export class CsvExportService {
    private readonly logger = new Logger();
    public fecha: Date;
    public pathCustom: string = path.join('./public/feedback.csv');
    async exportCsv(data: any): Promise<any> {
      const jsonData: Array<any> = [];
      let dataCsv: any = {};
      for (const element of data) {
        const {
          product_service,
          count_like,
          count_dislike,
          count_total,
          messages_dislike,
          creation_date,
          update_date
        } = element;
        let messages_notlike = Object.keys(messages_dislike).map((key) => `${key} ${messages_dislike[key]}`).join(', ');
        dataCsv = {
          servicio: product_service,
          like: count_like ?? 0,
          dislike: count_dislike ?? 0,
          messages_dislike: messages_notlike ?? '',
          total: count_total ?? 0,
          fecha_registro: creation_date,
          fecha_actualizacion: update_date
        };
        jsonData.push(dataCsv);
      }
      const csvWriter = createObjectCsvWriter({
        path: this.pathCustom,
        header: [
          { id: 'servicio', title: 'Servicio o Producto' },
          { id: 'like', title: 'Me gusta' },
          { id: 'dislike', title: 'No me gusta' },
          { id: 'messages_dislike', title: 'Mensaje' },
          { id: 'total', title: 'Total Respuestas' },
          { id: 'fecha_registro', title: 'Fecha Registro' },
          { id: 'fecha_actualizacion', title: 'Fecha Actualizacion' }
        ]
      });
      try {
        await csvWriter.writeRecords(jsonData);
        return this.pathCustom;
      } catch (error) {
        this.logger.error(`[service - exportCsv ] Error ${error} `);
        throw new ProductError(FeedbackErrorCode.ERROR_CSV_EXPORT, 'Error al exportar el archivo CSV.');
      }
    }
}